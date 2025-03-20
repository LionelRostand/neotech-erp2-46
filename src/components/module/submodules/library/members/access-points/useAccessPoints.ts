
import { useState, useEffect } from 'react';
import { AccessPoint } from './types';

// Exemple de données pour simuler un chargement depuis une API
const mockAccessPoints: AccessPoint[] = [
  {
    id: 'ap-001',
    name: 'Bibliothèque Centrale',
    address: '15 Rue des Livres, 75001 Paris',
    employeesCount: 12,
    isActive: true
  },
  {
    id: 'ap-002',
    name: 'Annexe Nord',
    address: '8 Avenue des Sciences, 75018 Paris',
    employeesCount: 5,
    isActive: true
  },
  {
    id: 'ap-003',
    name: 'Médiathèque Est',
    address: '42 Boulevard des Arts, 75020 Paris',
    employeesCount: 8,
    isActive: false
  }
];

export const useAccessPoints = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement asynchrone
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simuler une latence réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        setAccessPoints(mockAccessPoints);
      } catch (error) {
        console.error('Erreur lors du chargement des points d\'accès:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    accessPoints,
    isLoading,
    addAccessPoint: (newPoint: Omit<AccessPoint, 'id'>) => {
      const point: AccessPoint = {
        ...newPoint,
        id: `ap-${Date.now().toString().slice(-6)}`
      };
      setAccessPoints(prev => [...prev, point]);
    },
    updateAccessPoint: (id: string, updates: Partial<AccessPoint>) => {
      setAccessPoints(prev => 
        prev.map(point => point.id === id ? { ...point, ...updates } : point)
      );
    },
    deleteAccessPoint: (id: string) => {
      setAccessPoints(prev => prev.filter(point => point.id !== id));
    }
  };
};
