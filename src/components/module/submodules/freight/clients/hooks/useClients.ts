
import { useState, useEffect } from 'react';
import { FreightClient } from '../../types/freight-types';

// Données de démonstration pour les clients
const demoClients: FreightClient[] = [
  {
    id: 'CLI-001',
    name: 'Société Maritime Internationale',
    email: 'contact@smi-freight.com',
    phone: '+33 1 23 45 67 89',
    address: '15 Rue du Port, 76600 Le Havre, France',
    country: 'France',
    contactPerson: 'Jean Dupont',
    type: 'enterprise',
    status: 'active'
  },
  {
    id: 'CLI-002',
    name: 'TransCargo Express',
    email: 'info@transcargo-express.fr',
    phone: '+33 2 34 56 78 90',
    address: '8 Avenue de la Logistique, 13016 Marseille, France',
    country: 'France',
    contactPerson: 'Marie Dufour',
    type: 'enterprise',
    status: 'active'
  },
  {
    id: 'CLI-003',
    name: 'Global Shipping Inc.',
    email: 'business@globalshipping.com',
    phone: '+1 555-123-4567',
    address: '1250 Harbor Blvd, Oakland, CA 94607, USA',
    country: 'USA',
    contactPerson: 'John Smith',
    type: 'enterprise',
    status: 'active'
  },
  {
    id: 'CLI-004',
    name: 'FastTrack Logistics',
    email: 'operations@fasttracklog.eu',
    phone: '+49 30 12345678',
    address: 'Hafenstraße 20, 20459 Hamburg, Germany',
    country: 'Germany',
    contactPerson: 'Hans Müller',
    type: 'enterprise',
    status: 'active'
  }
];

export const useClients = () => {
  const [clients, setClients] = useState<FreightClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        setClients(demoClients);
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return { clients, isLoading };
};
