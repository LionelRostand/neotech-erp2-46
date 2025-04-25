
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { GarageClient } from '../../types/garage-types';

interface ClientsTableProps {
  clients: GarageClient[];
  onView: (client: GarageClient) => void;
  onEdit: (client: GarageClient) => void;
  onDelete: (client: GarageClient) => void;
}

const ClientsTable = ({ clients, onView, onEdit, onDelete }: ClientsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Véhicules</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Dernière visite</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500">
              Aucun client trouvé
            </TableCell>
          </TableRow>
        ) : (
          clients.map((client, index) => (
            <TableRow key={client.id || index}>
              <TableCell>{client.firstName} {client.lastName}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.vehicles?.length || 0}</TableCell>
              <TableCell>{client.status}</TableCell>
              <TableCell>{client.lastVisit || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onView(client)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(client)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
