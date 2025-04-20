
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import VehiclesMap from './VehiclesMap';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Location } from '../types/rental-types';

const LocationsDashboard = () => {
  const { data: locations = [] } = useQuery({
    queryKey: ['rentals', 'locations'],
    queryFn: () => fetchCollectionData<Location>(COLLECTIONS.TRANSPORT.LOCATIONS)
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Emplacements des Véhicules</h2>
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <VehiclesMap locations={locations} />
        </Card>
      </div>
    </div>
  );
};

export default LocationsDashboard;
