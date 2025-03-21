
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from './mockData';

interface VehicleData {
  id: number;
  model: string;
  category: string;
  rentals: number;
  revenue: number;
  rating: number;
}

interface MostRentedVehiclesTableProps {
  data: VehicleData[];
}

const MostRentedVehiclesTable: React.FC<MostRentedVehiclesTableProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Véhicules les plus loués</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modèle</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Locations</TableHead>
              <TableHead className="text-right">Revenus</TableHead>
              <TableHead className="text-right">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.model}</TableCell>
                <TableCell>{vehicle.category}</TableCell>
                <TableCell className="text-right">{vehicle.rentals}</TableCell>
                <TableCell className="text-right">{formatCurrency(vehicle.revenue)}</TableCell>
                <TableCell className="text-right">{vehicle.rating}/5</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MostRentedVehiclesTable;
