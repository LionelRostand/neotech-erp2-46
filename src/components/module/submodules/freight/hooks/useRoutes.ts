
import { useState, useEffect } from "react";

// Interface for route type
export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
}

// Mock temporaire pour démo, à remplacer par Firestore si besoin
export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setRoutes([
        { id: "ROUTE-1", name: "Paris-Marseille", origin: "Paris", destination: "Marseille" },
        { id: "ROUTE-2", name: "Lyon-Bordeaux", origin: "Lyon", destination: "Bordeaux" },
      ]);
      setIsLoading(false);
    }, 120);
    
    return () => clearTimeout(timer);
  }, []);

  return { routes, isLoading };
}
