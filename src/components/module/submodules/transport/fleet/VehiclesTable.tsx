
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TransportVehicle } from '../types/vehicle-types';

interface VehiclesTableProps {
  vehicles: TransportVehicle[];
  onSelectVehicle: (vehicle: TransportVehicle) => void;
  selectedVehicleId?: string;
}

const VehiclesTable: React.FC<VehiclesTableProps> = ({
  vehicles,
  onSelectVehicle,
  selectedVehicleId
}) => {
  // Get badge for vehicle status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-500">Maintenance</Badge>;
      case 'out-of-service':
        return <Badge className="bg-red-500">Hors service</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  
  // Format vehicle type for display
  const formatVehicleType = (type: string) => {
    switch (type) {
      case 'sedan': return 'Berline';
      case 'suv': return 'SUV';
      case 'van': return 'Van';
      case 'luxury': return 'Luxe';
      case 'bus': return 'Bus';
      case 'minibus': return 'Minibus';
      default: return type;
    }
  };

  return (
    <div className="rounded-md border max-h-[500px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>Véhicule</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                Aucun véhicule trouvé
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow 
                key={vehicle.id}
                className={`cursor-pointer hover:bg-slate-50 ${vehicle.id === selectedVehicleId ? 'bg-slate-100' : ''}`}
                onClick={() => onSelectVehicle(vehicle)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.licensePlate}</div>
                  </div>
                </TableCell>
                <TableCell>{formatVehicleType(vehicle.type)}</TableCell>
                <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehiclesTable;
