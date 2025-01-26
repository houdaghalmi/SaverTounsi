export interface BonPlan {
  id: string;
  title: string;
  description: string;
  location: string; // Coordonnées au format "lat,lng"
  city:string,
  image?: string;
  categories: string[];
}