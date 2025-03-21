
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Types pour les chauffeurs
interface Driver {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  license: string;
  licenseExpiry: string;
  status: 'available' | 'driving' | 'off-duty' | 'vacation' | 'sick';
  rating: number;
  completedTrips: number;
}

interface DriversTableProps {
  searchTerm: string;
}

const DriversTable: React.FC<DriversTableProps> = ({ searchTerm }) => {
  const { toast } = useToast();
  
  // Données fictives pour les chauffeurs
  const drivers: Driver[] = [
    { id: "DRV-001", name: "Marc Leblanc", phone: "06 12 34 56 78", license: "B", licenseExpiry: "2025-05-15", status: "available", rating: 4.8, completedTrips: 238 },
    { id: "DRV-002", name: "Sophie Martin", phone: "06 23 45 67 89", license: "B, D", licenseExpiry: "2024-11-30", status: "driving", rating: 4.7, completedTrips: 192 },
    { id: "DRV-003", name: "Nicolas Durand", phone: "06 34 56 78 90", license: "B", licenseExpiry: "2026-03-22", status: "off-duty", rating: 4.5, completedTrips: 175 },
    { id: "DRV-004", name: "Pierre Moreau", phone: "06 45 67 89 01", license: "B, C", licenseExpiry: "2025-08-10", status: "available", rating: 4.9, completedTrips: 310 },
    { id: "DRV-005", name: "Julie Leroy", phone: "06 56 78 90 12", license: "B", licenseExpiry: "2024-09-05", status: "vacation", rating: 4.6, completedTrips: 145 },
    { id: "DRV-006", name: "Thomas Petit", phone: "06 67 89 01 23", license: "B, D, E", licenseExpiry: "2024-12-18", status: "driving", rating: 4.4, completedTrips: 220 },
    { id: "DRV-007", name: "Camille Dubois", phone: "06 78 90 12 34", license: "B", licenseExpiry: "2025-02-28", status: "sick", rating: 4.8, completedTrips: 198 },
    { id: "DRV-008", name: "Luc Bernard", phone: "06 89 01 23 45", license: "B, C", licenseExpiry: "2026-01-15", status: "available", rating: 4.7, completedTrips: 265 }
  ];
  
  // Filtrer les chauffeurs en fonction du terme de recherche
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fonction pour obtenir le badge de statut
  const getStatusBadge = (status: Driver['status']) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Disponible</Badge>;
      case "driving":
        return <Badge className="bg-blue-500">En service</Badge>;
      case "off-duty":
        return <Badge className="bg-gray-500">Hors service</Badge>;
      case "vacation":
        return <Badge className="bg-purple-500">Congés</Badge>;
      case "sick":
        return <Badge className="bg-yellow-500">Maladie</Badge>;
      default:
        return <Badge>Statut inconnu</Badge>;
    }
  };
  
  // Fonction pour afficher la note sous forme d'étoiles
  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-500">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-500">½</span>}
        <span className="ml-1 text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chauffeur</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Permis</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Évaluation</TableHead>
            <TableHead>Trajets</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDrivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Aucun chauffeur trouvé pour cette recherche
              </TableCell>
            </TableRow>
          ) : (
            filteredDrivers.map((driver) => (
              <TableRow 
                key={driver.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toast({
                  title: "Détails du chauffeur",
                  description: `ID: ${driver.id} - ${driver.name}`
                })}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriversTable;
