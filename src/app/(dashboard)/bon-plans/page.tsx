// src/app/dashboard/bon-plans/page.tsx
"use client";
import { DealCard } from "@/components/bon-plans/deal-card";
import { DealFilters } from "@/components/bon-plans/deal-filters";
import  ReviewForm  from "@/components/bon-plans/ReviewForm";
import  ReviewList  from "@/components/bon-plans/ReviewList";
import { menzelBourguibaDeals } from "@/data/menzel-bourguiba-deals";
import { useEffect, useState } from "react";
import { BonPlan } from "@/types/bon-plan";
import { Review } from "@/types/review";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BonPlansPage() {
  const [filteredDeals, setFilteredDeals] = useState<BonPlan[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load initial deals on component mount
  useEffect(() => {
    setFilteredDeals(menzelBourguibaDeals);
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    const { search, categories } = filters;
    let filtered = menzelBourguibaDeals;

    // Filter by search
    if (search) {
      filtered = filtered.filter((deal) =>
        deal.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by categories
    if (categories.length > 0) {
      filtered = filtered.filter((deal) =>
        categories.every((category: string) =>
          deal.categories.includes(category)
        )
      );
    }

    // Update filtered deals
    setFilteredDeals(filtered);
  };

  // Handle review submission
  const handleSubmitReview = (review: { rating: number; comment: string; userName: string }) => {
    if (!selectedDealId) return;

    const newReview: Review = {
      id: reviews.length + 1,
      userId: "user123", // Replace with actual user ID
      userName: review.userName, // Use the provided username or "Anonymous"
      rating: review.rating,
      comment: review.comment,
      date: new Date(),
    };

    setReviews([...reviews, newReview]);
  };

  // Get the selected deal object
  const selectedDeal = filteredDeals.find((deal) => deal.id === selectedDealId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bon Plans</h1>
      </div>

      {/* Filters and Deal List */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <DealFilters
            onFilterChange={handleFilterChange}
            categories={["Food & Dining", "Shopping", "Entertainment"]}
          />
        </div>

        {/* Main Content (Deal List) */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Submit a Review</h2>

        {/* Deal Selection Dropdown */}
        <div className="mb-6">
          <Select onValueChange={(value) => setSelectedDealId(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a deal to review" />
            </SelectTrigger>
            <SelectContent>
              {filteredDeals.map((deal) => (
                <SelectItem key={deal.id} value={deal.id}>
                  {deal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Review Form */}
        {selectedDealId && (
          <>
            <ReviewForm onSubmit={handleSubmitReview} />
            <h3 className="text-lg font-semibold mt-6 mb-4">
              Reviews for {selectedDeal?.title}
            </h3>
            <ReviewList reviews={reviews} />
          </>
        )}
      </div>
    </div>
  );
}