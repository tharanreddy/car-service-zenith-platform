import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          phone?: string
          address?: string
        }
        Update: {
          full_name?: string
          phone?: string
          address?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          make: string
          model: string
          year: number
          registration_number: string
          created_at: string
        }
        Insert: {
          user_id: string
          make: string
          model: string
          year: number
          registration_number: string
        }
        Update: {
          make?: string
          model?: string
          year?: number
          registration_number?: string
        }
      }
      bookings: {
        Row: {
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
        Insert: {
          user_id: string
          vehicle_id: string
          service_type: string
          amount: number
          preferred_date: string
          preferred_time: string
          pickup_address: string
          special_instructions?: string
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          amount?: number
          preferred_date?: string
          preferred_time?: string
          pickup_address?: string
          special_instructions?: string
        }
      }
      service_photos: {
        Row: {
          id: string
          booking_id: string
          photo_url: string
          created_at: string
        }
        Insert: {
          booking_id: string
          photo_url: string
        }
        Update: {
          photo_url?: string
        }
      }
    }
  }
}