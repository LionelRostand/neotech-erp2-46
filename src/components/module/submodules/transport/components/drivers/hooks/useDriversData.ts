
import { useState, useEffect } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { Driver } from '../types/driverTypes';

export const useDriversData = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use safe Firestore hook for better error handling
  const driversCollection = useSafeFirestore('drivers');
  
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      // Here we'd normally fetch from Firestore, but we'll use mock data for now
      // In a real application, you'd replace this with:
      // const data = await driversCollection.getAll();
      
      // Mock data for demo purposes
      const mockDrivers: Driver[] = [
        { id: "DRV-001", name: "Marc Leblanc", phone: "06 12 34 56 78", license: "B", licenseExpiry: "2025-05-15", status: "available", rating: 4.8, completedTrips: 238 },
        { id: "DRV-002", name: "Sophie Martin", phone: "06 23 45 67 89", license: "B, D", licenseExpiry: "2024-11-30", status: "driving", rating: 4.7, completedTrips: 192 },
        { id: "DRV-003", name: "Nicolas Durand", phone: "06 34 56 78 90", license: "B", licenseExpiry: "2026-03-22", status: "off-duty", rating: 4.5, completedTrips: 175 },
        { id: "DRV-004", name: "Pierre Moreau", phone: "06 45 67 89 01", license: "B, C", licenseExpiry: "2025-08-10", status: "available", rating: 4.9, completedTrips: 310 },
        { id: "DRV-005", name: "Julie Leroy", phone: "06 56 78 90 12", license: "B", licenseExpiry: "2024-09-05", status: "vacation", rating: 4.6, completedTrips: 145 },
        { id: "DRV-006", name: "Thomas Petit", phone: "06 67 89 01 23", license: "B, D, E", licenseExpiry: "2024-12-18", status: "driving", rating: 4.4, completedTrips: 220 },
        { id: "DRV-007", name: "Camille Dubois", phone: "06 78 90 12 34", license: "B", licenseExpiry: "2025-02-28", status: "sick", rating: 4.8, completedTrips: 198 },
        { id: "DRV-008", name: "Luc Bernard", phone: "06 89 01 23 45", license: "B, C", licenseExpiry: "2026-01-15", status: "available", rating: 4.7, completedTrips: 265 }
      ];
      
      // Add a small delay to simulate network latency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDrivers(mockDrivers);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch drivers:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDrivers();
  }, [driversCollection]);

  return {
    drivers,
    loading,
    error,
    refetch: fetchDrivers
  };
};
