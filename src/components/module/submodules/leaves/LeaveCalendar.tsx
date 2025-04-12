
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useLeaveData } from '@/hooks/useLeaveData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface LeaveEvent {
  date: Date;
  events: {
    id: string;
    employeeName: string;
    type: string;
    status: string;
  }[];
}

export const LeaveCalendar: React.FC = () => {
  const { leaves, isLoading } = useLeaveData();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Calculate events for the calendar
  const leaveEvents: LeaveEvent[] = React.useMemo(() => {
    if (!leaves || leaves.length === 0) return [];
    
    const events: { [key: string]: LeaveEvent } = {};
    
    // Parse leaves into calendar events
    leaves.forEach(leave => {
      try {
        // Process each day in the leave period
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        
        // Iterate through each day in the range
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateKey = currentDate.toISOString().split('T')[0];
          
          if (!events[dateKey]) {
            events[dateKey] = {
              date: new Date(currentDate),
              events: []
            };
          }
          
          events[dateKey].events.push({
            id: leave.id,
            employeeName: leave.employeeName,
            type: leave.type,
            status: leave.status
          });
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } catch (e) {
        console.error('Error processing leave for calendar', e);
      }
    });
    
    return Object.values(events);
  }, [leaves]);
  
  const handlePreviousMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date);
  };
  
  const handleNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date);
  };
  
  const getDateContent = (day: Date) => {
    // Find events for this date
    const dateString = day.toISOString().split('T')[0];
    const eventForDate = leaveEvents.find(
      event => event.date.toISOString().split('T')[0] === dateString
    );
    
    if (!eventForDate) return null;
    
    // Count by status
    const statuses = eventForDate.events.reduce((acc, event) => {
      const status = event.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return (
      <div className="flex gap-1 mt-1 justify-center">
        {statuses.pending && (
          <div className="h-2 w-2 rounded-full bg-amber-500" title="En attente"></div>
        )}
        {statuses.approved && (
          <div className="h-2 w-2 rounded-full bg-green-500" title="Approuvé"></div>
        )}
        {statuses.rejected && (
          <div className="h-2 w-2 rounded-full bg-red-500" title="Refusé"></div>
        )}
      </div>
    );
  };
  
  const SelectedDayDetails = () => {
    if (!selectedDate) return null;
    
    const dateString = selectedDate.toISOString().split('T')[0];
    const eventForDate = leaveEvents.find(
      event => event.date.toISOString().split('T')[0] === dateString
    );
    
    if (!eventForDate || eventForDate.events.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          Aucun congé pour cette date
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        <h3 className="font-medium">
          Congés du {selectedDate.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </h3>
        <div className="space-y-2">
          {eventForDate.events.map((event, index) => (
            <div 
              key={`${event.id}-${index}`} 
              className="p-2 rounded border flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{event.employeeName}</div>
                <div className="text-sm text-gray-500">{event.type}</div>
              </div>
              <div className={`px-2 py-1 text-xs rounded-full ${
                event.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                event.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {event.status === 'approved' ? 'Approuvé' : 
                 event.status === 'rejected' ? 'Refusé' : 'En attente'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePreviousMonth}
            aria-label="Mois précédent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h3>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextMonth}
            aria-label="Mois suivant"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Select 
          value={selectedView}
          onValueChange={(value: 'month' | 'week' | 'day') => setSelectedView(value)}
        >
          <SelectTrigger className="w-[180px]">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Vue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Vue mensuelle</SelectItem>
            <SelectItem value="week">Vue hebdomadaire</SelectItem>
            <SelectItem value="day">Vue journalière</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-2">
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={undefined}
                disabled={isLoading}
                className="rounded border-0 pointer-events-auto"
                components={{
                  DayContent: (props) => (
                    <div>
                      {props.children}
                      {getDateContent(props.date)}
                    </div>
                  )
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-4">
            {selectedDate ? (
              <SelectedDayDetails />
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center text-gray-500">
                <Eye className="h-12 w-12 text-gray-300 mb-3" />
                <p>Sélectionnez une date pour voir les détails des congés</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col space-y-2 mt-4">
        <div className="text-sm font-medium">Légende</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span className="text-sm">En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Approuvé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Refusé</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
