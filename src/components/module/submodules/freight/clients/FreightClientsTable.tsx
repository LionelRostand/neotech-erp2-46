
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FreightClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

interface FreightClientsTableProps {
  clients: FreightClient[];
  isLoading: boolean;
}

const FreightClientsTable: React.FC<FreightClientsTableProps> = ({
  clients,
  isLoading
}) => {
  if (isLoading) {
    return <div>Chargement des clients...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell>{client.notes}</TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Aucun client enregistré
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FreightClientsTable;
