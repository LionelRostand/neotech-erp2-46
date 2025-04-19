
import React, { useState } from 'react';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Edit, FileSearch, Trash } from 'lucide-react';
import { Consultation } from '../../types/health-types';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface ConsultationListProps {
  onViewConsultation?: (consultation: Consultation) => void;
  onEditConsultation?: (consultation: Consultation) => void;
}

const ConsultationList: React.FC<ConsultationListProps> = ({
  onViewConsultation,
  onEditConsultation
}) => {
  const { consultations, patients, doctors, isLoading } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const { remove } = useFirestore(COLLECTIONS.HEALTH.CONSULTATIONS);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      try {
        await remove(id);
        toast.success('Consultation supprimée avec succès');
      } catch (error) {
        console.error('Error deleting consultation:', error);
        toast.error("Erreur lors de la suppression de la consultation");
      }
    }
  };

  // Filter consultations based on search term
  const filteredConsultations = consultations?.filter(consultation => {
    if (!searchTerm) return true;
    
    const patient = patients?.find(p => p.id === consultation.patientId);
    const doctor = doctors?.find(d => d.id === consultation.doctorId);
    
    const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : '';
    const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}`.toLowerCase() : '';
    
    return (
      patientName.includes(searchTerm.toLowerCase()) ||
      doctorName.includes(searchTerm.toLowerCase()) ||
      consultation.consultationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredConsultations && filteredConsultations.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Médecin</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsultations.map((consultation) => {
                const patient = patients?.find(p => p.id === consultation.patientId);
                const doctor = doctors?.find(d => d.id === consultation.doctorId);
                
                return (
                  <TableRow key={consultation.id}>
                    <TableCell>
                      {new Date(consultation.date).toLocaleDateString()}
                      <div className="text-xs text-gray-500">{consultation.time}</div>
                    </TableCell>
                    <TableCell>
                      {patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu'}
                    </TableCell>
                    <TableCell>
                      {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Inconnu'}
                    </TableCell>
                    <TableCell>
                      {consultation.consultationType === 'routine' && 'Routine'}
                      {consultation.consultationType === 'followup' && 'Suivi'}
                      {consultation.consultationType === 'emergency' && 'Urgence'}
                      {consultation.consultationType === 'specialist' && 'Spécialiste'}
                      {consultation.consultationType === 'checkup' && 'Bilan'}
                      {!['routine', 'followup', 'emergency', 'specialist', 'checkup'].includes(consultation.consultationType) && consultation.consultationType}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        consultation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        consultation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {consultation.status === 'scheduled' && 'Planifiée'}
                        {consultation.status === 'in-progress' && 'En cours'}
                        {consultation.status === 'completed' && 'Terminée'}
                        {consultation.status === 'cancelled' && 'Annulée'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => onViewConsultation && onViewConsultation(consultation)}
                        >
                          <FileSearch className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => onEditConsultation && onEditConsultation(consultation)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => consultation.id && handleDelete(consultation.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-gray-50">
          <p className="text-gray-500">Aucune consultation trouvée</p>
        </div>
      )}
    </div>
  );
};

export default ConsultationList;
