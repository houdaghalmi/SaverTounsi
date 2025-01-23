// src/app/(dashboard)/feedback/page.tsx
"use client"; // Mark this as a Client Component

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function FeedbackPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      username: '@user 01',
      joined: 'December 2024',
      content: 'SaveTounsi has made managing my budget much easier',
    },
    {
      username: '@user 02',
      joined: 'January 2025',
      content: 'SaveTounsi has helped me to stay on top of my financial goals',
    },
  ]);
  const [showThankYou, setShowThankYou] = useState(false); // State to control the thank you message

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const nextUserNumber = messages.length + 1; // Calculate the next user number
      const newMessage = {
        username: `@user ${nextUserNumber.toString().padStart(2, '0')}`, // Dynamic username (e.g., @user 03, @user 04)
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), // Format: Month Year
        content: message,
      };
      setMessages([...messages, newMessage]);
      setMessage(''); // Clear the input field
      setShowThankYou(true); // Show the thank you message

      // Hide the thank you message after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Feedback</h1>

      {/* Display existing messages */}
      {messages.map((msg, index) => (
        <Card key={index} className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <p className="font-semibold">{msg.username}</p>
                <p className="text-sm text-gray-500">{msg.joined}</p>
              </div>
            </div>
            <p>{msg.content}</p>
          </div>
        </Card>
      ))}

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
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>

        {/* Thank you message */}
        {showThankYou && (
          <p className="mt-4 text-center text-green-600">
            Thank you for taking the time to share your feedback!
          </p>
        )}
      </Card>
    </div>
  );
}