
import { useState, useEffect } from "react";

// Mock temporaire pour démo. Remplace par logique Firestore si besoin !
export function useCarriers() {
  const [carriers, setCarriers] = useState<{id: string; name: string}[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setCarriers([
        { id: "CAR-1", name: "TransFrance" },
        { id: "CAR-2", name: "Express Europe" },
        { id: "CAR-3", name: "TEST-TRANSPORT" },
      ]);
    }, 120);
  }, []);

  return { carriers };
}
