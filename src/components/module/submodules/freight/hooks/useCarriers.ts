
import { useState, useEffect } from "react";

// Interface for carrier type
export interface Carrier {
  id: string;
  name: string;
}

// Mock temporaire pour démo. Remplace par logique Firestore si besoin !
export function useCarriers() {
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setCarriers([
        { id: "CAR-1", name: "TransFrance" },
        { id: "CAR-2", name: "Express Europe" },
        { id: "CAR-3", name: "TEST-TRANSPORT" },
      ]);
      setIsLoading(false);
    }, 120);
    
    return () => clearTimeout(timer);
  }, []);

  return { carriers, isLoading };
}
