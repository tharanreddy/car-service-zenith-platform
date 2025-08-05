import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Plus, Edit, Trash2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Vehicle, UserProfile } from '@/pages/Index';

interface VehicleManagementProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export const VehicleManagement: React.FC<VehicleManagementProps> = ({ userProfile, setUserProfile }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Omit<Vehicle, 'id'>>({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    color: '',
    mileage: '',
    isDefault: false,
  });

  const handleInputChange = (field: keyof Omit<Vehicle, 'id'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.year) {
      toast({
        title: "Missing Information",
        description: "Please fill in make, model, and year.",
        variant: "destructive",
      });
      return;
    }

    const vehicleData: Vehicle = {
      id: editingVehicle?.id || Date.now().toString(),
      ...formData,
    };

    let updatedVehicles = editingVehicle
      ? userProfile.vehicles.map(v => v.id === editingVehicle.id ? vehicleData : v)
      : [...userProfile.vehicles, vehicleData];

    // If this is set as default, remove default from others
    if (vehicleData.isDefault) {
      updatedVehicles = updatedVehicles.map(v => 
        v.id === vehicleData.id ? v : { ...v, isDefault: false }
      );
    }

    setUserProfile({
      ...userProfile,
      vehicles: updatedVehicles,
    });

    toast({
      title: editingVehicle ? "Vehicle Updated!" : "Vehicle Added!",
      description: `${vehicleData.make} ${vehicleData.model} has been ${editingVehicle ? 'updated' : 'added'} successfully.`,
    });

    resetForm();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      color: vehicle.color,
      mileage: vehicle.mileage,
      isDefault: vehicle.isDefault,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (vehicleId: string) => {
    if (userProfile.vehicles.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one vehicle.",
        variant: "destructive",
      });
      return;
    }

    const vehicleToDelete = userProfile.vehicles.find(v => v.id === vehicleId);
    const updatedVehicles = userProfile.vehicles.filter(v => v.id !== vehicleId);

    // If deleted vehicle was default, make first remaining vehicle default
    if (vehicleToDelete?.isDefault && updatedVehicles.length > 0) {
      updatedVehicles[0].isDefault = true;
    }

    setUserProfile({
      ...userProfile,
      vehicles: updatedVehicles,
    });

    toast({
      title: "Vehicle Deleted",
      description: "Vehicle has been removed from your profile.",
    });
  };

  const setAsDefault = (vehicleId: string) => {
    const updatedVehicles = userProfile.vehicles.map(v => ({
      ...v,
      isDefault: v.id === vehicleId,
    }));

    setUserProfile({
      ...userProfile,
      vehicles: updatedVehicles,
    });

    toast({
      title: "Default Vehicle Updated",
      description: "This vehicle is now your default choice.",
    });
  };

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      color: '',
      mileage: '',
      isDefault: false,
    });
    setEditingVehicle(null);
    setIsDialogOpen(false);
  };

  return (
    <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            My Vehicles
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      placeholder="Toyota"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="Camry"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          handleInputChange('year', value);
                        }
                      }}
                      placeholder="2020"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="Blue"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                    placeholder="MH12AB1234"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input
                    id="mileage"
                    value={formData.mileage}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('mileage', value);
                    }}
                    placeholder="45000"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isDefault">Set as default vehicle</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingVehicle ? 'Update' : 'Add'} Vehicle
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {userProfile.vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No vehicles added yet</p>
            <p className="text-sm">Add your first vehicle to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userProfile.vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">
                      {vehicle.make} {vehicle.model} ({vehicle.year})
                    </h3>
                    {vehicle.isDefault && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {vehicle.licensePlate && <p>License: {vehicle.licensePlate}</p>}
                    {vehicle.color && <p>Color: {vehicle.color}</p>}
                    {vehicle.mileage && <p>Mileage: {parseInt(vehicle.mileage).toLocaleString()} km</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!vehicle.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAsDefault(vehicle.id)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};