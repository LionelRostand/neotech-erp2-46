import { useState, useEffect } from 'react';
import { SalonService } from '../../types/salon-types';

export const useSalonServices = () => {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        // Here we would normally fetch from an API
        // For demo purposes, we use mock data
        const mockServices: SalonService[] = [
          {
            id: "1",
            name: "Coupe & Brushing Femme",
            description: "Coupe et mise en forme adaptée à votre morphologie",
            price: 45,
            duration: 60,
            category: "coupe",
            specialists: ["Alexandra", "Sophie"]
          },
          {
            id: "2",
            name: "Coupe Homme",
            description: "Coupe adaptée à votre style",
            price: 28,
            duration: 30,
            category: "homme",
            specialists: ["Nicolas", "Thomas"]
          },
          {
            id: "3",
            name: "Coloration Complète",
            description: "Coloration permanente sur cheveux courts à longs",
            price: 65,
            duration: 90,
            category: "coloration",
            specialists: ["Alexandra"]
          },
          {
            id: "4",
            name: "Balayage",
            description: "Technique pour éclaircir les cheveux et donner du relief",
            price: 85,
            duration: 120,
            category: "technique",
            specialists: ["Sophie"]
          },
          {
            id: "5",
            name: "Coupe Enfant",
            description: "Coupe adaptée pour les enfants jusqu'à 12 ans",
            price: 20,
            duration: 30,
            category: "coupe",
            specialists: []
          },
          {
            id: "6",
            name: "Coupe & Barbe",
            description: "Coupe homme avec taille de barbe",
            price: 38,
            duration: 45,
            category: "homme",
            specialists: ["Nicolas"]
          },
          {
            id: "7",
            name: "Soin Profond",
            description: "Traitement nourrissant pour cheveux secs ou abîmés",
            price: 35,
            duration: 30,
            category: "soin",
            specialists: []
          },
          {
            id: "8",
            name: "Mèches",
            description: "Technique de coloration par mèches",
            price: 75,
            duration: 120,
            category: "technique",
            specialists: ["Alexandra", "Sophie"]
          },
          {
            id: "9",
            name: "Chignon",
            description: "Coiffure élégante pour occasion spéciale",
            price: 55,
            duration: 60,
            category: "coiffage",
            specialists: ["Sophie"]
          },
          {
            id: "10",
            name: "Coiffage",
            description: "Mise en forme sans coupe",
            price: 30,
            duration: 30,
            category: "coiffage",
            specialists: []
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setServices(mockServices);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return {
    services,
    loading,
    error
  };
};
