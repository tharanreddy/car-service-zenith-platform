import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Wallet, Smartphone, CheckCircle, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { BookingData } from '@/pages/Index';

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentProps {
  bookingData: BookingData | null;
  onComplete: (paymentData: any) => void;
}

export const Payment: React.FC<PaymentProps> = ({ bookingData, onComplete }) => {
  // Check if booking data exists
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/10 to-red-500/10 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm text-center">
            <CardContent className="py-12">
              <div className="text-destructive mb-6">
                <svg className="h-20 w-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-destructive mb-4">Book Your Service</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Warning: Please complete your service booking first before proceeding to payment.
              </p>
              <Button 
                onClick={() => {
                  // Navigate back to booking section
                  const event = new CustomEvent('navigate-to-booking');
                  window.dispatchEvent(event);
                }}
                variant="default" 
                size="lg"
              >
                Go Back to Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    bankName: '',
    walletNumber: ''
  });

  const serviceId = "#SVC" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const amount = getServiceAmount(bookingData?.serviceType || '');

  function getServiceAmount(serviceType: string): number {
    const prices: { [key: string]: number } = {
      "Oil Change": 2999,
      "Brake Service": 4999,
      "Engine Diagnostic": 3999,
      "Tire Rotation": 1999,
      "Battery Replacement": 5999,
      "AC Service": 3499,
      "Full Service": 7999,
    };
    return prices[serviceType] || 3999;
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProgress(20);

    try {
      // Create Razorpay order
      const response = await fetch('https://boynjyevftdodqnujkdn.supabase.co/functions/v1/razorpay-payment?action=create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Amount in paise
          currency: 'INR',
          bookingData: bookingData
        }),
      });

      const orderData = await response.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      setProgress(40);

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      setProgress(60);

      // Configure Razorpay options
      const options = {
        key: orderData.order.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Car Service Hub',
        description: `${bookingData?.serviceType || 'Car Service'} for ${bookingData?.vehicleId || 'Vehicle'}`,
        order_id: orderData.order.id,
        prefill: {
          name: bookingData?.name || '',
          contact: bookingData?.contactNumber || '',
        },
        theme: {
          color: '#3B82F6'
        },
        handler: async function (response: any) {
          setProgress(80);
          
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('https://boynjyevftdodqnujkdn.supabase.co/functions/v1/razorpay-payment?action=verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setProgress(100);
              setProcessing(false);
              setCompleted(true);
              
              const paymentData = {
                serviceId,
                amount: amount / 100,
                method: 'razorpay',
                status: 'completed',
                timestamp: new Date().toISOString(),
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
              };
              
              onComplete(paymentData);
              
              toast({
                title: "Payment Successful!",
                description: `Your payment of ₹${(amount / 100).toFixed(2)} has been processed.`,
              });
              
              // Auto-navigate to feedback after 3 seconds
              setTimeout(() => {
                const event = new CustomEvent('navigate-to-feedback');
                window.dispatchEvent(event);
              }, 3000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was debited.",
              variant: "destructive",
            });
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user.",
              variant: "destructive",
            });
          }
        }
      };

      setProgress(70);

      // Open Razorpay checkout
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred while processing payment.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-success mb-4">Payment Successful!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Your service has been booked and payment processed successfully.
              </p>
              <div className="bg-success/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">Service ID: <span className="font-semibold">{serviceId}</span></p>
                <p className="text-sm text-muted-foreground">Amount: <span className="font-semibold">₹{(amount / 100).toFixed(2)}</span></p>
              </div>
              <Button 
                onClick={() => {
                  const event = new CustomEvent('navigate-to-booking');
                  window.dispatchEvent(event);
                }}
                variant="default" 
                size="lg"
                className="w-full mb-4"
              >
                Book Again
              </Button>
              <Button 
                onClick={() => {
                  const event = new CustomEvent('navigate-to-feedback');
                  window.dispatchEvent(event);
                }}
                variant="outline" 
                size="lg"
                className="w-full"
              >
                Give Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-500/10 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">Complete Your Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Details */}
            <div className="bg-accent/20 rounded-lg p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service ID:</span>
                <span className="font-semibold text-primary">{serviceId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer Name:</span>
                <span className="font-semibold">{bookingData?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Type:</span>
                <span className="font-semibold">{bookingData?.serviceType || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span className="text-success">Amount Due:</span>
                <span className="text-success">₹{(amount / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Payment Method</h3>
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">UPI Payment</p>
                      <p className="text-sm text-muted-foreground">Pay using PhonePe, Google Pay, Paytm</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'credit-card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('credit-card')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay accepted</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'net-banking' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('net-banking')}
                >
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Net Banking</p>
                      <p className="text-sm text-muted-foreground">All major banks supported</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Digital Wallet</p>
                      <p className="text-sm text-muted-foreground">Paytm, Amazon Pay, MobiKwik</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Forms */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold">UPI Details</h4>
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input
                    value={paymentDetails.upiId}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
                    placeholder="user@paytm / user@phonepay / user@googlePay"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'credit-card' && (
              <div className="space-y-4 bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold">Card Details</h4>
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    value={paymentDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 16) {
                        setPaymentDetails(prev => ({ ...prev, cardNumber: value }));
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      value={paymentDetails.cardExpiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        let formatted = value;
                        if (value.length >= 2) {
                          formatted = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        if (formatted.length <= 5) {
                          setPaymentDetails(prev => ({ ...prev, cardExpiry: formatted }));
                        }
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      value={paymentDetails.cardCvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          setPaymentDetails(prev => ({ ...prev, cardCvv: value }));
                        }
                      }}
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cardholder Name</Label>
                  <Input
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardName: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'net-banking' && (
              <div className="space-y-4 bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold">Bank Details</h4>
                <div className="space-y-2">
                  <Label>Select Bank</Label>
                  <Select onValueChange={(value) => setPaymentDetails(prev => ({ ...prev, bankName: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sbi">State Bank of India</SelectItem>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                      <SelectItem value="pnb">Punjab National Bank</SelectItem>
                      <SelectItem value="boi">Bank of India</SelectItem>
                      <SelectItem value="canara">Canara Bank</SelectItem>
                      <SelectItem value="union">Union Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="space-y-4 bg-accent/20 p-4 rounded-lg">
                <h4 className="font-semibold">Digital Wallet</h4>
                <div className="space-y-2">
                  <Label>Wallet Phone Number</Label>
                  <Input
                    value={paymentDetails.walletNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setPaymentDetails(prev => ({ ...prev, walletNumber: value }));
                      }
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </div>
            )}

            {/* Processing Animation */}
            {processing && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Processing Payment...</p>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">{progress}% Complete</p>
                </div>
              </div>
            )}

            {/* Confirm Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={processing}
              variant="default" 
              size="lg" 
              className="w-full mt-8"
            >
              {processing ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};