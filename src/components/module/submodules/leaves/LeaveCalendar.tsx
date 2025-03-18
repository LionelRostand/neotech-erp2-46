
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export const LeaveCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('month');
  
  // Sample leave events for the calendar
  const leaveEvents = [
    { date: new Date(2025, 3, 15), type: 'congés payés', employee: 'Thomas Martin' },
    { date: new Date(2025, 3, 16), type: 'congés payés', employee: 'Thomas Martin' },
    { date: new Date(2025, 3, 17), type: 'congés payés', employee: 'Thomas Martin' },
    { date: new Date(2025, 3, 5), type: 'rtt', employee: 'Sophie Dubois' },
    { date: new Date(2025, 2, 1), type: 'maladie', employee: 'Jean Dupont' },
    { date: new Date(2025, 2, 2), type: 'maladie', employee: 'Jean Dupont' },
    { date: new Date(2025, 2, 3), type: 'maladie', employee: 'Jean Dupont' },
  ];

  // Function to determine if a day has leave events
  const getDayHasLeave = (date: Date) => {
    return leaveEvents.some(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };

  // Function to render day content with leave indicators
  const renderDayContent = (props: { date: Date }) => {
    const hasLeave = getDayHasLeave(props.date);
    
    if (hasLeave) {
      return (
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <span className="h-1 w-1 bg-blue-500 rounded-full"></span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calendrier des congés</h3>
        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Vue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="week">Semaine</SelectItem>
              <SelectItem value="day">Jour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="col-span-1 lg:col-span-5">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            components={{
              DayContent: ({ date }) => renderDayContent({ date })
            }}
          />
        </div>
        
        <div className="col-span-1 lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-4">Légende</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Badge className="bg-blue-100 text-blue-800 mr-2">Congés payés</Badge>
                  <span className="text-sm text-gray-500">Congés annuels rémunérés</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-amber-100 text-amber-800 mr-2">RTT</Badge>
                  <span className="text-sm text-gray-500">Réduction du temps de travail</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-red-100 text-red-800 mr-2">Maladie</Badge>
                  <span className="text-sm text-gray-500">Arrêt maladie</span>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-green-100 text-green-800 mr-2">Congés spéciaux</Badge>
                  <span className="text-sm text-gray-500">Événements familiaux</span>
                </div>
              </div>
              
              {date && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">
                    {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </h4>
                  
                  {leaveEvents.filter(event => 
                    event.date.getDate() === date.getDate() && 
                    event.date.getMonth() === date.getMonth() && 
                    event.date.getFullYear() === date.getFullYear()
                  ).length > 0 ? (
                    <div className="space-y-2">
                      {leaveEvents.filter(event => 
                        event.date.getDate() === date.getDate() && 
                        event.date.getMonth() === date.getMonth() && 
                        event.date.getFullYear() === date.getFullYear()
                      ).map((event, index) => (
                        <div key={index} className="text-sm flex items-center">
                          <span className="font-medium mr-1">{event.employee}:</span>
                          <span className="text-gray-600">{event.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucun congé ce jour</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
