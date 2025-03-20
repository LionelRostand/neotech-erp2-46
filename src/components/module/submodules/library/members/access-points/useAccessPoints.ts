
import { useState, useEffect } from 'react';
import { AccessPoint } from './types';

export const useAccessPoints = () => {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAccessPoints = async () => {
      setIsLoading(true);
      try {
        // Dans une application réelle, cette données viendraient de Firestore
        // Pour l'instant, nous utilisons des données fictives
        const mockData: AccessPoint[] = [
          {
            id: '1',
            name: 'Bibliothèque Centrale',
            address: '123 Avenue des Livres, 75001 Paris',
            contact: '01 23 45 67 89',
            description: 'Bibliothèque principale avec tous les services',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            login: 'admin_central',
            password: 'password123'
          },
          {
            id: '2',
            name: 'Annexe Universitaire',
            address: '45 Rue des Étudiants, 75005 Paris',
            contact: '01 98 76 54 32',
            description: 'Annexe dédiée aux ouvrages universitaires',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            login: 'admin_univ',
            password: 'password456'
          },
          {
            id: '3',
            name: 'Médiathèque Saint-Michel',
            address: '78 Boulevard Saint-Michel, 75006 Paris',
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            login: 'admin_media',
            password: 'password789'
          }
        ];

        // Simuler un délai réseau
        setTimeout(() => {
          setAccessPoints(mockData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
        setIsLoading(false);
      }
    };

    fetchAccessPoints();
  }, []);

  const addAccessPoint = (newAccessPoint: Omit<AccessPoint, 'id' | 'createdAt' | 'updatedAt'>) => {
    const accessPoint: AccessPoint = {
      ...newAccessPoint,
      id: `ap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAccessPoints([...accessPoints, accessPoint]);
    return accessPoint;
  };

  const updateAccessPoint = (id: string, data: Partial<AccessPoint>) => {
    setAccessPoints(
      accessPoints.map(ap => 
        ap.id === id 
          ? { ...ap, ...data, updatedAt: new Date().toISOString() } 
          : ap
      )
    );
  };

  const deleteAccessPoint = (id: string) => {
    setAccessPoints(accessPoints.filter(ap => ap.id !== id));
  };

  return {
    accessPoints,
    isLoading,
    error,
    addAccessPoint,
    updateAccessPoint,
    deleteAccessPoint
  };
};
