// src/components/bon-plans/deal-card.tsx
"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BonPlan } from "@/types/bon-plan";
import { MapPin, Tag } from "lucide-react";
import Image from "next/image";

interface DealCardProps {
  deal: BonPlan;
}

export const DealCard = ({ deal }: DealCardProps) => {
  return (
    <Card className="w-full max-w-sm group hover:shadow-xl transition-all duration-300 border-gray-100">
      {/* Enhanced Header with overlay and hover effect */}
      <CardHeader className="relative p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={deal.image || "/api/placeholder/400/200"}
            alt={deal.title}
            width={0}
            height={0}
            sizes="100vw"
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>

      {/* Enhanced Content with better spacing and typography */}
      <CardContent className="space-y-4 p-5">
        <h3 className="text-xl font-bold bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] bg-clip-text text-transparent">
          {deal.title}
        </h3>

        <div className="flex items-center gap-2 text-sm">
          <div className="p-1.5 rounded-full bg-[#1a2a6c]/5">
            <MapPin className="w-4 h-4 text-[#1a2a6c]" />
          </div>
          <span className="text-gray-600 font-medium">{deal.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#b21f1f]/5">
            <Tag className="w-4 h-4 text-[#b21f1f]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {deal.categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-[#1a2a6c] font-medium transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Enhanced Footer with gradient button */}
      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => {
            const query = encodeURIComponent(deal.location);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
          }}
          className="w-full bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white hover:opacity-90 transition-opacity"
        >
          <MapPin className="w-4 h-4 mr-2" />
          View Location
        </Button>
      </CardFooter>
    </Card>
  );
};