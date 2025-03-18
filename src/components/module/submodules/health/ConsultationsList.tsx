
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2 } from 'lucide-react';

// Temporary mock data
const mockConsultations = [
  {
    id: 1,
    date: '2023-06-15',
    time: '09:30',
    patientName: 'Martin Dupont',
    patientId: 'PAT-20230001',
    doctorName: 'Dr. Sophie Laurent',
    type: 'Consultation générale',
    status: 'completed',
    diagnosis: 'Grippe saisonnière',
  },
  {
    id: 2,
    date: '2023-06-15',
    time: '10:15',
    patientName: 'Jeanne Moreau',
    patientId: 'PAT-20230042',
    doctorName: 'Dr. Sophie Laurent',
    type: 'Suivi médical',
    status: 'completed',
    diagnosis: 'Hypertension stable',
  },
  {
    id: 3,
    date: '2023-06-15',
    time: '14:00',
    patientName: 'Thomas Petit',
    patientId: 'PAT-20230105',
    doctorName: 'Dr. Michel Bernard',
    type: 'Consultation spécialiste',
    status: 'in-progress',
    diagnosis: '',
  },
  {
    id: 4,
    date: '2023-06-16',
    time: '11:30',
    patientName: 'Claire Dubois',
    patientId: 'PAT-20230078',
    doctorName: 'Dr. Michel Bernard',
    type: 'Première consultation',
    status: 'scheduled',
    diagnosis: '',
  },
];

const ConsultationsList: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Terminée</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">En cours</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-500">Planifiée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Indéterminé</Badge>;
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Médecin</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Diagnostic</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockConsultations.map((consultation) => (
            <TableRow key={consultation.id}>
              <TableCell>{consultation.date}</TableCell>
              <TableCell>{consultation.time}</TableCell>
              <TableCell>
                <div>{consultation.patientName}</div>
                <div className="text-xs text-gray-500">{consultation.patientId}</div>
              </TableCell>
              <TableCell>{consultation.doctorName}</TableCell>
              <TableCell>{consultation.type}</TableCell>
              <TableCell>{getStatusBadge(consultation.status)}</TableCell>
              <TableCell>
                {consultation.diagnosis || (
                  <span className="text-gray-400 italic">Non renseigné</span>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" title="Voir">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Modifier">
                  <FileEdit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Supprimer">
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

export default ConsultationsList;
