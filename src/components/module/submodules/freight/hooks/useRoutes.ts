
import { useState, useEffect } from "react";

// Mock temporaire pour démo, à remplacer par Firestore si besoin
export function useRoutes() {
  const [routes, setRoutes] = useState<{id: string; name: string; origin: string; destination: string}[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setRoutes([
        { id: "ROUTE-1", name: "Paris-Marseille", origin: "Paris", destination: "Marseille" },
        { id: "ROUTE-2", name: "Lyon-Bordeaux", origin: "Lyon", destination: "Bordeaux" },
      ]);
    }, 120);
  }, []);

  return { routes };
}
