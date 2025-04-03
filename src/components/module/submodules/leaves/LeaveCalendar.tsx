
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useLeaveData } from '@/hooks/useLeaveData';
import { Loader2 } from 'lucide-react';

export const LeaveCalendar: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { leaves, isLoading } = useLeaveData();

  // Convertir les dates de congés en objets Date pour le calendrier
  const leaveEvents = React.useMemo(() => {
    if (!leaves) return [];
    
    return leaves.map(leave => {
      const startParts = leave.startDate.split('/').map(Number);
      const endParts = leave.endDate.split('/').map(Number);
      
      return {
        ...leave,
        // Format DD/MM/YYYY to YYYY-MM-DD
        startDateObj: new Date(startParts[2], startParts[1] - 1, startParts[0]),
        endDateObj: new Date(endParts[2], endParts[1] - 1, endParts[0]),
      };
    });
  }, [leaves]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement du calendrier des congés...</p>
      </div>
    );
  }

  // Create a function to determine if a date is a leave day
  const isDayLeave = (date: Date) => {
    return leaveEvents.some(leave => 
      date >= leave.startDateObj && date <= leave.endDateObj
    );
  };
  
  // Create a function to get all leaves for a specific date
  const getLeavesForDate = (date: Date) => {
    return leaveEvents.filter(leave => 
      date >= leave.startDateObj && date <= leave.endDateObj
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            leave: (date) => isDayLeave(date),
          }}
          modifiersClassNames={{
            leave: 'bg-orange-100 text-orange-800 font-medium',
          }}
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-medium mb-4">
          Congés du {date?.toLocaleDateString('fr-FR')}
        </h3>
        
        {date && getLeavesForDate(date).length > 0 ? (
          <div className="space-y-4">
            {getLeavesForDate(date).map(leave => (
              <div key={leave.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{leave.employeeName}</p>
                    <p className="text-sm text-gray-500">{leave.department}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      leave.status === 'Approuvé' 
                        ? 'bg-green-100 text-green-800' 
                        : leave.status === 'Refusé'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p><span className="font-medium">Type :</span> {leave.type}</p>
                  <p><span className="font-medium">Période :</span> Du {leave.startDate} au {leave.endDate} ({leave.days} jours)</p>
                  {leave.reason && <p><span className="font-medium">Motif :</span> {leave.reason}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 border rounded-md">
            Aucun congé prévu pour cette date
          </div>
        )}
      </div>
    </div>
  );
};
