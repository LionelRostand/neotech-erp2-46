
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
import { SalonAppointment } from '../../types/salon-types';

interface ClientAppointmentsProps {
  appointments: SalonAppointment[];
}

const ClientAppointments: React.FC<ClientAppointmentsProps> = ({ appointments }) => {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p>Aucun rendez-vous pour ce client.</p>
        <p className="text-sm mt-2">Les rendez-vous à venir et passés apparaîtront ici.</p>
      </div>
    );
  }

  // Sort appointments: upcoming first, then past
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const now = new Date();
    
    const aIsPast = dateA < now;
    const bIsPast = dateB < now;
    
    if (aIsPast && !bIsPast) return 1;
    if (!aIsPast && bIsPast) return -1;
    
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Coiffeur</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAppointments.map((appointment) => {
            const appointmentDate = new Date(appointment.date);
            const isPast = appointmentDate < new Date();
            
            return (
              <TableRow key={appointment.id}>
                <TableCell>{appointmentDate.toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.stylist}</TableCell>
                <TableCell>
                  <Badge variant={
                    appointment.status === 'confirmed' ? 'default' :
                    appointment.status === 'pending' ? 'secondary' :
                    appointment.status === 'cancelled' ? 'destructive' :
                    appointment.status === 'completed' ? 'outline' : 'outline'
                  }>
                    {appointment.status === 'confirmed' ? 'Confirmé' :
                     appointment.status === 'pending' ? 'En attente' :
                     appointment.status === 'cancelled' ? 'Annulé' : 
                     appointment.status === 'completed' ? 'Terminé' : appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientAppointments;
