import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Feedback: React.FC = () => {
  const [serviceId, setServiceId] = useState('#SVC12345');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

        {/* Customer Testimonials */}
        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">What Our Customers Say:</CardTitle>
          </CardHeader>
          <CardContent>
            {testimonials.length > 0 ? (
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4 py-2">
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