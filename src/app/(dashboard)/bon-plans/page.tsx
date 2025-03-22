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
    <div className="space-y-6 p-6">
      {/* Enhanced Header Section */}
      <div className="relative mb-12">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
          Bon Plans
        </h1>
      </div>

      {/* Filters and Deal List with improved layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <DealFilters
              onFilterChangeAction={handleFilterChange}
              categories={["Food & Drinking", "Shopping", "Entertainment"]}
            />
          </div>
        </div>

        {/* Main Content with Grid Layout */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section with Enhanced Design */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-[#1a2a6c]">Submit a Review</h2>
        
        {/* Deal Selection with Improved Styling */}
        <div className="mb-8">
          <Select onValueChange={(value) => {
            setSelectedDealId(value);
            const deal = filteredDeals.find(d => d.id === value);
            setSelectedDeal(deal || null);
          }}>
            <SelectTrigger className="w-full border-gray-200 rounded-lg">
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

        {/* Review Form and List */}
        {selectedDealId && (
          <>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <ReviewForm onSubmit={handleSubmitReview} />
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-6 text-[#1a2a6c]">
                Reviews for {selectedDeal?.title}
              </h3>
              <div className="bg-white rounded-lg">
                <ReviewList reviews={reviews as any} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}