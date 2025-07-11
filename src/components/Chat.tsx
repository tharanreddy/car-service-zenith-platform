import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can we help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAutoBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Welcome to QuickCar support. How can I assist you with your car service today?";
    }
    
    if (lowerMessage.includes('booking') || lowerMessage.includes('book')) {
      return "I can help you with booking! You can book a service by clicking on 'Book Service' in the navigation menu. What type of service do you need?";
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return "For payment inquiries, you can view your payment status in the Payments section. We accept credit cards, UPI, net banking, and digital wallets.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our pricing varies by service: Oil Change (₹29.99), Brake Service (₹49.99), Engine Diagnostic (₹39.99), and more. The exact cost will be shown when you book.";
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('hours')) {
      return "We're open Monday-Saturday 9AM-6PM, Sunday 10AM-4PM. Most services take 2-4 hours depending on the type of work needed.";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('address')) {
      return "We're located at QuickCar Service Hub, 456 Speed Avenue, Auto City. We also offer pickup and delivery services within the city.";
    }
    
    if (lowerMessage.includes('cancel')) {
      return "To cancel a booking, please call us at +91 98765 43210 or email support@quickcar.com with your service ID. Cancellations made 24 hours in advance are free.";
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('status')) {
      return "You can track your service status in the Profile section. We'll also send SMS updates throughout the service process.";
    }
    
    return "Thank you for contacting QuickCar! For specific inquiries, please call +91 98765 43210 or email support@quickcar.com. Our team will be happy to assist you!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay for more realistic feel
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getAutoBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500/10 to-primary/10 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm h-[70vh] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl font-bold">Chat with Service Center</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-accent/20 rounded-lg">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <User className="h-5 w-5 text-primary-foreground/70 mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInputMessage("What are your service hours?")}
          >
            Service Hours
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInputMessage("How can I book a service?")}
          >
            Book Service
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInputMessage("What are your prices?")}
          >
            Pricing Info
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setInputMessage("Where are you located?")}
          >
            Location
          </Button>
        </div>
      </div>
    </div>
  );
};