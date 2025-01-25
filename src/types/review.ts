// src/types/review.ts
export interface Review {
    id: number;
    userId: string; // ID of the user who submitted the review
    userName: string; // Name of the user
    rating: number; // Rating from 1 to 5
    comment: string; // Review comment
    date: Date; // Date of the review
  }