"use client";

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Feedback {
  id: string;
  message: string;
  createdAt: string;
  userId: string;
  userName: string;
}

const getInitials = (name: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          throw new Error(`Failed to submit feedback: ${response.statusText}`);
        }
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setMessage('');
      await fetchFeedbacks(); 

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

  const handleDelete = async (feedbackId: string) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }

      await fetchFeedbacks(); // Refresh the feedback list
      
      toast({
        title: 'Success',
        description: 'Feedback deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feedback',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent mb-2">
        User Feedback
      </h1>
      <p className="text-gray-600 mb-6">Share your thoughts and help us improve</p>

      {/* Feedback form */}
      <Card className="p-6 mb-8 border-none shadow-sm hover:shadow-md transition-all duration-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="What's on your mind?"
            className="w-full border-gray-200 focus:border-[#1a2a6c] focus:ring-2 focus:ring-[#1a2a6c]/20"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button 
            type="submit" 
            className="w-full bg-[#1a2a6c] hover:bg-[#1a2a6c]/90 transition-colors"
            disabled={loading}
          >
            {loading ? 
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
              : 'Share Feedback'
            }
          </Button>
        </form>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-[#1a2a6c] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="p-5 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-[#1a2a6c]/10">
                        <AvatarImage
                          src="./images/icons/avatar.jpg"
                          alt={feedback.userName || 'Anonymous User'}
                        />
                        <AvatarFallback className="bg-[#1a2a6c]/10 text-[#1a2a6c] text-sm">
                          {getInitials(feedback.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-[#1a2a6c]">
                        {feedback.userName || 'User'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{feedback.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <time className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(feedback.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}

          {!loading && feedbacks.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-600 font-medium">No feedback yet</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to share your thoughts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}