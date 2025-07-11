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
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => onNavigate('book-service')}
              className="mb-12"
            >
              Book Your Service Now
            </Button>
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