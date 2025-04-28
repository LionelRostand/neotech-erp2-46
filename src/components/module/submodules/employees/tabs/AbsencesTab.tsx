
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
  const absences = Array.isArray(employee.absences) ? employee.absences : [];

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
  const sortedAbsences = [...absences].sort((a, b) => {
    try {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } catch (error) {
      return 0;
    }
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Absences</h3>
      
      {sortedAbsences.length === 0 ? (
        <p className="text-gray-500">Aucune absence enregistrée</p>
      ) : (
        <div className="space-y-4">
          {sortedAbsences.map((absence, index) => {
            // Ensure absence props are strings
            const startDate = typeof absence.startDate === 'object' ? JSON.stringify(absence.startDate) : String(absence.startDate || '');
            const endDate = typeof absence.endDate === 'object' ? JSON.stringify(absence.endDate) : String(absence.endDate || '');
            const absenceType = typeof absence.type === 'object' ? JSON.stringify(absence.type) : String(absence.type || '');
            const status = typeof absence.status === 'object' ? JSON.stringify(absence.status) : String(absence.status || '');
            const reason = typeof absence.reason === 'object' ? JSON.stringify(absence.reason) : String(absence.reason || '');
            const notes = typeof absence.notes === 'object' ? JSON.stringify(absence.notes) : String(absence.notes || '');
            const approvedBy = typeof absence.approvedBy === 'object' ? JSON.stringify(absence.approvedBy) : String(absence.approvedBy || '');
            const approvedAt = typeof absence.approvedAt === 'object' ? JSON.stringify(absence.approvedAt) : String(absence.approvedAt || '');
            const submittedAt = typeof absence.submittedAt === 'object' ? JSON.stringify(absence.submittedAt) : String(absence.submittedAt || '');
            
            const durationDays = calculateDurationDays(startDate, endDate);
            
            return (
              <div key={absence.id || index} className="border rounded-md p-4">
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <h4 className="font-medium">{absenceType}</h4>
                  <StatusBadge status={status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Début:</span> {formatDate(startDate)}
                  </div>
                  <div>
                    <span className="text-gray-500">Fin:</span> {formatDate(endDate)}
                  </div>
                  <div>
                    <span className="text-gray-500">Durée:</span> {durationDays} jour{durationDays > 1 ? 's' : ''}
                  </div>
                  {submittedAt && (
                    <div>
                      <span className="text-gray-500">Demande soumise le:</span> {formatDate(submittedAt)}
                    </div>
                  )}
                  {reason && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Raison:</span> {reason}
                    </div>
                  )}
                  {approvedBy && (
                    <div>
                      <span className="text-gray-500">Approuvé par:</span> {approvedBy}
                    </div>
                  )}
                  {approvedAt && (
                    <div>
                      <span className="text-gray-500">Approuvé le:</span> {formatDate(approvedAt)}
                    </div>
                  )}
                  {notes && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Notes:</span> {notes}
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
