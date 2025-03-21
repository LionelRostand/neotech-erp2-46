
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TransportDriver } from '../types/transport-types';

interface DriversTableProps {
  drivers: TransportDriver[];
  onSelectDriver: (driver: TransportDriver) => void;
  selectedDriverId?: string;
}

const DriversTable: React.FC<DriversTableProps> = ({
  drivers,
  onSelectDriver,
  selectedDriverId
}) => {
  // Get the initials from first name and last name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };
  
  // Get badge for driver status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-500">En congé</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactif</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="rounded-md border max-h-[500px] overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>Chauffeur</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                Aucun chauffeur trouvé
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver) => (
              <TableRow 
                key={driver.id}
                className={`cursor-pointer hover:bg-slate-50 ${driver.id === selectedDriverId ? 'bg-slate-100' : ''}`}
                onClick={() => onSelectDriver(driver)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={driver.photo} alt={`${driver.firstName} ${driver.lastName}`} />
                      <AvatarFallback>{getInitials(driver.firstName, driver.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{driver.firstName} {driver.lastName}</div>
                      <div className="text-sm text-muted-foreground">{driver.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{driver.rating}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(driver.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriversTable;
