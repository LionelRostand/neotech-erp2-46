
import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Consultation } from '../../types/health-types';

interface ConsultationListProps {
  consultations?: Consultation[];
  onView?: (consultation: Consultation) => void;
  onEdit?: (consultation: Consultation) => void;
  onDelete?: (consultationId: string) => void;
}

const ConsultationsList: React.FC<ConsultationListProps> = ({
  consultations: propConsultations,
  onView,
  onEdit,
  onDelete
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAll, remove } = useFirestore('consultations');

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setConsultations(data as Consultation[]);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Erreur lors du chargement des consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propConsultations) {
      setConsultations(propConsultations);
      setLoading(false);
    } else {
      fetchConsultations();
    }
  }, [propConsultations]);

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success('Consultation supprimée avec succès');
      // Refresh the list
      if (!propConsultations) {
        fetchConsultations();
      } else if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression de la consultation');
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Chargement des consultations...</div>;
  }

  if (consultations.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">Aucune consultation trouvée</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Patient</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Médecin</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Type</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Statut</th>
            <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {consultations.map((consultation) => (
            <tr key={consultation.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{consultation.patientId}</td>
              <td className="px-4 py-3 text-sm">{consultation.doctorId}</td>
              <td className="px-4 py-3 text-sm">
                {consultation.date instanceof Date
                  ? consultation.date.toLocaleDateString('fr-FR')
                  : new Date(consultation.date).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3 text-sm capitalize">{consultation.type}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${consultation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    consultation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  {consultation.status === 'scheduled' ? 'Planifiée' : 
                   consultation.status === 'completed' ? 'Terminée' : 
                   consultation.status === 'cancelled' ? 'Annulée' : 
                   consultation.status === 'in-progress' ? 'En cours' : consultation.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right space-x-2">
                {onView && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onView(consultation)} 
                    className="text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(consultation)} 
                    className="text-amber-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(consultation.id)} 
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultationsList;
