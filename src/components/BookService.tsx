import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import type { BookingData, UserProfile } from '@/pages/Index';

interface BookServiceProps {
  onComplete: (booking: BookingData) => void;
  onNavigate: (page: string) => void;
  userProfile: UserProfile;
}

export const BookService: React.FC<BookServiceProps> = ({ onComplete, onNavigate, userProfile }) => {
  const [formData, setFormData] = useState<Omit<BookingData, 'id' | 'status' | 'createdAt'>>({
    name: userProfile.name || '',
    contactNumber: userProfile.phone || '',
    pickupAddress: userProfile.address || '',
    vehicleId: userProfile.vehicles.find(v => v.isDefault)?.id || userProfile.vehicles[0]?.id || '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    photos: [],
    specialInstructions: '',
  });
  const [date, setDate] = useState<Date>();
  const [customService, setCustomService] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setUploadedPhotos(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.contactNumber || !formData.serviceType || !formData.vehicleId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const completeBooking: BookingData = {
      id: Date.now().toString(),
      ...formData,
      preferredDate: date ? format(date, 'yyyy-MM-dd') : formData.preferredDate,
      photos: uploadedPhotos,
      status: 'pending',
      createdAt: new Date().toISOString(),
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
    "Brake Service",
    "AC Service",
    "Battery Replacement",
    "Tire Replacement",
    "Other"
  ];

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  const getVehicleDisplay = (vehicle: any) => {
    return `${vehicle.make} ${vehicle.model} (${vehicle.year})${vehicle.licensePlate ? ` - ${vehicle.licensePlate}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">Book Your Service</CardTitle>
            <p className="text-muted-foreground">Schedule a professional car service</p>
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
                <div className="flex gap-2">
                  <Select defaultValue="+91" onValueChange={(value) => {
                    const currentNumber = formData.contactNumber.replace(/^(\+\d+\s?)/, '');
                    handleInputChange('contactNumber', value + ' ' + currentNumber);
                  }}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                      <SelectItem value="+33">🇫🇷 +33</SelectItem>
                      <SelectItem value="+49">🇩🇪 +49</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="contact"
                    type="tel"
                    className="flex-1"
                    value={formData.contactNumber.replace(/^(\+\d+\s?)/, '')}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      const countryCode = formData.contactNumber.match(/^(\+\d+)/)?.[1] || '+91';
                      
                      let maxLength = 10;
                      if (countryCode === '+1') maxLength = 10;
                      else if (countryCode === '+44') maxLength = 10;
                      else if (countryCode === '+91') maxLength = 10;
                      
                      if (value.length <= maxLength) {
                        handleInputChange('contactNumber', countryCode + ' ' + value);
                      }
                    }}
                    placeholder="9876543210"
                    required
                  />
                </div>
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
                <Label>Select Vehicle</Label>
                {userProfile.vehicles.length === 0 ? (
                  <div className="p-4 border border-dashed rounded-lg text-center">
                    <p className="text-muted-foreground mb-2">No vehicles found</p>
                    <Button type="button" variant="outline" onClick={() => onNavigate('profile')}>
                      Add Vehicle in Profile
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) => handleInputChange('vehicleId', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {userProfile.vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {getVehicleDisplay(vehicle)}
                          {vehicle.isDefault && ' (Default)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label>Select Service Type</Label>
                <Select
                  onValueChange={(value) => {
                    if (value === 'Other') {
                      handleInputChange('serviceType', 'Other');
                    } else {
                      handleInputChange('serviceType', value);
                      setCustomService('');
                    }
                  }}
                  required
                >
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
                  <div className="mt-2">
                    <Input
                      placeholder="Describe your specific service needs"
                      value={customService}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomService(value);
                        handleInputChange('serviceType', value ? `Other: ${value}` : 'Other');
                      }}
                      className="w-full"
                      required
                    />
                  </div>
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

              <div className="space-y-2">
                <Label>Upload Photos (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                  Upload photos of any issues to help our technicians prepare better
                </p>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload photos
                    </span>
                  </label>
                </div>
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any specific requirements or instructions for the technician"
                  rows={3}
                />
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full mt-8">
                Request Service
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};