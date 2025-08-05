import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Car, Clock, Star, Download, Eye, RotateCcw, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { ServiceRecord, UserProfile, Vehicle } from '@/pages/Index';

interface ServiceHistoryProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export const ServiceHistory: React.FC<ServiceHistoryProps> = ({ userProfile, setUserProfile }) => {
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const getStatusColor = (status: ServiceRecord['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'technician-assigned': return 'bg-yellow-500';
      case 'in-progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ServiceRecord['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'technician-assigned': return 'Technician Assigned';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getVehicleName = (vehicleId: string): string => {
    const vehicle = userProfile.vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const handleCancelBooking = (recordId: string) => {
    const updatedHistory = userProfile.serviceHistory.map(record =>
      record.id === recordId ? { ...record, status: 'cancelled' as const } : record
    );

    setUserProfile({
      ...userProfile,
      serviceHistory: updatedHistory,
    });

    toast({
      title: "Booking Cancelled",
      description: "Your service booking has been cancelled successfully.",
    });
  };

  const handleReschedule = (recordId: string) => {
    // In a real app, this would open a rescheduling form
    toast({
      title: "Reschedule Service",
      description: "Rescheduling feature will be available soon. Please contact support.",
    });
  };

  const submitRating = () => {
    if (!selectedRecord || rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    const updatedHistory = userProfile.serviceHistory.map(record =>
      record.id === selectedRecord.id 
        ? { ...record, rating, feedback }
        : record
    );

    setUserProfile({
      ...userProfile,
      serviceHistory: updatedHistory,
    });

    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    });

    setSelectedRecord(null);
    setRating(0);
    setFeedback('');
  };

  const downloadInvoice = (record: ServiceRecord) => {
    // In a real app, this would download the actual invoice
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for ${record.serviceType} has been downloaded.`,
    });
  };

  const sortedHistory = [...userProfile.serviceHistory].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Service History</h2>
        <p className="text-muted-foreground">
          Track your past and current service bookings
        </p>
      </div>

      {sortedHistory.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Service History</h3>
            <p className="text-muted-foreground mb-4">
              You haven't booked any services yet.
            </p>
            <Button onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-booking'))}>
              Book Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedHistory.map((record) => (
            <Card key={record.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{record.serviceType}</h3>
                    <p className="text-muted-foreground text-sm">
                      Service ID: #{record.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(record.status)} text-white`}>
                    {getStatusText(record.status)}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4" />
                      <span>{getVehicleName(record.vehicleId)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{record.time}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Amount: </span>
                      <span className="text-green-600 font-semibold">₹{record.amount}</span>
                    </div>
                    {record.technicianName && (
                      <div className="text-sm">
                        <span className="font-medium">Technician: </span>
                        <span>{record.technicianName}</span>
                      </div>
                    )}
                    {record.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-medium">Rating: </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < record.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Service Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Service Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Service:</span> {record.serviceType}</p>
                            <p><span className="font-medium">Vehicle:</span> {getVehicleName(record.vehicleId)}</p>
                            <p><span className="font-medium">Date & Time:</span> {new Date(record.date).toLocaleDateString()} at {record.time}</p>
                            <p><span className="font-medium">Amount:</span> ₹{record.amount}</p>
                          </div>
                        </div>
                        {record.technicianName && (
                          <div>
                            <h4 className="font-semibold mb-2">Technician Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {record.technicianName}</p>
                              {record.technicianPhone && (
                                <p><span className="font-medium">Phone:</span> {record.technicianPhone}</p>
                              )}
                            </div>
                          </div>
                        )}
                        {record.feedback && (
                          <div>
                            <h4 className="font-semibold mb-2">Your Feedback</h4>
                            <p className="text-sm bg-muted p-2 rounded">{record.feedback}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {record.status === 'completed' && (
                    <Button variant="outline" size="sm" onClick={() => downloadInvoice(record)}>
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </Button>
                  )}

                  {record.status === 'completed' && !record.rating && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-1" />
                          Rate Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Rate Your Service</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Rating</label>
                            <div className="flex gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Feedback (Optional)</label>
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              className="w-full mt-1 p-2 border rounded-md text-sm"
                              rows={3}
                              placeholder="Share your experience..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setRating(0)} className="flex-1">
                              Cancel
                            </Button>
                            <Button onClick={submitRating} className="flex-1">
                              Submit Rating
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {(record.status === 'confirmed' || record.status === 'technician-assigned') && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleReschedule(record.id)}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(record.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};