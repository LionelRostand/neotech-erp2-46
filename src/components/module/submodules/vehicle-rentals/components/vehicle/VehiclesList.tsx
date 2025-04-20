
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Vehicle } from '../../types/rental-types';
import { Badge } from "@/components/ui/badge";

interface VehiclesListProps {
  vehicles: Vehicle[];
}

const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Véhicule</TableHead>
              <TableHead>Immatriculation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Kilométrage</TableHead>
              <TableHead>Tarif journalier</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Aucun véhicule trouvé</TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.year}</div>
                  </TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                  <TableCell>{vehicle.dailyRate}€/jour</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {vehicle.status === 'available' ? 'Disponible' :
                       vehicle.status === 'rented' ? 'Loué' :
                       vehicle.status === 'maintenance' ? 'En maintenance' :
                       'Réservé'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VehiclesList;
