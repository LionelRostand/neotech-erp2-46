
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
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useGarageData } from '@/hooks/garage/useGarageData';

const MaintenanceTable = () => {
  const { vehicles = [], isLoading } = useGarageData();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Marque/Modèle</TableHead>
          <TableHead>Immatriculation</TableHead>
          <TableHead>Propriétaire</TableHead>
          <TableHead>Kilométrage</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Dernier contrôle</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehicles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              Aucun véhicule trouvé
            </TableCell>
          </TableRow>
        ) : (
          vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.brand} {vehicle.model}</TableCell>
              <TableCell>{vehicle.registrationNumber}</TableCell>
              <TableCell>{vehicle.clientId}</TableCell>
              <TableCell>{vehicle.mileage} km</TableCell>
              <TableCell>{vehicle.status}</TableCell>
              <TableCell>{vehicle.lastServiceDate || '-'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default MaintenanceTable;
