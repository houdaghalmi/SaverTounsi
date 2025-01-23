"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BonPlan } from "@/types/bon-plan";

interface DealMapProps {
  deals: BonPlan[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const DealMap = ({ deals, center, zoom = 13 }: DealMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    // Initialiser la carte
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(
        center || [37.160317, 9.796875], // Coordonnées par défaut (Menzel Bourguiba)
        zoom
      );

      // Ajouter une couche de tuiles (tiles) OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Initialiser le groupe de marqueurs
      markerRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Nettoyer les marqueurs existants
    if (markerRef.current) {
      markerRef.current.clearLayers();
    }

    // Ajouter des marqueurs pour chaque deal
    deals.forEach((deal) => {
      const { location } = deal;
      const [lat, lng] = location.split(",").map(parseFloat); // Convertir la localisation en coordonnées

      if (!isNaN(lat) && !isNaN(lng)) {
        L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: "/images/marker-icon.png", // Icône du marqueur
            iconSize: [25, 41], // Taille de l'icône
            iconAnchor: [12, 41], // Point d'ancrage de l'icône
          }),
        })
          .addTo(markerRef.current!)
          .bindPopup(`<b>${deal.title}</b><br>${deal.description}`); // Popup avec le titre et la description
      }
    });

    // Nettoyer la carte lors du démontage du composant
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [deals, center, zoom]);

  return <div id="map" className="w-full h-[400px] rounded-lg border"></div>;
};