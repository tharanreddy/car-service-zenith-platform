import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { User, Save, Settings, History } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { VehicleManagement } from './VehicleManagement';
import { ServiceHistory } from './ServiceHistory';
import type { UserProfile } from '@/pages/Index';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ userProfile, setUserProfile }) => {
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUserProfile({ ...userProfile, [field]: value });
  };

  const handlePreferenceChange = (field: keyof UserProfile['preferences'], value: boolean) => {
    setUserProfile({
      ...userProfile,
      preferences: {
        ...(userProfile.preferences || { notifications: true, reminders: true }),
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated!",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning/10 to-success/10 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Profile</h1>
          <p className="text-lg text-muted-foreground">
            Manage your personal information, vehicles, and service history
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
            <TabsTrigger value="history">Service History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => {
                        const value = e.target.value;
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
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                        let value = e.target.value;
                        value = value.replace(/[^0-9+]/g, '');
                        
                        if (value.startsWith('+91')) {
                          if (value.length <= 13) {
                            handleInputChange('phone', value);
                          }
                        } else if (value.startsWith('+1')) {
                          if (value.length <= 12) {
                            handleInputChange('phone', value);
                          }
                        } else if (value.startsWith('+')) {
                          if (value.length <= 15) {
                            handleInputChange('phone', value);
                          }
                        } else {
                          if (value.length <= 10) {
                            handleInputChange('phone', value);
                          }
                        }
                      }}
                      placeholder="e.g., +91 9876543210"
                    />
                  </div>
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

                <Button onClick={handleSave} className="w-full md:w-auto" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <VehicleManagement userProfile={userProfile} setUserProfile={setUserProfile} />
          </TabsContent>

          <TabsContent value="history">
            <ServiceHistory userProfile={userProfile} setUserProfile={setUserProfile} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about service updates
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences?.notifications ?? true}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Service Reminders</label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders for regular maintenance
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences?.reminders ?? true}
                      onCheckedChange={(checked) => handlePreferenceChange('reminders', checked)}
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full md:w-auto" size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};