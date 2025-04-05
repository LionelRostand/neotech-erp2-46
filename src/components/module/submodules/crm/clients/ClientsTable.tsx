
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye, MoreHorizontal } from "lucide-react";
import { Client } from '../types/crm-types';

export interface ClientTableProps {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const ClientsTable: React.FC<ClientTableProps> = ({
  clients,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Aucun client trouvé</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Secteur</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>
              <div>{client.contactName}</div>
              <div className="text-muted-foreground text-sm">{client.contactEmail}</div>
            </TableCell>
            <TableCell>{client.sector}</TableCell>
            <TableCell>
              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                client.status === 'active' ? 'bg-green-100 text-green-800' :
                client.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {client.status === 'active' ? 'Actif' :
                 client.status === 'inactive' ? 'Inactif' :
                 'Prospect'}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ouvrir le menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(client)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(client)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(client)}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
