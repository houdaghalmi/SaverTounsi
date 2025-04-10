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
    const finalUserName = userName.trim() || "Anonymous";
    onSubmit({ rating, comment, userName: finalUserName });
    setRating(0);
    setComment("");
    setUserName("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#1a2a6c]">Username (Optional)</label>
        <Input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name (or leave blank to remain anonymous)"
          className="border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a2a6c]/20 focus:border-[#1a2a6c] transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Rating Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#1a2a6c]">Rating</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transform transition-all duration-200 hover:scale-110 ${
                star <= rating 
                  ? "text-yellow-400 hover:text-yellow-500" 
                  : "text-gray-300 hover:text-gray-400"
              }`}
            >
              <Star 
                className={`w-8 h-8 ${
                  star <= rating 
                    ? "fill-current" 
                    : "stroke-2"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Field  */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[#1a2a6c]">Your Review</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this deal..."
          className="min-h-[120px] border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a2a6c]/20 focus:border-[#1a2a6c] transition-all resize-none placeholder:text-gray-400"
          required
        />
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white hover:opacity-90 transition-opacity py-6 rounded-lg font-semibold"
        disabled={!rating || !comment.trim()}
      >
        Submit Review
      </Button>
    </form>
  );
}