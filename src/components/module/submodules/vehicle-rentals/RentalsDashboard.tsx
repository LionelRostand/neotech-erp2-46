
import React from 'react';
import { Car, Users, Calendar, Truck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatCard from '@/components/StatCard';
import { useRentalData } from '@/hooks/vehicle-rentals/useRentalData';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RentalsDashboard: React.FC = () => {
  const { vehicles, rentals, clients, isLoading } = useRentalData();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const totalClients = clients.length;
  const todayRentals = rentals.filter(r => {
    const today = new Date();
    const startDate = new Date(r.startDate);
    return startDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Tableau de bord des locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Véhicules disponibles"
          value={availableVehicles.toString()}
          icon={<Car className="text-primary" size={20} />}
          description={`Sur ${vehicles.length} véhicules`}
        />
        <StatCard
          title="Locations actives"
          value={activeRentals.toString()}
          icon={<Truck className="text-primary" size={20} />}
          description={`${todayRentals} commencées aujourd'hui`}
        />
        <StatCard
          title="Clients"
          value={totalClients.toString()}
          icon={<Users className="text-primary" size={20} />}
          description="Total des clients enregistrés"
        />
        <StatCard
          title="Réservations"
          value={rentals.length.toString()}
          icon={<Calendar className="text-primary" size={20} />}
          description="Toutes les réservations"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Locations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.slice(0, 5).map(rental => {
                  const vehicle = vehicles.find(v => v.id === rental.vehicleId);
                  const client = clients.find(c => c.id === rental.clientName);
                  return (
                    <TableRow key={rental.id}>
                      <TableCell>{client?.name || 'N/A'}</TableCell>
                      <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : 'N/A'}</TableCell>
                      <TableCell>{new Date(rental.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{rental.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>État de la flotte</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.slice(0, 5).map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{`${vehicle.make} ${vehicle.model}`}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          vehicle.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : vehicle.status === 'rented' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RentalsDashboard;
