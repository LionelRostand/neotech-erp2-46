
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle, VehicleStatus } from '../../types/rental-types';

interface VehiclesListProps {
  vehicles: Vehicle[];
}

const VehiclesList: React.FC<VehiclesListProps> = ({ vehicles }) => {
  const getStatusBadge = (status: VehicleStatus) => {
    switch(status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-800">Loué</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      case 'reserved':
        return <Badge className="bg-purple-100 text-purple-800">Réservé</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      default:
        return <Badge variant="outline">Indéfini</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Véhicule</TableHead>
              <TableHead>Immatriculation</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Kilométrage</TableHead>
              <TableHead>Tarif</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{vehicle.brand} {vehicle.model}</span>
                    <span className="text-sm text-gray-500">{vehicle.year}</span>
                  </div>
                </TableCell>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {vehicle.type === 'sedan' && 'Berline'}
                    {vehicle.type === 'suv' && 'SUV'}
                    {vehicle.type === 'hatchback' && 'Compacte'}
                    {vehicle.type === 'van' && 'Utilitaire'}
                    {vehicle.type === 'truck' && 'Camion'}
                    {vehicle.type === 'luxury' && 'Luxe'}
                    {vehicle.type === 'convertible' && 'Cabriolet'}
                    {vehicle.type === 'electric' && 'Électrique'}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.mileage.toLocaleString('fr-FR')} km</TableCell>
                <TableCell>{vehicle.dailyRate}€/jour</TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            
            {vehicles.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucun véhicule trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VehiclesList;
