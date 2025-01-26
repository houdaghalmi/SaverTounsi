// src/app/(dashboard)/feedback/page.tsx
"use client";

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Feedback {
  id: string;
  message: string;
  createdAt: string;
  user: {
    email: string;
  };
}

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch feedback from the backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/feedback');
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your feedback.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      // Check if the response is OK
      if (!response.ok) {
        // Try to parse the error response as JSON
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          throw new Error(`Failed to submit feedback: ${response.statusText}`);
        }
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      // Parse the successful response as JSON
      const newFeedback = await response.json();
      setFeedbacks([newFeedback, ...feedbacks]);
      setMessage('');

      toast({
        title: 'Success',
        description: 'Thank you for your feedback!',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Feedback</h1>



      {/* Feedback form */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Share Your Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Type your message here"
            className="w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Send Message'}
          </Button>
        </form>
      </Card>
    </div>
  );
}