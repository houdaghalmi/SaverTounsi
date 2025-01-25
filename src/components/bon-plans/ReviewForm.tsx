// src/components/bon-plans/ReviewForm.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ReviewFormProps {
  onSubmit: (review: { rating: number; comment: string; userName: string }) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUserName = userName.trim() || "Anonymous"; // Use "Anonymous" if username is empty
    onSubmit({ rating, comment, userName: finalUserName });
    setRating(0);
    setComment("");
    setUserName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Field (Optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Username (Optional)</label>
        <Input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name (or leave blank to remain anonymous)"
          className="mt-1"
        />
      </div>

      {/* Rating Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              <Star className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="resize-none"
          required
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
        Submit Review
      </Button>
    </form>
  );
}