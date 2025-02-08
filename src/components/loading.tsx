"use client";

import { useNavigation } from "@/providers/navigation-provider";

export function LoadingBar() {
  const { isNavigating } = useNavigation();

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 bg-primary transition-transform duration-300 ease-in-out ${
        isNavigating ? "transform translate-x-0" : "transform -translate-x-full"
      }`}
    />
  );
}
