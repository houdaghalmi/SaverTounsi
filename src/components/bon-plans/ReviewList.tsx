// src/components/bon-plans/ReviewList.tsx
import { Review } from "@/types/review";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {format(new Date(review.createdAt), "dd/MM/yyyy")}
            </p>
          </div>
          <p className="mt-2 text-gray-800">{review.comment}</p>
          <p className="mt-2 text-sm text-gray-600">- {review.userName}</p>
        </div>
      ))}
    </div>
  );
}