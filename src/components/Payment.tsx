import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Wallet, Smartphone, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { BookingData } from '@/pages/Index';

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
              <h2 className="text-3xl font-bold text-destructive mb-4">No Booking Found</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Please complete your service booking first before proceeding to payment.
              </p>
              <Button 
                onClick={() => window.location.reload()}
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
    setProgress(0);

    // Simulate payment processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setCompleted(true);
          
          const paymentData = {
            serviceId,
            amount: amount / 100,
            method: paymentMethod,
            status: 'completed',
            timestamp: new Date().toISOString(),
          };
          
          onComplete(paymentData);
          
          toast({
            title: "Payment Successful!",
            description: `Your payment of ₹${(amount / 100).toFixed(2)} has been processed.`,
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Select Method --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="upi">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      UPI Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="net-banking">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Net Banking
                    </div>
                  </SelectItem>
                  <SelectItem value="wallet">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Digital Wallet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

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