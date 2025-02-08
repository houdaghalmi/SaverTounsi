"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type NavigationContextType = {
  isNavigating: boolean;
  setIsNavigating: (value: boolean) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => console.log("handleStart") && setIsNavigating(true);
    const handleStop = () => setIsNavigating(false);

    window.addEventListener("navigationstart", handleStart);
    window.addEventListener("navigatesuccess", handleStop);
    window.addEventListener("navigateerror", handleStop);

    return () => {
      window.removeEventListener("navigationstart", handleStart);
      window.removeEventListener("navigatesuccess", handleStop);
      window.removeEventListener("navigateerror", handleStop);
    };
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  return (
    <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};