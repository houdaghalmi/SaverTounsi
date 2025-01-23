"use client";
import { DealCard } from "@/components/bon-plans/deal-card";
import { DealFilters } from "@/components/bon-plans/deal-filters";
import { DealMap } from "@/components/bon-plans/deal-map";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menzelBourguibaDeals } from "@/data/menzel-bourguiba-deals";
import { useEffect, useState } from "react";
import { BonPlan } from "@/types/bon-plan";

export default function BonPlansPage() {
  const [filteredDeals, setFilteredDeals] = useState<BonPlan[]>([]);

  // Chargez les données initiales au montage du composant
  useEffect(() => {
    setFilteredDeals(menzelBourguibaDeals);
  }, []);

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = (filters: any) => {
    const { search, categories } = filters;
    let filtered = menzelBourguibaDeals;

    // Filtrage par recherche
    if (search) {
      filtered = filtered.filter((deal) =>
        deal.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtrage par catégories
    if (categories.length > 0) {
      filtered = filtered.filter((deal) =>
        categories.every((category: string) =>
          deal.categories.includes(category)
        )
      );
    }

    // Mettre à jour les deals filtrés
    setFilteredDeals(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bon Plans</h1>
      </div>

      <Tabs defaultValue="list">
        {/* Onglets pour basculer entre la vue liste et la vue carte */}
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres */}
          <div className="lg:col-span-1">
            <DealFilters 
              onFilterChange={handleFilterChange} 
              categories={[
                "Food & Dining",
                "Shopping",
                "Entertainment"
              ]} 
            />
          </div>
          
          {/* Contenu principal (Liste ou Carte) */}
          <div className="lg:col-span-3">
            {/* Vue Liste */}
            <TabsContent value="list">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </TabsContent>
            
            {/* Vue Carte */}
            <TabsContent value="map">
              <Card>
                <CardHeader>
                  <CardTitle>Deals Near You</CardTitle>
                </CardHeader>
                <CardContent>
                  <DealMap deals={filteredDeals} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}