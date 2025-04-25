
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
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AppointmentsTableProps {
  appointments: any[];
  onView?: (appointment: any) => void;
  onEdit?: (appointment: any) => void;
  onDelete?: (appointment: any) => void;
}

const AppointmentsTable = ({ 
  appointments, 
  onView,
  onEdit,
  onDelete
}: AppointmentsTableProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'prévu':
        return <Badge variant="outline">Prévu</Badge>;
      case 'en cours':
        return <Badge className="bg-yellow-500">En cours</Badge>;
      case 'terminé':
        return <Badge className="bg-green-500">Terminé</Badge>;
      case 'annulé':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
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
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              Aucun rendez-vous trouvé
            </TableCell>
          </TableRow>
        ) : (
          appointments.map((appointment, index) => (
            <TableRow key={appointment.id || index}>
              <TableCell>{appointment.clientName}</TableCell>
              <TableCell>{appointment.vehicleInfo}</TableCell>
              <TableCell>{formatDate(appointment.date)}</TableCell>
              <TableCell>{formatTime(appointment.time)}</TableCell>
              <TableCell>{appointment.mechanicName}</TableCell>
              <TableCell>{appointment.service}</TableCell>
              <TableCell>{getStatusBadge(appointment.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView?.(appointment)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(appointment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(appointment)}
                  >
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

export default AppointmentsTable;
