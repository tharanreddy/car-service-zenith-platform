import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Car, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { UserProfile } from '@/pages/Index';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ userProfile, setUserProfile }) => {
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUserProfile({ ...userProfile, [field]: value });
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated!",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning/10 to-success/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your personal information and car details
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userProfile.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow letters and spaces
                    if (/^[a-zA-Z\s]*$/.test(value)) {
                      handleInputChange('name', value);
                    }
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Basic email validation
                    handleInputChange('email', value);
                  }}
                  placeholder="e.g., john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and common phone characters
                    if (/^[0-9+\-\s()]*$/.test(value)) {
                      handleInputChange('phone', value);
                    }
                  }}
                  placeholder="e.g., +91 9876543210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={userProfile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main St, Apt 4B, City, State, 12345"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Car Details */}
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-6 w-6" />
                Car Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="carMake">Car Make</Label>
                <Input
                  id="carMake"
                  value={userProfile.carMake}
                  onChange={(e) => handleInputChange('carMake', e.target.value)}
                  placeholder="Toyota"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carModel">Car Model</Label>
                <Input
                  id="carModel"
                  value={userProfile.carModel}
                  onChange={(e) => handleInputChange('carModel', e.target.value)}
                  placeholder="Camry"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carYear">Car Year</Label>
                <Input
                  id="carYear"
                  value={userProfile.carYear}
                  onChange={(e) => handleInputChange('carYear', e.target.value)}
                  placeholder="2020"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={userProfile.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  placeholder="MH12AB1234"
                />
              </div>

              <Button onClick={handleSave} className="w-full mt-6" size="lg">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};