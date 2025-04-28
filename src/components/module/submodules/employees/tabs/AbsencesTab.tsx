
import React from 'react';
import { Employee, Absence } from '@/types/employee';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StatusBadge } from '@/components/ui/status-badge';
import { differenceInDays } from 'date-fns';

interface AbsencesTabProps {
  employee: Employee;
}

const AbsencesTab: React.FC<AbsencesTabProps> = ({ employee }) => {
  const absences = employee.absences || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const calculateDurationDays = (startDate: string, endDate: string): number => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return differenceInDays(end, start) + 1; // +1 pour inclure le jour de fin
    } catch (error) {
      return 0;
    }
  };

  // Sort absences by start date, most recent first
  const sortedAbsences = [...absences].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Absences</h3>
      
      {sortedAbsences.length === 0 ? (
        <p className="text-gray-500">Aucune absence enregistrée</p>
      ) : (
        <div className="space-y-4">
          {sortedAbsences.map(absence => {
            const durationDays = calculateDurationDays(absence.startDate, absence.endDate);
            
            return (
              <div key={absence.id} className="border rounded-md p-4">
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <h4 className="font-medium">{absence.type}</h4>
                  <StatusBadge status={absence.status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Début:</span> {formatDate(absence.startDate)}
                  </div>
                  <div>
                    <span className="text-gray-500">Fin:</span> {formatDate(absence.endDate)}
                  </div>
                  <div>
                    <span className="text-gray-500">Durée:</span> {durationDays} jour{durationDays > 1 ? 's' : ''}
                  </div>
                  {absence.submittedAt && (
                    <div>
                      <span className="text-gray-500">Demande soumise le:</span> {formatDate(absence.submittedAt)}
                    </div>
                  )}
                  {absence.reason && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Raison:</span> {absence.reason}
                    </div>
                  )}
                  {absence.approvedBy && (
                    <div>
                      <span className="text-gray-500">Approuvé par:</span> {absence.approvedBy}
                    </div>
                  )}
                  {absence.approvedAt && (
                    <div>
                      <span className="text-gray-500">Approuvé le:</span> {formatDate(absence.approvedAt)}
                    </div>
                  )}
                  {absence.notes && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Notes:</span> {absence.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AbsencesTab;
