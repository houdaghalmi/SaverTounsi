export interface BonPlan {
  id: string;
  title: string;
  description: string;
  location: string; // Coordonnées au format "lat,lng"
  image?: string;
  categories: string[];
}