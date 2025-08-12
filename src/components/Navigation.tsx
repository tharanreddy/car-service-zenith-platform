import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import carLogo from '@/assets/car-logo.svg';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userEmail: string;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, onLogout, userEmail }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'book-service', label: 'Book Service' },
    { id: 'payments', label: 'Payments' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'profile', label: 'Profile' },
    { id: 'chat', label: 'Chat' },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src={carLogo} 
                alt="QuickCar Logo" 
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110 object-contain"
              />
              <div className="absolute inset-0 h-10 w-10 rounded-full bg-primary/20 animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              QuickCar
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-all duration-300 hover-lift ${
                  currentPage === item.id 
                    ? "bg-gradient-to-r from-primary to-primary-hover shadow-lg hover-glow" 
                    : "hover:bg-accent/50"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">{userEmail}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="hover-lift border-border/50 hover:border-destructive/50 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};