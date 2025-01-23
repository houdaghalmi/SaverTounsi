"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface DealFiltersProps {
  onFilterChange: (filters: any) => void;
  categories: string[];
}

export const DealFilters = ({ onFilterChange, categories }: DealFiltersProps) => {
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
  });

  const handleFilterChange = (newFilters: any) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      {/* Barre de recherche */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <Input
          placeholder="Search deals..."
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
      </div>

      {/* Filtres par catégories */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Categories</label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className="justify-start"
              onClick={() => {
                const newCategories = filters.categories.includes(category)
                  ? filters.categories.filter((c: string) => c !== category)
                  : [...filters.categories, category];
                handleFilterChange({ categories: newCategories });
              }}
            >
              <CheckCircle
                className={`w-4 h-4 mr-2 ${
                  filters.categories.includes(category)
                    ? "text-primary"
                    : "text-gray-300"
                }`}
              />
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};