
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Driver, DriversTableProps } from './types/driverTypes';

const DriversTable: React.FC<DriversTableProps> = ({ searchTerm }) => {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to get drivers
    const timer = setTimeout(() => {
      const mockDrivers: Driver[] = [
        {
          id: "DRV001",
          name: "Marc Leblanc",
          avatar: undefined,
          phone: "06 12 34 56 78",
          license: "B12345678",
          licenseExpiry: "2025-05-12",
          status: "available",
          rating: 4.8,
          completedTrips: 543
        },
        {
          id: "DRV002",
          name: "Sophie Martin",
          avatar: undefined,
          phone: "06 23 45 67 89",
          license: "C23456789",
          licenseExpiry: "2024-09-23",
          status: "driving",
          rating: 4.9,
          completedTrips: 412
        },
        {
          id: "DRV003",
          name: "Nicolas Durand",
          avatar: undefined,
          phone: "06 34 56 78 90",
          license: "D34567890",
          licenseExpiry: "2024-03-18",
          status: "off-duty",
          rating: 4.6,
          completedTrips: 287
        },
        {
          id: "DRV004",
          name: "Julie Leroy",
          avatar: undefined,
          phone: "06 45 67 89 01",
          license: "E45678901",
          licenseExpiry: "2026-07-30",
          status: "available",
          rating: 4.7,
          completedTrips: 356
        },
        {
          id: "DRV005",
          name: "Pierre Moreau",
          avatar: undefined,
          phone: "06 56 78 90 12",
          license: "F56789012",
          licenseExpiry: "2023-12-10",
          status: "sick",
          rating: 4.5,
          completedTrips: 217
        }
      ];
      
      setDrivers(mockDrivers);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Disponible</Badge>;
      case 'driving':
        return <Badge className="bg-blue-500">En service</Badge>;
      case 'off-duty':
        return <Badge className="bg-gray-500">Repos</Badge>;
      case 'vacation':
        return <Badge className="bg-purple-500">Congés</Badge>;
      case 'sick':
        return <Badge className="bg-red-500">Arrêt maladie</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  const handleViewDriver = (driver: Driver) => {
    toast({
      title: "Profil chauffeur",
      description: `Consultation du profil de ${driver.name}.`,
    });
  };

  const handleEditDriver = (driver: Driver) => {
    toast({
      title: "Modification chauffeur",
      description: `Modification du profil de ${driver.name}.`,
    });
  };

  if (loading) {
    return (
      <div className="w-full space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center w-full space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredDrivers.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">Aucun chauffeur trouvé</h3>
        <p className="text-sm text-gray-500">
          Aucun chauffeur ne correspond à votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chauffeur</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Licence</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDrivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={driver.avatar} />
                    <AvatarFallback>{driver.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-xs text-gray-500">{driver.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{driver.phone}</TableCell>
              <TableCell>
                <div>
                  <div>{driver.license}</div>
                  <div className="text-xs text-gray-500">
                    Expire: {new Date(driver.licenseExpiry).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(driver.status)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="font-medium">{driver.rating}</span>
                  <span className="text-yellow-400 ml-1">★</span>
                </div>
              </TableCell>
              <TableCell>{driver.completedTrips}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDriver(driver)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditDriver(driver)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Affecter un trajet</DropdownMenuItem>
                      <DropdownMenuItem>Voir l'historique</DropdownMenuItem>
                      <DropdownMenuItem>Modifier le statut</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Désactiver</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriversTable;
