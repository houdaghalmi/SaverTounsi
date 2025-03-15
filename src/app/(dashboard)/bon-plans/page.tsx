// src/app/bon-plans/page.tsx
"use client";
import { DealCard } from "@/components/bon-plans/deal-card";
import { DealFilters } from "@/components/bon-plans/deal-filters";
import ReviewForm from "@/components/bon-plans/ReviewForm";
import ReviewList from "@/components/bon-plans/ReviewList";
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
  const [selectedDeal, setSelectedDeal] = useState<BonPlan|null>(null)
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load initial deals on component mount
  useEffect(() => {
    fetchFilteredDeals();
    // setFilteredDeals(menzelBourguibaDeals);
  }, []);
  const fetchFilteredDeals = async () => {
    const deals = await fetch("/api/deals").then(d=> d.json());
    setFilteredDeals(deals)
  }
  // Handle filter changes
  const handleFilterChange = async (filters: any) => {
    const { search, categories } = filters;
    
    try {
      // Fetch all deals first
      const response = await fetch("/api/deals");
      const deals = await response.json();
      let filtered = deals;
  
      // Filter by search
      if (search) {
        filtered = filtered.filter((deal: BonPlan) =>
          deal.title.toLowerCase().includes(search.toLowerCase())
        );
      }
  
      // Filter by categories
      if (categories.length > 0) {
        filtered = filtered.filter((deal: BonPlan) =>
          categories.every((category: string) =>
            deal.categories.includes(category)
          )
        );
      }
  
      // Update filtered deals
      setFilteredDeals(filtered);
    } catch (error) {
      console.error("Error filtering deals:", error);
    }
  };

  // Fetch reviews for the selected deal
  useEffect(() => {
    const fetchReviews = async () => {
      if (selectedDealId) {
        try {
          const response = await fetch(`/api/reviews?bonPlanId=${selectedDealId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.statusText}`);
          }
          const reviews = await response.json();
          setReviews(reviews);
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [selectedDealId]);

  // Handle review submission
  const handleSubmitReview = async (review: {
    rating: number;
    comment: string;
    userName: string;
  }) => {
    if (!selectedDealId) return;

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...review,
          bonPlanId: selectedDealId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.statusText}`);
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  // Get the selected deal object
  // const selectedDeal = filteredDeals.find((deal) => deal.id === selectedDealId);

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
            onFilterChangeAction={handleFilterChange}
            categories={["Food & Drinking", "Shopping", "Entertainment"]}
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
            <ReviewList reviews={reviews as any} />
          </>
        )}
      </div>
    </div>
  );
}