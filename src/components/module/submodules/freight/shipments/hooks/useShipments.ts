
import { useState, useEffect } from 'react';
import { FreightShipment } from '../../types/freight-types';

// Données de démonstration pour les expéditions
const demoShipments: FreightShipment[] = [
  {
    id: 'SHP-001',
    reference: 'EXP-2025-001',
    customer: 'CLI-001',
    origin: 'Le Havre, France',
    destination: 'New York, USA',
    carrier: 'CAR-001',
    carrierName: 'OceanFreight Lines',
    shipmentType: 'international',
    status: 'in_transit',
    departureDate: '2025-04-10',
    estimatedArrival: '2025-04-25',
    cost: 2800,
    currency: 'EUR',
    description: 'Matériel industriel',
    weight: 2500,
    weightUnit: 'kg',
    notes: 'Transport prioritaire'
  },
  {
    id: 'SHP-002',
    reference: 'EXP-2025-002',
    customer: 'CLI-002',
    origin: 'Marseille, France',
    destination: 'Barcelone, Espagne',
    carrier: 'CAR-002',
    carrierName: 'MedFreight SA',
    shipmentType: 'international',
    status: 'delivered',
    departureDate: '2025-04-05',
    estimatedArrival: '2025-04-08',
    arrivalDate: '2025-04-07',
    cost: 1200,
    currency: 'EUR',
    description: 'Produits alimentaires',
    weight: 1800,
    weightUnit: 'kg',
    notes: ''
  },
  {
    id: 'SHP-003',
    reference: 'EXP-2025-003',
    customer: 'CLI-003',
    origin: 'Shanghai, Chine',
    destination: 'Le Havre, France',
    carrier: 'CAR-003',
    carrierName: 'AsiaEurope Shipping',
    shipmentType: 'import',
    status: 'confirmed',
    departureDate: '2025-04-20',
    estimatedArrival: '2025-05-15',
    cost: 3500,
    currency: 'EUR',
    description: 'Électronique',
    weight: 5000,
    weightUnit: 'kg',
    notes: 'Contient des produits fragiles'
  },
  {
    id: 'SHP-004',
    reference: 'EXP-2025-004',
    customer: 'CLI-004',
    origin: 'Hamburg, Allemagne',
    destination: 'Paris, France',
    carrier: 'CAR-004',
    carrierName: 'EuroTrans GmbH',
    shipmentType: 'international',
    status: 'draft',
    departureDate: '2025-04-28',
    estimatedArrival: '2025-04-30',
    cost: 2200,
    currency: 'EUR',
    description: 'Pièces automobiles',
    weight: 3200,
    weightUnit: 'kg',
    notes: ''
  }
];

export const useShipments = () => {
  const [shipments, setShipments] = useState<FreightShipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 400));
        setShipments(demoShipments);
      } catch (error) {
        console.error('Erreur lors du chargement des expéditions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  return { shipments, isLoading };
};
