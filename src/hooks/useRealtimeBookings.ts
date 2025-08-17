import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'

interface Booking {
  id: string
  user_id: string
  vehicle_id: string
  service_type: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  amount: number
  preferred_date: string
  preferred_time: string
  pickup_address: string
  special_instructions?: string
  created_at: string
  updated_at: string
}

export const useRealtimeBookings = (userId?: string) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch initial bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBookings(data || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userId])

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return

    const subscription = supabase
      .channel('user-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Real-time booking update:', payload)
          
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as Booking, ...prev])
            toast({
              title: "Booking Confirmed!",
              description: "Your service booking has been confirmed."
            })
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => 
              prev.map(booking => 
                booking.id === payload.new.id 
                  ? { ...booking, ...payload.new as Booking }
                  : booking
              )
            )
            
            // Show status update notifications
            const newStatus = (payload.new as Booking).status
            if (newStatus === 'confirmed') {
              toast({
                title: "Booking Confirmed!",
                description: "Your service has been confirmed by our team."
              })
            } else if (newStatus === 'in_progress') {
              toast({
                title: "Service Started",
                description: "Our technician has started working on your vehicle."
              })
            } else if (newStatus === 'completed') {
              toast({
                title: "Service Completed!",
                description: "Your vehicle service has been completed."
              })
            }
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => 
              prev.filter(booking => booking.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId])

  // Create new booking
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive"
      })
      throw error
    }
  }

  // Update booking status
  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      })
      throw error
    }
  }

  return {
    bookings,
    loading,
    createBooking,
    updateBookingStatus
  }
}