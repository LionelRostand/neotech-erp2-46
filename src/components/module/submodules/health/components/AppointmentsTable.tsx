
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const appointments = [
  { 
    id: 1, 
    patient: 'Martin Dupont', 
    time: '09:30', 
    date: '2023-07-15', 
    doctor: 'Dr. Laurent', 
    type: 'Consultation',
    status: 'scheduled' 
  },
  { 
    id: 2, 
    patient: 'Sophie Durand', 
    time: '10:15', 
    date: '2023-07-15', 
    doctor: 'Dr. Moreau', 
    type: 'Suivi',
    status: 'confirmed' 
  },
  { 
    id: 3, 
    patient: 'Philippe Martin', 
    time: '11:00', 
    date: '2023-07-15', 
    doctor: 'Dr. Petit', 
    type: 'Urgence',
    status: 'in-progress' 
  },
  { 
    id: 4, 
    patient: 'Claire Fontaine', 
    time: '14:30', 
    date: '2023-07-15', 
    doctor: 'Dr. Laurent', 
    type: 'Consultation',
    status: 'scheduled' 
  },
];

const AppointmentsTable: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Programmé</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmé</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500 hover:bg-amber-600">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Heure</TableHead>
          <TableHead>Médecin</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell className="font-medium">{appointment.patient}</TableCell>
            <TableCell>{appointment.time}</TableCell>
            <TableCell>{appointment.doctor}</TableCell>
            <TableCell>{appointment.type}</TableCell>
            <TableCell>{getStatusBadge(appointment.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AppointmentsTable;
