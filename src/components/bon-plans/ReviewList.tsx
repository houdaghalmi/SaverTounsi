// src/components/bon-plans/ReviewList.tsx
import { Review } from "@prisma/client";
import { format } from "date-fns";
import { Star, CalendarDays, MessageSquare, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Update types to include user ID and delete handler
type ReviewData = Omit<Review, 'createdAt'> & {
  createdAt: string | Date;
  userId: string; // Add this to track review owner
};

interface ReviewListProps {
  reviews: ReviewData[];
  currentUserId?: string;
  onDeleteReview?: (reviewId: string) => Promise<void>;
}

export default function ReviewList({ reviews, currentUserId, onDeleteReview }: ReviewListProps) {
  const { toast } = useToast();

  const handleDelete = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Call the parent's onDeleteReview callback to update UI
      if (onDeleteReview) {
        await onDeleteReview(reviewId);
      }

      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  // Helper function to safely format dates
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, "MMM dd, yyyy");
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
        >
          {/* Header with Rating and Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 transition-colors ${
                    star <= review.rating 
                      ? "text-yellow-400 fill-current" 
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Date with Calendar Icon */}
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarDays className="w-4 h-4" />
              <time className="text-sm">
                {formatDate(review.createdAt)}
              </time>
            </div>
          </div>

          {/* Review Content */}
          <div className="mt-4 space-y-3">
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
            
            {/* User Info with Delete Button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm font-medium bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
                {review.userName}
              </p>

              {currentUserId === review.userId && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 rounded-full transition-all duration-200 hover:text-red-500 hover:bg-red-50"
                      aria-label="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Review</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this review? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(review.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">No reviews yet</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}