"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BonPlan } from "@/types/bon-plan";
import { MapPin, Tag } from "lucide-react";

interface DealCardProps {
  deal: BonPlan;
}

export const DealCard = ({ deal }: DealCardProps) => {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      {/* En-tête de la carte avec l'image du deal */}
      <CardHeader className="relative">
        <img
          src={deal.image || "/api/placeholder/400/200"}
          alt={deal.title}
          className="rounded-t-lg h-48 w-full object-cover"
        />
      </CardHeader>

      {/* Contenu de la carte */}
      <CardContent className="space-y-4">
        {/* Titre du deal */}
        <h3 className="text-xl font-semibold">{deal.title}</h3>

        {/* Localisation du deal */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{deal.location}</span> {/* Affiche l'adresse physique */}
        </div>

        {/* Catégories du deal */}
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <div className="flex gap-2">
            {deal.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Pied de la carte avec le bouton "Open in Google Maps" */}
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => {
            // Ouvre l'adresse dans Google Maps
            const query = encodeURIComponent(deal.location);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
          }}
          variant="outline"
        >
          Open in Google Maps
        </Button>
      </CardFooter>
    </Card>
  );
};