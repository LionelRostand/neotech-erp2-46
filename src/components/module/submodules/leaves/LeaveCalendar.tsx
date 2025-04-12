
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { fr } from 'date-fns/locale';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useLeaveData } from '@/hooks/useLeaveData';

export const LeaveCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { leaves } = useLeaveData();
  
  // Fonction pour vérifier si un jour a des congés
  const hasLeaveOnDate = (date: Date) => {
    return leaves.some(leave => {
      // Convertir les dates de chaîne au format Date
      try {
        const startParts = leave.startDate.split('/');
        const endParts = leave.endDate.split('/');
        
        // Format attendu: DD/MM/YYYY
        if (startParts.length !== 3 || endParts.length !== 3) return false;
        
        const start = new Date(
          parseInt(startParts[2]), // année
          parseInt(startParts[1]) - 1, // mois (0-11)
          parseInt(startParts[0]) // jour
        );
        
        const end = new Date(
          parseInt(endParts[2]), // année
          parseInt(endParts[1]) - 1, // mois (0-11)
          parseInt(endParts[0]) // jour
        );
        
        // Vérifier si la date est dans la plage
        return date >= start && date <= end;
      } catch (err) {
        console.error('Erreur lors de la conversion des dates', err);
        return false;
      }
    });
  };
  
  // Fonction pour obtenir les congés pour une date spécifique
  const getLeavesForDate = (date: Date) => {
    return leaves.filter(leave => {
      try {
        const startParts = leave.startDate.split('/');
        const endParts = leave.endDate.split('/');
        
        if (startParts.length !== 3 || endParts.length !== 3) return false;
        
        const start = new Date(
          parseInt(startParts[2]),
          parseInt(startParts[1]) - 1,
          parseInt(startParts[0])
        );
        
        const end = new Date(
          parseInt(endParts[2]),
          parseInt(endParts[1]) - 1,
          parseInt(endParts[0])
        );
        
        return date >= start && date <= end;
      } catch (err) {
        return false;
      }
    });
  };
  
  // Composant personnalisé pour afficher un jour avec badge si nécessaire
  const renderDay = (day: Date) => {
    const hasLeave = hasLeaveOnDate(day);
    
    return (
      <div className="relative flex items-center justify-center">
        <span>{format(day, 'd')}</span>
        {hasLeave && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
        )}
      </div>
    );
  };
  
  // Gestion du changement de mois
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border rounded-lg p-4 bg-white">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            onMonthChange={handleMonthChange}
            month={currentMonth}
            className="p-3 pointer-events-auto"
            components={{
              Day: ({ date }) => date ? renderDay(date) : null
            }}
          />
        </div>
        
        <div className="md:col-span-2 border rounded-lg p-6 bg-white">
          <h3 className="font-medium text-lg mb-4">
            Congés du {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: fr }) : ''}
          </h3>
          
          {selectedDate && (
            <div className="space-y-4">
              {getLeavesForDate(selectedDate).length > 0 ? (
                getLeavesForDate(selectedDate).map((leave, index) => (
                  <div key={index} className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{leave.employeeName}</p>
                      <p className="text-sm text-gray-500">{leave.department}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline">{leave.type}</Badge>
                        <span className="text-xs ml-2 text-gray-500">
                          {leave.startDate} - {leave.endDate}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Badge className={
                        leave.status === 'Approuvé' ? 'bg-green-100 text-green-800' :
                        leave.status === 'Refusé' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }>
                        {leave.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucun congé prévu pour cette date
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
