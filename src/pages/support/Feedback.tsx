import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Star, MessageSquare, Lightbulb, Bug } from 'lucide-react';
import useAppStore from '@/store/appStore';

const Feedback = () => {
  const { addFeedback, currentUser } = useAppStore();
  const [formData, setFormData] = useState({
    category: 'general' as const,
    title: '',
    description: '',
    isAnonymous: false
  });
  const [ratings, setRatings] = useState({
    usability: 0,
    service: 0,
    overall: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (ratings.overall === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addFeedback({
        ...formData,
        rating: ratings,
        userId: formData.isAnonymous ? undefined : currentUser?.id
      });
      
      toast.success('Thank you for your feedback!');
      
      // Reset form
      setFormData({
        category: 'general',
        title: '',
        description: '',
        isAnonymous: false
      });
      setRatings({
        usability: 0,
        service: 0,
        overall: 0
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 hover:scale-110 transition-transform ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Share Your Feedback</h1>
          <p className="text-muted-foreground">Help us improve by sharing your suggestions and experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Feedback Form
              </CardTitle>
              <CardDescription>
                Share your thoughts, suggestions, or report issues to help us serve you better.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Feedback Category</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="bug_report">Bug Report</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="general">General Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Subject *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief summary of your feedback"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed feedback..."
                    rows={4}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={formData.isAnonymous}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAnonymous: checked as boolean }))}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Submit anonymously
                  </Label>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => window.history.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Rate Your Experience
              </CardTitle>
              <CardDescription>
                Help us understand how we're doing by rating different aspects of our service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StarRating
                rating={ratings.overall}
                onRatingChange={(rating) => setRatings(prev => ({ ...prev, overall: rating }))}
                label="Overall Experience *"
              />
              
              <StarRating
                rating={ratings.usability}
                onRatingChange={(rating) => setRatings(prev => ({ ...prev, usability: rating }))}
                label="App Usability"
              />
              
              <StarRating
                rating={ratings.service}
                onRatingChange={(rating) => setRatings(prev => ({ ...prev, service: rating }))}
                label="Customer Service"
              />
              
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">What do the ratings mean?</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>⭐ - Poor</p>
                  <p>⭐⭐ - Fair</p>
                  <p>⭐⭐⭐ - Good</p>
                  <p>⭐⭐⭐⭐ - Very Good</p>
                  <p>⭐⭐⭐⭐⭐ - Excellent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Feedback;
