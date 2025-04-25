
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/lib/utils';

interface AppointmentsTableProps {
  appointments: any[];
}

const AppointmentsTable = ({ appointments }: AppointmentsTableProps) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Mécanicien</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.clientName || 'Non spécifié'}</TableCell>
              <TableCell>{appointment.vehicleId || 'Non spécifié'}</TableCell>
              <TableCell>{formatDate(appointment.date)}</TableCell>
              <TableCell>{appointment.time || 'Non spécifié'}</TableCell>
              <TableCell>{appointment.mechanicName || 'Non assigné'}</TableCell>
              <TableCell>{appointment.service || 'Non spécifié'}</TableCell>
              <TableCell>
                <Badge variant="outline">{appointment.status || 'En attente'}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTable;
