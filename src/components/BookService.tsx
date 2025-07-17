import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { BookingData } from '@/pages/Index';

interface BookServiceProps {
  onComplete: (booking: BookingData) => void;
  onNavigate: (page: string) => void;
}

export const BookService: React.FC<BookServiceProps> = ({ onComplete, onNavigate }) => {
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    contactNumber: '',
    pickupAddress: '',
    carModel: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
  });
  const [date, setDate] = useState<Date>();
  const [customService, setCustomService] = useState('');

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contactNumber || !formData.serviceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const completeBooking = {
      ...formData,
      preferredDate: date ? format(date, 'yyyy-MM-dd') : formData.preferredDate,
    };

    onComplete(completeBooking);
    toast({
      title: "Service Booked Successfully!",
      description: "Your service request has been submitted. Proceed to payment.",
    });
    onNavigate('payments');
  };

  const serviceTypes = [
    "Basic Service",
    "Full Service", 
    "Engine Repair",
    "Wheel Alignment",
    "Car Wash",
    "Denting & Painting",
    "Other"
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">Book Your Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow letters and spaces
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      handleInputChange('name', value);
                    }
                  }}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Remove all non-digit characters except +, -, space, and parentheses
                    value = value.replace(/[^0-9+\-\s()]/g, '');
                    
                    // Limit to reasonable phone number length
                    if (value.length <= 17) {
                      // Auto-format for common patterns
                      if (value.startsWith('+91') && value.length > 3) {
                        // Indian format: +91 XXXXX XXXXX
                        value = value.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3');
                      } else if (value.startsWith('+1') && value.length > 2) {
                        // US format: +1 (XXX) XXX-XXXX
                        value = value.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
                      }
                      handleInputChange('contactNumber', value);
                    }
                  }}
                  placeholder="e.g., +91 98765 43210 or +1 (555) 123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Pickup Address</Label>
                <Textarea
                  id="address"
                  value={formData.pickupAddress}
                  onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                  placeholder="Enter your complete address for car pickup"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carModel">Car Model</Label>
                <Input
                  id="carModel"
                  value={formData.carModel}
                  onChange={(e) => handleInputChange('carModel', e.target.value)}
                  placeholder="e.g., Honda Civic, Toyota Camry"
                />
              </div>

              <div className="space-y-2">
                <Label>Select Service Type</Label>
                <Select onValueChange={(value) => {
                  handleInputChange('serviceType', value);
                  if (value !== 'Other') setCustomService('');
                }} required>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Choose Service --" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.serviceType === 'Other' && (
                  <Input
                    placeholder="Type anything - describe your specific service needs"
                    value={customService}
                    onChange={(e) => {
                      setCustomService(e.target.value);
                      handleInputChange('serviceType', `Other: ${e.target.value}`);
                    }}
                    className="mt-2"
                    required
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Preferred Time</Label>
                <Select onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="--:--" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" variant="success" size="lg" className="w-full mt-8">
                Request Service
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};