
import React from 'react';
import { Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GarageClient } from '../../types/garage-types';

interface ClientsTableProps {
  clients: GarageClient[];
  onView: (client: GarageClient) => void;
  onEdit: (client: GarageClient) => void;
  onDelete: (client: GarageClient) => void;
  onCreateAppointment: (client: GarageClient) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onView,
  onEdit,
  onDelete,
  onCreateAppointment
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.firstName} {client.lastName}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>{client.status}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => onView(client)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(client)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(client)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onCreateAppointment(client)}>
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {clients.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Aucun client trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
