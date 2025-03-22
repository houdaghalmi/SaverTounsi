"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search } from "lucide-react";

interface Filters {
  categories: string[];
  search?: string;
}

interface DealFiltersProps {
  onFilterChangeAction: (filters: Filters) => void;
  categories: string[];
}

export const DealFilters = ({ onFilterChangeAction, categories }: DealFiltersProps) => {
  const [filters, setFilters] = useState<Filters>({ categories: [], search: '' });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChangeAction(updated);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Search Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Search Deals</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search deals..."
            className="pl-10 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all"
            onChange={(e) => handleFilterChange({ search: e.target.value })}
          />
        </div>
      </div>

      {/* Categories Section with Enhanced Button Design */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Categories</label>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((category) => {
            const isSelected = filters.categories.includes(category);
            return (
              <Button
                key={category}
                variant={isSelected ? "default" : "outline"}
                className={`justify-start h-auto py-3 px-4 transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white hover:opacity-90 border-transparent'
                    : 'text-[#1a2a6c] border-[#1a2a6c]/20 hover:bg-gradient-to-r hover:from-[#1a2a6c]/5 hover:to-[#b21f1f]/5 hover:border-[#1a2a6c]/30'
                }`}
                onClick={() => {
                  const newCategories = isSelected
                    ? filters.categories.filter((c: string) => c !== category)
                    : [...filters.categories, category];
                  handleFilterChange({ categories: newCategories });
                }}
              >
                <CheckCircle
                  className={`w-4 h-4 mr-3 transition-all ${
                    isSelected
                      ? "text-white"
                      : "text-[#1a2a6c]/60"
                  }`}
                />
                <span className={`font-medium ${
                  isSelected ? 'text-white' : 'bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent'
                }`}>
                  {category}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="ghost"
        className="w-full text-[#b21f1f] hover:text-[#1a2a6c] hover:bg-gray-50 transition-colors"
        onClick={() => handleFilterChange({ categories: [] })}
      >
        Reset Filters
      </Button>
    </div>
  );
};