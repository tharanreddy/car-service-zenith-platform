import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/components/ui/use-toast'

export const useFileStorage = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadServicePhoto = async (file: File, bookingId: string) => {
    try {
      setUploading(true)
      setUploadProgress(0)

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${bookingId}/${Date.now()}.${fileExt}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('service-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('service-photos')
        .getPublicUrl(fileName)

      // Save photo record to database
      const { error: dbError } = await supabase
        .from('service_photos')
        .insert([
          {
            booking_id: bookingId,
            photo_url: urlData.publicUrl
          }
        ])

      if (dbError) throw dbError

      setUploadProgress(100)
      toast({
        title: "Photo uploaded!",
        description: "Your service photo has been uploaded successfully."
      })

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      })
      throw error
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadMultiplePhotos = async (files: File[], bookingId: string) => {
    const uploadPromises = files.map(file => uploadServicePhoto(file, bookingId))
    try {
      const results = await Promise.all(uploadPromises)
      return results
    } catch (error) {
      console.error('Error uploading multiple photos:', error)
      throw error
    }
  }

  const deletePhoto = async (photoUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = photoUrl.split('/')
      const fileName = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1]

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('service-photos')
        .remove([fileName])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('service_photos')
        .delete()
        .eq('photo_url', photoUrl)

      if (dbError) throw dbError

      toast({
        title: "Photo deleted",
        description: "Photo has been removed successfully."
      })
    } catch (error) {
      console.error('Error deleting photo:', error)
      toast({
        title: "Delete failed",
        description: "Failed to delete photo. Please try again.",
        variant: "destructive"
      })
      throw error
    }
  }

  const getBookingPhotos = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_photos')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching photos:', error)
      return []
    }
  }

  return {
    uploading,
    uploadProgress,
    uploadServicePhoto,
    uploadMultiplePhotos,
    deletePhoto,
    getBookingPhotos
  }
}