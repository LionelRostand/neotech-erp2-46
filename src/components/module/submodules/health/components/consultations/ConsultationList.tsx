
import React from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";

interface Consultation {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

interface ConsultationListProps {
  consultations: Consultation[];
  onView: (consultation: Consultation) => void;
  onEdit: (consultation: Consultation) => void;
  onDelete: (consultation: Consultation) => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({
  consultations,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Terminée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Médecin</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Aucune consultation trouvée
              </TableCell>
            </TableRow>
          ) : (
            consultations.map((consultation) => (
              <TableRow key={consultation.id}>
                <TableCell>{consultation.patientName}</TableCell>
                <TableCell>{consultation.doctorName}</TableCell>
                <TableCell>{consultation.date}</TableCell>
                <TableCell>{consultation.time}</TableCell>
                <TableCell>{consultation.type}</TableCell>
                <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onView(consultation)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onEdit(consultation)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(consultation)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ConsultationList;
