import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { BookService } from '@/components/BookService';
import { Payment } from '@/components/Payment';
import { Feedback } from '@/components/Feedback';
import { Contact } from '@/components/Contact';
import { Profile } from '@/components/Profile';
import { Chat } from '@/components/Chat';

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  carMake: string;
  carModel: string;
  carYear: string;
  licensePlate: string;
};

export type BookingData = {
  name: string;
  contactNumber: string;
  pickupAddress: string;
  carModel: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
};

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    carMake: '',
    carModel: '',
    carYear: '',
    licensePlate: '',
  });
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const updateProfileFromBooking = (booking: BookingData) => {
    setBookingData(booking);
    setUserProfile(prev => ({
      ...prev,
      name: booking.name || prev.name,
      phone: booking.contactNumber || prev.phone,
      address: booking.pickupAddress || prev.address,
      carModel: booking.carModel || prev.carModel,
    }));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero onNavigate={setCurrentPage} />;
      case 'book-service':
        return <BookService onComplete={updateProfileFromBooking} onNavigate={setCurrentPage} />;
      case 'payments':
        return <Payment bookingData={bookingData} onComplete={setPaymentData} />;
      case 'feedback':
        return <Feedback />;
      case 'contact':
        return <Contact />;
      case 'profile':
        return <Profile userProfile={userProfile} setUserProfile={setUserProfile} />;
      case 'chat':
        return <Chat />;
      default:
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
};

export default Index;