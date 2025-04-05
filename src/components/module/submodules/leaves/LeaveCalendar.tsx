
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useLeaveData } from '@/hooks/useLeaveData';
import { Loader2, Users, ListFilter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addMonths, format, isSameMonth, startOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export const LeaveCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');
  const [viewType, setViewType] = useState('day');
  
  const { leaves, isLoading } = useLeaveData();
  const { employees } = useHrModuleData();

  // Convert leave dates from DD/MM/YYYY to Date objects
  const leaveEvents = React.useMemo(() => {
    if (!leaves || leaves.length === 0) return [];
    
    return leaves.map(leave => {
      // If dates are in DD/MM/YYYY format
      const parseDate = (dateStr: string) => {
        const parts = dateStr.split('/').map(Number);
        return new Date(parts[2], parts[1] - 1, parts[0]);
      };
      
      return {
        ...leave,
        startDateObj: parseDate(leave.startDate),
        endDateObj: parseDate(leave.endDate),
      };
    });
  }, [leaves]);

  // Get all departments for filter
  const departments = React.useMemo(() => {
    if (!employees) return [];
    return Array.from(new Set(employees.map(emp => emp.department))).filter(Boolean);
  }, [employees]);

  // Get all leave types for filter
  const leaveTypes = React.useMemo(() => {
    if (!leaves) return [];
    return Array.from(new Set(leaves.map(leave => leave.type))).filter(Boolean);
  }, [leaves]);

  // Get filtered leaves based on department and type
  const filteredLeaves = React.useMemo(() => {
    if (!leaveEvents) return [];
    
    return leaveEvents.filter(leave => {
      const matchesDepartment = departmentFilter === 'all' || leave.department === departmentFilter;
      const matchesType = leaveTypeFilter === 'all' || leave.type === leaveTypeFilter;
      return matchesDepartment && matchesType;
    });
  }, [leaveEvents, departmentFilter, leaveTypeFilter]);

  // Get leaves for the selected date or month
  const selectedDateLeaves = React.useMemo(() => {
    if (!date || !filteredLeaves) return [];
    
    if (viewType === 'day') {
      return filteredLeaves.filter(leave => 
        date >= leave.startDateObj && date <= leave.endDateObj
      );
    } else {
      return filteredLeaves.filter(leave => 
        (leave.startDateObj <= new Date(date.getFullYear(), date.getMonth() + 1, 0)) && 
        (leave.endDateObj >= new Date(date.getFullYear(), date.getMonth(), 1))
      );
    }
  }, [date, filteredLeaves, viewType]);

  // Navigate between months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' 
      ? addMonths(month, -1) 
      : addMonths(month, 1);
    setMonth(newMonth);
  };

  // Function to determine if a date is a leave day
  const isDayLeave = (day: Date) => {
    return filteredLeaves.some(leave => 
      day >= leave.startDateObj && day <= leave.endDateObj
    );
  };

  // Get leaves for a month grouped by date
  const monthLeaves = React.useMemo(() => {
    if (!date || !filteredLeaves) return {};
    
    const groupedLeaves: Record<string, any[]> = {};
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    
    // Loop through each day of the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const dateString = format(currentDate, 'yyyy-MM-dd');
      
      // Find leaves for this day
      const leavesForDay = filteredLeaves.filter(leave => 
        currentDate >= leave.startDateObj && currentDate <= leave.endDateObj
      );
      
      if (leavesForDay.length > 0) {
        groupedLeaves[dateString] = leavesForDay;
      }
    }
    
    return groupedLeaves;
  }, [date, filteredLeaves]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement du calendrier des congés...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="day">Vue journalière</TabsTrigger>
              <TabsTrigger value="month">Vue mensuelle</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2">
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={leaveTypeFilter}
            onValueChange={setLeaveTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de congé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les congés</SelectItem>
              {leaveTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <TabsContent value="day" className="mt-0">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              month={month}
              onMonthChange={setMonth}
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
            
            {date && selectedDateLeaves.length > 0 ? (
              <div className="space-y-4">
                {selectedDateLeaves.map(leave => (
                  <div key={leave.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
                          <AvatarFallback>{leave.employeeName?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{leave.employeeName}</p>
                          <p className="text-sm text-gray-500">{leave.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          leave.status === 'Approuvé' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : leave.status === 'Refusé'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }>
                          {leave.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <p><span className="font-medium">Type :</span> {leave.type}</p>
                      <p><span className="font-medium">Période :</span> Du {leave.startDate} au {leave.endDate} ({leave.days} jour{leave.days > 1 ? 's' : ''})</p>
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
      </TabsContent>
      
      <TabsContent value="month" className="mt-0">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Mois précédent
            </Button>
            <h3 className="text-lg font-medium">
              {format(month, 'MMMM yyyy', { locale: fr })}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
              Mois suivant <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {Object.keys(monthLeaves).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(monthLeaves).sort().map(([dateStr, leaves]) => {
                const dateObj = new Date(dateStr);
                return (
                  <Card key={dateStr} className="overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {format(dateObj, 'EEEE d MMMM', { locale: fr })}
                        </h4>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {leaves.length}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-0 divide-y">
                      {leaves.map(leave => (
                        <div key={`${dateStr}-${leave.id}`} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
                                <AvatarFallback>{leave.employeeName?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{leave.employeeName}</p>
                                <p className="text-xs text-gray-500">{leave.department}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">
                                {leave.startDate} - {leave.endDate}
                              </span>
                              <Badge className={
                                leave.status === 'Approuvé' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : leave.status === 'Refusé'
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }>
                                {leave.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-1 ml-11 text-xs text-gray-600">
                            {leave.type} • {leave.days} jour{leave.days > 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500 border rounded-md">
              <div className="flex flex-col items-center">
                <Calendar className="h-12 w-12 text-gray-400 mb-2" />
                <h4 className="text-lg font-medium mb-1">Aucun congé ce mois-ci</h4>
                <p className="text-sm text-gray-500">
                  Il n'y a pas de congés prévus pour {format(month, 'MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </div>
  );
};
