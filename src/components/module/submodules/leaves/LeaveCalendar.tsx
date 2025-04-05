
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLeaveData } from '@/hooks/useLeaveData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export const LeaveCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'day'>('month');
  const { leaves, isLoading, error } = useLeaveData();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        <p className="ml-2 text-gray-500">Chargement du calendrier...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Une erreur est survenue lors du chargement du calendrier des congés.
      </div>
    );
  }
  
  // Convert dates in leave objects from string to Date
  const leavesWithDates = leaves.map(leave => {
    try {
      const startParts = leave.startDate.split('/').map(part => parseInt(part, 10));
      const endParts = leave.endDate.split('/').map(part => parseInt(part, 10));
      
      // Format is assumed to be DD/MM/YYYY
      const startDate = new Date(startParts[2], startParts[1] - 1, startParts[0]);
      const endDate = new Date(endParts[2], endParts[1] - 1, endParts[0]);
      
      return {
        ...leave,
        startDateObj: startDate,
        endDateObj: endDate
      };
    } catch (e) {
      return {
        ...leave,
        startDateObj: new Date(),
        endDateObj: new Date()
      };
    }
  });
  
  // Get all dates in the selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date)
  });
  
  // Find leaves for a specific day
  const getLeavesForDay = (day: Date) => {
    return leavesWithDates.filter(leave => {
      const start = leave.startDateObj;
      const end = leave.endDateObj;
      return day >= start && day <= end;
    });
  };
  
  // Determine if a day has leaves
  const dayHasLeaves = (day: Date) => {
    return getLeavesForDay(day).length > 0;
  };
  
  // Selected day leaves
  const selectedDayLeaves = getLeavesForDay(date);
  
  return (
    <div>
      <Tabs value={calendarView} onValueChange={(v) => setCalendarView(v as 'month' | 'day')}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="month">Vue mensuelle</TabsTrigger>
            <TabsTrigger value="day">Vue journalière</TabsTrigger>
          </TabsList>
          <div className="text-sm font-medium">
            {format(date, 'MMMM yyyy', { locale: fr })}
          </div>
        </div>
        
        <TabsContent value="month" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="mx-auto"
                locale={fr}
                modifiers={{
                  hasLeaves: (day) => dayHasLeaves(day),
                }}
                modifiersClassNames={{
                  hasLeaves: "bg-blue-100 text-blue-900 font-bold",
                }}
              />
            </CardContent>
          </Card>
          
          {selectedDayLeaves.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-lg mb-3">
                  Congés du {format(date, 'dd MMMM yyyy', { locale: fr })}
                </h3>
                <div className="space-y-3">
                  {selectedDayLeaves.map((leave, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div>
                        <div className="font-medium">{leave.employeeName}</div>
                        <div className="text-sm text-gray-500">{leave.type}</div>
                      </div>
                      <Badge variant={
                        leave.status === 'En attente' || leave.status === 'pending' 
                          ? 'info' 
                          : leave.status === 'Approuvé' || leave.status === 'approved' 
                          ? 'success' 
                          : 'destructive'
                      }>
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="day">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    className="mx-auto"
                    locale={fr}
                    modifiers={{
                      hasLeaves: (day) => dayHasLeaves(day),
                    }}
                    modifiersClassNames={{
                      hasLeaves: "bg-blue-100 text-blue-900 font-bold",
                    }}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-medium text-lg mb-3">
                    Congés du {format(date, 'dd MMMM yyyy', { locale: fr })}
                  </h3>
                  
                  {selectedDayLeaves.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Aucun congé prévu pour cette date
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDayLeaves.map((leave, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{leave.employeeName}</div>
                            <Badge variant={
                              leave.status === 'En attente' || leave.status === 'pending' 
                                ? 'info' 
                                : leave.status === 'Approuvé' || leave.status === 'approved' 
                                ? 'success' 
                                : 'destructive'
                            }>
                              {leave.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">Type: {leave.type}</div>
                          <div className="text-sm text-gray-500">
                            Période: {leave.startDate} - {leave.endDate} ({leave.days} jour{leave.days > 1 ? 's' : ''})
                          </div>
                          {leave.reason && (
                            <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
                              {leave.reason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
