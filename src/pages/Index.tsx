import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { BookService } from '@/components/BookService';
import { Payment } from '@/components/Payment';
import { Feedback } from '@/components/Feedback';
import { Contact } from '@/components/Contact';
import { Profile } from '@/components/Profile';
import { Chat } from '@/components/Chat';
import { Auth } from '@/components/Auth';

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

export type UserData = {
  email: string;
  password: string;
  name: string;
  profile: UserProfile;
  bookingData: BookingData | null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<Array<UserData>>(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('quickcar_users');
    return saved ? JSON.parse(saved) : [];
  });
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

  // Save users to localStorage whenever registeredUsers changes
  React.useEffect(() => {
    localStorage.setItem('quickcar_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const handleAuthSuccess = (user: { name: string; email: string }) => {
    setCurrentUserEmail(user.email);
    // Load user-specific data
    const userData = registeredUsers.find(u => u.email === user.email);
    if (userData) {
      setUserProfile(userData.profile);
      setBookingData(userData.bookingData);
    } else {
      setUserProfile({
        name: user.name,
        email: user.email,
        phone: '',
        address: '',
        carMake: '',
        carModel: '',
        carYear: '',
        licensePlate: '',
      });
    }
    setIsAuthenticated(true);
  };

  const handleRegister = (userData: { name: string; email: string; password: string }) => {
    const newUser: UserData = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      profile: {
        name: userData.name,
        email: userData.email,
        phone: '',
        address: '',
        carMake: '',
        carModel: '',
        carYear: '',
        licensePlate: '',
      },
      bookingData: null
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    handleAuthSuccess({ name: userData.name, email: userData.email });
  };

  const handleLogin = (email: string, password: string) => {
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (user) {
      handleAuthSuccess({ name: user.name, email: user.email });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile({
      name: '',
      email: '',
      phone: '',
      address: '',
      carMake: '',
      carModel: '',
      carYear: '',
      licensePlate: '',
    });
    setBookingData(null);
    setPaymentData(null);
    setCurrentPage('home');
  };

  // Handle navigation to booking from payment
  React.useEffect(() => {
    const handleNavigateToBooking = () => {
      setCurrentPage('book-service');
    };
    window.addEventListener('navigate-to-booking', handleNavigateToBooking);
    return () => window.removeEventListener('navigate-to-booking', handleNavigateToBooking);
  }, []);

  const updateProfileFromBooking = (booking: BookingData) => {
    setBookingData(booking);
    const updatedProfile = {
      ...userProfile,
      name: booking.name || userProfile.name,
      phone: booking.contactNumber || userProfile.phone,
      address: booking.pickupAddress || userProfile.address,
      carModel: booking.carModel || userProfile.carModel,
    };
    setUserProfile(updatedProfile);
    
    // Update user data in storage
    setRegisteredUsers(prev => 
      prev.map(user => 
        user.email === currentUserEmail 
          ? { ...user, profile: updatedProfile, bookingData: booking }
          : user
      )
    );
  };

  const updateUserProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    // Update user data in storage
    setRegisteredUsers(prev => 
      prev.map(user => 
        user.email === currentUserEmail 
          ? { ...user, profile: newProfile }
          : user
      )
    );
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
        return <Contact userProfile={userProfile} />;
      case 'profile':
        return <Profile userProfile={userProfile} setUserProfile={updateUserProfile} />;
      case 'chat':
        return <Chat />;
      default:
        return <Hero onNavigate={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} onRegister={handleRegister} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
        userEmail={userProfile.email}
      />
      {renderCurrentPage()}
    </div>
  );
};

export default Index;