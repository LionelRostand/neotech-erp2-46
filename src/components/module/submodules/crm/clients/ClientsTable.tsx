
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileEdit, Trash2, Loader2 } from "lucide-react";
import { Client } from '../types/crm-types';

interface ClientsTableProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  isLoading: boolean;
  error: string;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ 
  clients, 
  onView, 
  onEdit, 
  onDelete,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Chargement des clients...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>Erreur: {error}</p>
        <p className="mt-2">Veuillez rafraîchir la page ou réessayer plus tard.</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">Aucun client trouvé</p>
        <p className="text-sm text-gray-400 mt-1">Utilisez le bouton "Ajouter un client" pour créer un nouveau client</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
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
                <div className="text-sm">{client.contactName}</div>
                <div className="text-xs text-muted-foreground">{client.contactEmail}</div>
              </TableCell>
              <TableCell>{client.sector}</TableCell>
              <TableCell>
                {client.status === 'active' && (
                  <Badge className="bg-green-500">Actif</Badge>
                )}
                {client.status === 'inactive' && (
                  <Badge variant="outline">Inactif</Badge>
                )}
                {client.status === 'lead' && (
                  <Badge className="bg-blue-500">Lead</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onView(client)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(client)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
