import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, MessageSquare, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type FeedbackItem = {
  id: string;
  serviceId: string;
  rating: number;
  comments: string;
  timestamp: string;
};

export const Feedback: React.FC = () => {
  const [serviceId, setServiceId] = useState('#SVC12345');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackItem[]>([]);

  // Load feedback from localStorage on component mount
  useEffect(() => {
    const savedFeedbacks = localStorage.getItem('quickcar_feedbacks');
    if (savedFeedbacks) {
      setAllFeedbacks(JSON.parse(savedFeedbacks));
    }
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Excellent service! My car was picked up and delivered on time. Very professional team."
    },
    {
      name: "Mike Chen", 
      rating: 5,
      comment: "Quick and reliable. The online booking system made everything so easy. Highly recommended!"
    },
    {
      name: "Emily Davis",
      rating: 4,
      comment: "Great experience overall. Good communication throughout the service process."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating for your experience.",
        variant: "destructive",
      });
      return;
    }

    if (!comments.trim()) {
      toast({
        title: "Comments Required", 
        description: "Please share your experience with us.",
        variant: "destructive",
      });
      return;
    }

    // Create new feedback item
    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      serviceId,
      rating,
      comments,
      timestamp: new Date().toLocaleString(),
    };

    // Update state and localStorage
    const updatedFeedbacks = [newFeedback, ...allFeedbacks];
    setAllFeedbacks(updatedFeedbacks);
    localStorage.setItem('quickcar_feedbacks', JSON.stringify(updatedFeedbacks));

    setSubmitted(true);
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable feedback. We appreciate your input.",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500/10 to-pink-500/10 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm text-center">
            <CardContent className="py-12">
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 ${star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Thank You!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Your feedback has been submitted successfully. We value your opinion and will use it to improve our services.
              </p>
              <Button 
                onClick={() => {
                  setSubmitted(false);
                  setRating(0);
                  setHoverRating(0);
                  setComments('');
                  setServiceId('#SVC12345');
                }}
                variant="outline"
              >
                Submit Another Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500/10 to-pink-500/10 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Feedback Form */}
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground">Share Your Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serviceId">Service ID</Label>
                <Input
                  id="serviceId"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  placeholder="#SVC12345"
                />
              </div>

              <div className="space-y-2">
                <Label>Rate your experience</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        star <= (hoverRating || rating) 
                          ? 'fill-warning text-warning' 
                          : 'text-muted-foreground hover:text-warning'
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Your Comments</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full mt-8">
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Display All Customer Feedbacks */}
        {allFeedbacks.length > 0 && (
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Customer Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {allFeedbacks.slice(0, 20).map((item) => (
                  <div key={item.id} className="bg-accent/20 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Service {item.serviceId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < item.rating
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{item.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-foreground italic">"{item.comments}"</p>
                  </div>
                ))}
              </div>
              {allFeedbacks.length > 20 && (
                <p className="text-center text-sm text-muted-foreground">
                  Showing latest 20 feedbacks • Scroll to see more
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Customer Testimonials */}
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">What Our Customers Say</CardTitle>
          </CardHeader>
          <CardContent>
            {testimonials.length > 0 ? (
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{testimonial.name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= testimonial.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground italic">No testimonials yet. Be the first!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};