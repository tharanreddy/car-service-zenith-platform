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
import { Button } from '@/components/ui/button';

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
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);

  // Save users to localStorage whenever registeredUsers changes
  React.useEffect(() => {
    localStorage.setItem('quickcar_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Save payment status to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('quickcar_payment_completed', JSON.stringify(paymentCompleted));
  }, [paymentCompleted]);

  const handleAuthSuccess = (user: { name: string; email: string }) => {
    setCurrentUserEmail(user.email);
    // Load user-specific data
    const userData = registeredUsers.find(u => u.email === user.email);
    if (userData) {
      setUserProfile(userData.profile);
      // Don't load any old booking data on login
      setBookingData(null);
      setHasActiveBooking(false);
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
      setBookingData(null);
      setHasActiveBooking(false);
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
    setPaymentCompleted(false);
    setCurrentPage('home');
  };

  // Handle navigation to booking from payment
  React.useEffect(() => {
    const handleNavigateToBooking = () => {
      setCurrentPage('book-service');
    };
    const handleNavigateToHome = () => {
      setCurrentPage('home');
    };
    const handleNavigateToFeedback = () => {
      setCurrentPage('feedback');
    };
    window.addEventListener('navigate-to-booking', handleNavigateToBooking);
    window.addEventListener('navigate-to-home', handleNavigateToHome);
    window.addEventListener('navigate-to-feedback', handleNavigateToFeedback);
    return () => {
      window.removeEventListener('navigate-to-booking', handleNavigateToBooking);
      window.removeEventListener('navigate-to-home', handleNavigateToHome);
      window.removeEventListener('navigate-to-feedback', handleNavigateToFeedback);
    };
  }, []);

  const updateProfileFromBooking = (booking: BookingData) => {
    setBookingData(booking);
    setPaymentCompleted(false);
    setHasActiveBooking(true);
    
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
        // Only show payment if there's active booking data that hasn't been paid
        if (!hasActiveBooking || !bookingData) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-warning/10 to-primary/10 py-12">
              <div className="max-w-2xl mx-auto px-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-warning mb-4">No Service Booked</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Please book a service first before proceeding to payment.
                  </p>
                  <Button 
                    onClick={() => setCurrentPage('book-service')}
                    variant="default" 
                    size="lg"
                    className="w-full"
                  >
                    Book Service Now
                  </Button>
                </div>
              </div>
            </div>
          );
        }
        return paymentCompleted ? (
          <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 py-12">
            <div className="max-w-2xl mx-auto px-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-success mb-4">Payment Already Completed!</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Your payment has been processed successfully. Book a new service to make another payment.
                </p>
                <div className="space-y-4">
                  <Button 
                    onClick={() => setCurrentPage('book-service')}
                    variant="default" 
                    size="lg"
                    className="w-full mb-4"
                  >
                    Book New Service
                  </Button>
                  <Button 
                    onClick={() => setCurrentPage('feedback')}
                    variant="outline" 
                    size="lg"
                    className="w-full"
                  >
                    Give Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Payment 
            bookingData={bookingData} 
            onComplete={(data) => {
              setPaymentData(data);
              setPaymentCompleted(true);
              setHasActiveBooking(false); // Clear active booking flag
              setBookingData(null); // Clear booking data after payment completion
              // Update user data to clear booking
              setRegisteredUsers(prev => 
                prev.map(user => 
                  user.email === currentUserEmail 
                    ? { ...user, bookingData: null }
                    : user
                )
              );
            }}
          />
        );
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