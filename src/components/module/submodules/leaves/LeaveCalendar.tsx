
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useLeaveRequestsData } from '@/hooks/useLeaveRequestsData';
import { DayContentProps } from 'react-day-picker';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createPortal } from 'react-dom';
import { Badge } from '@/components/ui/badge';

interface LeaveDate {
  date: Date;
  leaves: any[];
}

export const LeaveCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { leaveRequests } = useLeaveRequestsData();
  
  // Format leave requests for calendar display
  const leaveDates: { [key: string]: any[] } = {};
  
  leaveRequests.forEach(request => {
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    
    // Create an entry for each day of the leave period
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      
      if (!leaveDates[dateKey]) {
        leaveDates[dateKey] = [];
      }
      
      leaveDates[dateKey].push(request);
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  
  // Custom day content for the calendar
  const renderDayContent = (props: DayContentProps) => {
    const dateKey = props.date.toISOString().split('T')[0];
    const leavesForDay = leaveDates[dateKey] || [];
    
    return (
      <div className="relative w-full h-full">
        {props.date && <div>{props.date.getDate()}</div>}
        
        {leavesForDay.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="flex -space-x-1 overflow-hidden">
              {leavesForDay.slice(0, 3).map((leave, index) => (
                <div 
                  key={`${leave.id}-${index}`} 
                  className="h-2 w-2 rounded-full"
                  style={{ 
                    backgroundColor: getLeaveTypeColor(leave.type),
                    marginLeft: index > 0 ? '2px' : '0'
                  }}
                />
              ))}
              {leavesForDay.length > 3 && (
                <div className="h-2 w-2 rounded-full bg-gray-400" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to determine color based on leave type
  const getLeaveTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'congés payés':
        return '#3b82f6'; // blue
      case 'rtt':
        return '#10b981'; // green
      case 'congé maladie':
        return '#ef4444'; // red
      case 'congé sans solde':
        return '#f59e0b'; // amber
      case 'congé familial':
        return '#8b5cf6'; // purple
      case 'congé maternité':
        return '#ec4899'; // pink
      case 'congé paternité':
        return '#6366f1'; // indigo
      default:
        return '#6b7280'; // gray
    }
  };

  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'approuvé':
      case 'en attente':
        return <Badge variant="success">Approuvé</Badge>;
      case 'pending':
      case 'en attente':
        return <Badge variant="warning">En attente</Badge>;
      case 'rejected':
      case 'refusé':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get leaves for selected date
  const getSelectedDateLeaves = () => {
    if (!selectedDate) return [];
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    return leaveDates[dateKey] || [];
  };

  return (
    <Card className="col-span-7 lg:col-span-5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Calendrier des congés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="md:col-span-5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="w-full"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              components={{
                DayContent: (props) => renderDayContent(props)
              }}
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1" />
                <span className="text-xs">Congés payés</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1" />
                <span className="text-xs">RTT</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1" />
                <span className="text-xs">Maladie</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-1" />
                <span className="text-xs">Sans solde</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-1" />
                <span className="text-xs">Familial</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-400 mr-1" />
                <span className="text-xs">Autre</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 min-h-[300px]">
            {selectedDate ? (
              <div>
                <div className="mb-3 font-medium">
                  {selectedDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </div>
                
                <div className="space-y-3">
                  {getSelectedDateLeaves().length > 0 ? (
                    getSelectedDateLeaves().map((leave, index) => (
                      <div key={`${leave.id}-${index}`} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                        <Avatar className="h-8 w-8">
                          {leave.employeePhoto ? (
                            <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
                          ) : (
                            <AvatarFallback className="text-xs">
                              {leave.employeeName?.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{leave.employeeName}</div>
                          <div className="text-xs text-gray-500">
                            {leave.type} • {leave.durationDays || 1} jour(s)
                          </div>
                          <div className="text-xs">
                            {getStatusBadge(leave.status)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      Aucun congé pour cette date
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Sélectionnez une date pour voir les congés</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveCalendar;
