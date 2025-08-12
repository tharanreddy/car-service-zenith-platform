import React from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, Car, Clock, Shield, Users, Star } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary-glow/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <div className="text-white space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight text-shadow">
                <span className="bg-gradient-to-r from-white via-white to-primary-glow bg-clip-text text-transparent">
                  Experience
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-glow via-white to-primary-glow bg-clip-text text-transparent font-extrabold text-shadow drop-shadow-lg">
                  Hassle-Free
                </span>
                <br />
                <span className="text-white">Car Servicing!</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                From pickup to delivery, we make car maintenance easy and transparent.
                <span className="text-primary-glow font-semibold"> Quick, reliable, and just a tap away.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => onNavigate('book-service')}
                className="shine-effect hover-lift group relative overflow-hidden"
              >
                <span className="relative z-10">Book Your Service Now</span>
              </Button>
              <Button 
                variant="default" 
                size="xl"
                className="bg-primary hover:bg-primary-hover text-white hover-lift backdrop-blur-sm shadow-lg"
                onClick={() => onNavigate('contact')}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Enhanced Illustration Area */}
          <div className="relative animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-3xl p-8 hover-glow hover-lift">
              {/* Modern Typography */}
              <div className="text-center mb-8 space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent text-shadow">
                  MECHANICAL AND
                </h2>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-glow to-primary bg-clip-text text-transparent text-shadow">
                  REPAIR SERVICES
                </h2>
              </div>
              
              {/* Premium Services Button */}
              <div className="flex justify-center mb-8">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="rounded-full px-8 shine-effect hover-lift shadow-lg animate-pulse-glow"
                  onClick={() => onNavigate('book-service')}
                >
                  <Star className="w-5 h-5 mr-2" />
                  Premium Services
                </Button>
              </div>

              {/* Enhanced Car Service Illustration */}
              <div className="relative h-64 bg-gradient-to-br from-slate-600/50 to-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative group">
                    {/* Main Car Icon with glow */}
                    <div className="relative">
                      <Car className="h-32 w-32 text-amber-400 drop-shadow-lg group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 h-32 w-32 bg-amber-400/20 rounded-full blur-xl animate-pulse-glow"></div>
                    </div>
                    
                    {/* Floating Service Icons */}
                    <Wrench className="absolute -top-6 -left-6 h-10 w-10 text-primary animate-float hover-lift" />
                    <Shield className="absolute -top-6 -right-6 h-10 w-10 text-success animate-float hover-lift" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
                
                {/* Service technicians with animation */}
                <div className="absolute bottom-4 left-4 hover-lift">
                  <Users className="h-12 w-12 text-amber-500 animate-float" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="absolute bottom-4 right-4 hover-lift">
                  <Users className="h-12 w-12 text-amber-500 animate-float" style={{ animationDelay: '1.5s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: Clock, title: "Quick Service", desc: "Fast and efficient car servicing with minimal wait time", delay: "0s" },
            { icon: Shield, title: "Quality Assured", desc: "Professional service with guaranteed quality standards", delay: "0.2s" },
            { icon: Star, title: "5-Star Rated", desc: "Trusted by thousands of satisfied customers", delay: "0.4s" }
          ].map((feature, index) => (
            <div 
              key={index}
              className="glass-card rounded-2xl p-8 text-center hover-lift hover-glow group animate-fade-in-scale"
              style={{ animationDelay: feature.delay }}
            >
              <div className="relative mb-6">
                <feature.icon className="h-16 w-16 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 h-16 w-16 mx-auto bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};