
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Driver } from './types/driverTypes';
import { getStatusBadge, getRatingStars } from './utils/driverUtils';

interface DriverRowProps {
  driver: Driver;
}

const DriverRow: React.FC<DriverRowProps> = ({ driver }) => {
  const { toast } = useToast();

  const handleRowClick = () => {
    toast({
      title: "Détails du chauffeur",
      description: `ID: ${driver.id} - ${driver.name}`
    });
  };

  return (
    <TableRow 
      key={driver.id} 
      className="cursor-pointer hover:bg-gray-50"
      onClick={handleRowClick}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={driver.avatar} />
            <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{driver.name}</p>
            <p className="text-xs text-muted-foreground">{driver.id}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>{driver.phone}</TableCell>
      <TableCell>
        <div>
          <p>{driver.license}</p>
          <p className="text-xs text-muted-foreground">Exp: {new Date(driver.licenseExpiry).toLocaleDateString('fr-FR')}</p>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(driver.status)}</TableCell>
      <TableCell>{getRatingStars(driver.rating)}</TableCell>
      <TableCell>{driver.completedTrips}</TableCell>
    </TableRow>
  );
};

export default DriverRow;
