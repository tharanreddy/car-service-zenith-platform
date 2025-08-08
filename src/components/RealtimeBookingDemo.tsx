import React, { useState } from 'react'
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings'
import { useFileStorage } from '@/hooks/useFileStorage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Image, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface RealtimeBookingDemoProps {
  userId: string
}

export const RealtimeBookingDemo: React.FC<RealtimeBookingDemoProps> = ({ userId }) => {
  const { bookings, loading, createBooking, updateBookingStatus } = useRealtimeBookings(userId)
  const { uploading, uploadProgress, uploadServicePhoto, getBookingPhotos } = useFileStorage()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleUploadPhotos = async (bookingId: string) => {
    try {
      for (const file of selectedFiles) {
        await uploadServicePhoto(file, bookingId)
      }
      setSelectedFiles([])
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'confirmed': return 'blue'
      case 'in_progress': return 'orange'
      case 'completed': return 'green'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  if (loading) {
    return <div className="p-4">Loading bookings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time Bookings</h2>
        <Badge variant="outline">{bookings.length} Active Bookings</Badge>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No bookings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{booking.service_type}</CardTitle>
                  <Badge variant="outline" className={`bg-${getStatusColor(booking.status)}-50 text-${getStatusColor(booking.status)}-700`}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date:</span> {booking.preferred_date}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {booking.preferred_time}
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> ₹{booking.amount}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> {booking.pickup_address}
                  </div>
                </div>

                {booking.special_instructions && (
                  <div className="text-sm">
                    <span className="font-medium">Instructions:</span> {booking.special_instructions}
                  </div>
                )}

                {/* Photo Upload Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="h-4 w-4" />
                    <span className="font-medium text-sm">Service Photos</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUploadPhotos(booking.id)}
                      disabled={uploading || selectedFiles.length === 0}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  </div>

                  {uploading && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Update Buttons */}
                <div className="flex gap-2 pt-2">
                  {booking.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                    >
                      Start Service
                    </Button>
                  )}
                  {booking.status === 'in_progress' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                    >
                      Complete
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}