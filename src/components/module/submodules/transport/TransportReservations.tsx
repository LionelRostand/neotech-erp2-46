
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import ReservationsList from './reservations/ReservationsList';
import FilterDropdown from './reservations/FilterDropdown';
import { TransportReservation } from './types';

// Sample reservation data
const mockReservations: TransportReservation[] = [
  {
    id: 'res-001',
    clientId: 'client-1',
    clientName: 'Société ABC',
    vehicleId: 'vehicle-1',
    vehicleName: 'Mercedes Sprinter',
    driverId: 'driver-1',
    driverName: 'Jean Dupont',
    status: 'confirmed',
    createdAt: '2023-07-01T10:00:00Z',
    updatedAt: '2023-07-02T14:30:00Z',
    date: '2023-07-15',
    time: '14:30',
    pickup: 'Aéroport Charles de Gaulle, Terminal 2E',
    dropoff: 'Hôtel George V, Paris',
    service: 'airport',
    amount: 120,
    price: 120,
    paymentStatus: 'paid',
    isPaid: true,
    notes: ['Client VIP', 'Prévoir eau fraîche']
  },
  {
    id: 'res-002',
    clientId: 'client-2',
    clientName: 'Jean Martin',
    vehicleId: 'vehicle-2',
    vehicleName: 'BMW X5',
    driverId: 'driver-2',
    driverName: 'Marie Bernard',
    status: 'pending',
    createdAt: '2023-07-05T09:15:00Z',
    date: '2023-07-25',
    time: '10:00',
    pickup: 'Hôtel Ibis, Lyon',
    dropoff: 'Gare Part-Dieu, Lyon',
    service: 'business',
    amount: 85,
    price: 85,
    paymentStatus: 'pending',
    isPaid: false,
    needsDriver: true
  }
];

const TransportReservations = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [reservations] = useState<TransportReservation[]>(mockReservations);
  
  const handleViewDetails = (reservationId: string) => {
    console.log('Viewing details for reservation:', reservationId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Réservations de transport</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle réservation
          </Button>
        </div>
      </div>
      
      {showFilters && <FilterDropdown />}
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationsList 
            reservations={reservations}
            onViewDetails={handleViewDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportReservations;
