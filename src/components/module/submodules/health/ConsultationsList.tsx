
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/hooks/modules/useHealthData';

const ConsultationsList: React.FC = () => {
  const { consultations, isLoading, error } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

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

  const filteredConsultations = consultations?.filter(consultation => 
    (searchTerm === '' || 
      consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === null || consultation.status === filterStatus)
  );

  if (isLoading) return <div>Chargement des consultations...</div>;
  if (error) return <div>Erreur lors du chargement des consultations</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="relative">
            <Input 
              placeholder="Rechercher..." 
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtrer
          </Button>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle Consultation
        </Button>
      </div>

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
          {filteredConsultations?.map((consultation) => (
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

      {filteredConsultations?.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          Aucune consultation trouvée
        </div>
      )}
    </div>
  );
};

export default ConsultationsList;
