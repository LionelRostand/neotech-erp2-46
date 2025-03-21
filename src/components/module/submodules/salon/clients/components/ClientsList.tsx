
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SalonClient } from '../../types/salon-types';
import ClientsListSkeleton from './ClientsListSkeleton';

interface ClientsListProps {
  clients: SalonClient[];
  isLoading: boolean;
  onViewClient: (client: SalonClient) => void;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  isLoading, 
  onViewClient 
}) => {
  if (isLoading) {
    return <ClientsListSkeleton />;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dernière visite</TableHead>
            <TableHead>Fidélité</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewClient(client)}
              >
                <TableCell className="font-medium">
                  {client.firstName} {client.lastName}
                </TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('fr-FR') : 'Jamais'}</TableCell>
                <TableCell>
                  <Badge variant={client.loyaltyPoints > 50 ? "default" : "outline"}>
                    {client.loyaltyPoints} points
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aucun client trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;
