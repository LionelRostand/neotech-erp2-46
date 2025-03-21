
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
import { Button } from "@/components/ui/button";
import { Eye, Heart } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientsListProps {
  clients: SalonClient[];
  isLoading: boolean;
  onViewClient: (client: SalonClient) => void;
  filter?: string;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  clients, 
  isLoading, 
  onViewClient,
  filter = 'all'
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement des clients...</p>
        </div>
      </div>
    );
  }
  
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Aucun client trouvé.</p>
        <p className="text-muted-foreground text-sm mt-1">
          Créez un nouveau client pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nom du client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Dernière visite</TableHead>
            <TableHead>Fidélité</TableHead>
            <TableHead>Préférences</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {client.firstName} {client.lastName}
              </TableCell>
              <TableCell>
                <div className="text-sm">{client.email}</div>
                <div className="text-sm text-muted-foreground">{client.phone}</div>
              </TableCell>
              <TableCell>
                {client.lastVisit ? (
                  <div>
                    <div className="text-sm">
                      {new Date(client.lastVisit).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(client.lastVisit), { addSuffix: true, locale: fr })}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Jamais</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-1" />
                  <span>{client.loyaltyPoints} points</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate text-sm">
                  {client.preferences || "Aucune préférence spécifiée"}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewClient(client)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;
