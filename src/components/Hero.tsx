import React from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, Car, Clock, Shield, Users, Star } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-600 to-slate-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div className="text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Experience Hassle-Free Car Servicing!
            </h1>
            <p className="text-xl mb-8 text-slate-200 leading-relaxed">
              From pickup to delivery, we make car maintenance easy and transparent.
              Quick, reliable, and just a tap away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => onNavigate('book-service')}
              >
                Book Your Service Now
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-white text-white hover:bg-white hover:text-slate-800"
                onClick={() => {
                  // Simulate Google sign-in
                  alert('Google Sign-in will be integrated with OAuth in production');
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
            </div>
          </div>

          {/* Illustration Area */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-3xl p-8 shadow-2xl">
              {/* Large Text Overlay */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-primary mb-4">
                  MECHANICAL AND
                </h2>
                <h2 className="text-4xl font-bold text-primary">
                  REPAIR SERVICES
                </h2>
              </div>
              
              {/* Services Button */}
              <div className="flex justify-center mb-8">
                <Button variant="success" size="lg" className="rounded-full px-8">
                  Services
                </Button>
              </div>

              {/* Car Service Illustration */}
              <div className="relative h-64 bg-gradient-to-b from-slate-600 to-slate-700 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Car Icon */}
                    <Car className="h-32 w-32 text-amber-400" />
                    {/* Service Icons around the car */}
                    <Wrench className="absolute -top-4 -left-4 h-8 w-8 text-primary animate-pulse" />
                    <Shield className="absolute -top-4 -right-4 h-8 w-8 text-success animate-pulse" />
                  </div>
                </div>
                
                {/* Service technicians */}
                <div className="absolute bottom-4 left-4">
                  <Users className="h-12 w-12 text-amber-500" />
                </div>
                <div className="absolute bottom-4 right-4">
                  <Users className="h-12 w-12 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
            <p className="text-muted-foreground">Fast and efficient car servicing with minimal wait time</p>
          </div>
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <Shield className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-muted-foreground">Professional service with guaranteed quality standards</p>
          </div>
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <Star className="h-12 w-12 text-warning mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">5-Star Rated</h3>
            <p className="text-muted-foreground">Trusted by thousands of satisfied customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};