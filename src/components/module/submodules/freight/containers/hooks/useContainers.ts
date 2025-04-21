
import { useState, useEffect } from 'react';
import { Container } from '@/types/freight';

// Données de démonstration pour les conteneurs
const demoContainers: Container[] = [
  {
    id: 'CNT-001',
    number: 'CONT-23456789',
    type: '40ft High Cube',
    status: 'in_transit',
    client: 'CLI-002',
    carrier: 'CAR-002',
    carrierName: 'MedFreight SA',
    origin: 'Marseille, France',
    destination: 'Barcelone, Espagne',
    location: 'Méditerranée',
    departure: '2025-04-12',
    arrival: '2025-04-18',
    cost: 1450,
    currency: 'EUR'
  },
  {
    id: 'CNT-002',
    number: 'CONT-34567890',
    type: '20ft Standard',
    status: 'customs',
    client: 'CLI-001',
    carrier: 'CAR-001',
    carrierName: 'OceanFreight Lines',
    origin: 'Rotterdam, Pays-Bas',
    destination: 'Le Havre, France',
    location: 'Douanes du Havre',
    departure: '2025-04-05',
    arrival: '2025-04-10',
    cost: 1800,
    currency: 'EUR'
  },
  {
    id: 'CNT-003',
    number: 'CONT-45678901',
    type: '40ft Refrigerated',
    status: 'ready',
    client: 'CLI-003',
    carrier: 'CAR-003',
    carrierName: 'AsiaEurope Shipping',
    origin: 'Le Havre, France',
    destination: 'New York, USA',
    location: 'Terminal 2, Port du Havre',
    departure: '2025-04-25',
    arrival: '2025-05-10',
    cost: 2500,
    currency: 'EUR'
  },
  {
    id: 'CNT-004',
    number: 'CONT-56789012',
    type: '20ft Standard',
    status: 'delivered',
    client: 'CLI-004',
    carrier: 'CAR-004',
    carrierName: 'EuroTrans GmbH',
    origin: 'Hambourg, Allemagne',
    destination: 'Marseille, France',
    location: 'Terminal de Marseille',
    departure: '2025-03-28',
    arrival: '2025-04-05',
    cost: 1600,
    currency: 'EUR'
  }
];

export const useContainers = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContainers = async () => {
      setIsLoading(true);
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        setContainers(demoContainers);
      } catch (error) {
        console.error('Erreur lors du chargement des conteneurs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContainers();
  }, []);

  return { containers, isLoading };
};
