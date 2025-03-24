
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type LeaveType = 'congé payé' | 'maladie' | 'rtt' | 'sans solde' | 'approuvé' | 'en attente' | 'refusé';

interface LeaveEvent {
  date: string; // Format: "YYYY-MM-DD"
  employee: string;
  type: LeaveType;
  status: 'approuvé' | 'en attente' | 'refusé';
}

// Données d'exemple pour les congés
const LEAVE_EVENTS: LeaveEvent[] = [
  { date: '2025-07-15', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-16', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-17', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-18', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-21', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-22', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-23', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-24', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-25', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-28', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-29', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-07-30', employee: 'Thomas Martin', type: 'congé payé', status: 'approuvé' },
  { date: '2025-05-05', employee: 'Sophie Dubois', type: 'rtt', status: 'en attente' },
  { date: '2025-03-10', employee: 'Jean Dupont', type: 'maladie', status: 'approuvé' },
  { date: '2025-03-11', employee: 'Jean Dupont', type: 'maladie', status: 'approuvé' },
  { date: '2025-03-12', employee: 'Jean Dupont', type: 'maladie', status: 'approuvé' },
  { date: '2025-08-20', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
  { date: '2025-08-21', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
  { date: '2025-08-22', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
  { date: '2025-08-23', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
  { date: '2025-08-24', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
  { date: '2025-08-25', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
  { date: '2025-08-26', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
  { date: '2025-08-27', employee: 'Marie Lambert', type: 'sans solde', status: 'en attente' },
];

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const LeaveCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const getMonthDays = (year: number, month: number) => {
    // Premier jour du mois (0 = dimanche, 1 = lundi, ..., 6 = samedi)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    // Convertir pour que 0 = lundi (format européen)
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Tableau des jours du mois précédent pour compléter la première semaine
    const prevMonthDays = [];
    if (firstDayIndex > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
      
      for (let i = 0; i < firstDayIndex; i++) {
        prevMonthDays.push({
          date: new Date(prevMonthYear, prevMonth, daysInPrevMonth - firstDayIndex + i + 1),
          isCurrentMonth: false
        });
      }
    }
    
    // Tableau des jours du mois en cours
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Tableau des jours du mois suivant pour compléter la dernière semaine
    const nextMonthDays = [];
    const totalDaysShown = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
    const nextDaysCount = totalDaysShown - (prevMonthDays.length + currentMonthDays.length);
    
    if (nextDaysCount > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextMonthYear = month === 11 ? year + 1 : year;
      
      for (let i = 1; i <= nextDaysCount; i++) {
        nextMonthDays.push({
          date: new Date(nextMonthYear, nextMonth, i),
          isCurrentMonth: false
        });
      }
    }
    
    // Combiner tous les jours
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (dateStr: string) => {
    return LEAVE_EVENTS.filter(event => event.date === dateStr);
  };

  const getDateCellClass = (dateStr: string, isCurrentMonth: boolean) => {
    const events = getEventsForDate(dateStr);
    let classes = "h-14 border p-1 relative";
    
    if (!isCurrentMonth) {
      classes += " bg-gray-50 text-gray-400";
    }
    
    if (dateStr === selectedDate) {
      classes += " ring-2 ring-blue-500";
    } else if (dateStr === hoveredDate) {
      classes += " bg-gray-100";
    }
    
    if (events.length > 0) {
      const hasApproved = events.some(e => e.status === 'approuvé');
      const hasPending = events.some(e => e.status === 'en attente');
      const hasRejected = events.some(e => e.status === 'refusé');
      
      if (hasApproved) classes += " border-l-4 border-l-green-500";
      else if (hasPending) classes += " border-l-4 border-l-amber-500";
      else if (hasRejected) classes += " border-l-4 border-l-red-500";
    }
    
    // Marquer aujourd'hui
    const today = new Date();
    const todayStr = getDateString(today);
    if (dateStr === todayStr) {
      classes += " bg-blue-50";
    }
    
    return classes;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = getMonthDays(year, month);

  const renderDayEvents = (dateStr: string) => {
    const events = getEventsForDate(dateStr);
    if (events.length === 0) return null;
    
    // Regrouper par statut pour afficher un badge par statut
    const statuses = new Set(events.map(e => e.status));
    const summary: Record<string, number> = {};
    
    events.forEach(event => {
      if (!summary[event.status]) summary[event.status] = 0;
      summary[event.status]++;
    });
    
    return (
      <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1">
        {Object.entries(summary).map(([status, count]) => (
          <Badge 
            key={status} 
            className={`text-xs ${
              status === 'approuvé' ? 'bg-green-100 text-green-800' : 
              status === 'en attente' ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'
            }`}
            variant="outline"
          >
            {count}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Calendrier des congés</h3>
      
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Mois précédent
        </Button>
        
        <h3 className="text-xl font-semibold">
          {MONTHS[month]} {year}
        </h3>
        
        <Button variant="outline" size="sm" onClick={handleNextMonth}>
          Mois suivant
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 rounded-t-md overflow-hidden">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center font-medium border">
            {day}
          </div>
        ))}
        
        {monthDays.map((day, index) => {
          const dateStr = getDateString(day.date);
          return (
            <div
              key={index}
              className={getDateCellClass(dateStr, day.isCurrentMonth)}
              onClick={() => handleDateClick(dateStr)}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <div className="text-right p-1">{day.date.getDate()}</div>
              {renderDayEvents(dateStr)}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
        <h4 className="font-medium mb-3">Légende</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span className="text-sm">Congé approuvé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 mr-2"></div>
            <span className="text-sm">Congé en attente</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-sm">Congé refusé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 mr-2 border"></div>
            <span className="text-sm">Aujourd'hui</span>
          </div>
        </div>
      </div>
      
      {selectedDate && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">
              Détails pour le {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </h4>
            
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map((event, index) => (
                  <div key={index} className="p-2 border rounded-md flex justify-between items-center">
                    <div>
                      <div className="font-medium">{event.employee}</div>
                      <div className="text-sm text-gray-500">{event.type}</div>
                    </div>
                    <Badge className={`
                      ${event.status === 'approuvé' ? 'bg-green-100 text-green-800' : ''} 
                      ${event.status === 'refusé' ? 'bg-red-100 text-red-800' : ''}
                      ${event.status === 'en attente' ? 'bg-amber-100 text-amber-800' : ''}
                    `}>
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Aucun congé pour cette date</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
