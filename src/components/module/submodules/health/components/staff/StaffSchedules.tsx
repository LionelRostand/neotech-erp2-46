
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Save, Plus } from "lucide-react";
import { format, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

const StaffSchedules: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: startDate, end: endDate });

  // Sample staff members
  const staffMembers = [
    { id: 'STAFF001', name: 'Dr. Sophie Martin', role: 'Médecin', color: 'bg-blue-500' },
    { id: 'STAFF002', name: 'Pierre Dupont', role: 'Infirmier', color: 'bg-green-500' },
    { id: 'STAFF003', name: 'Marie Dubois', role: 'Secrétaire médicale', color: 'bg-purple-500' },
    { id: 'STAFF004', name: 'Jean Lambert', role: 'Technicien', color: 'bg-amber-500' },
    { id: 'STAFF005', name: 'Dr. Claire Moreau', role: 'Médecin', color: 'bg-pink-500' }
  ];

  // Sample schedules
  const schedules = [
    { staffId: 'STAFF001', day: new Date(2025, 2, 17), start: '09:00', end: '18:00', status: 'confirmed' },
    { staffId: 'STAFF001', day: new Date(2025, 2, 18), start: '09:00', end: '18:00', status: 'confirmed' },
    { staffId: 'STAFF001', day: new Date(2025, 2, 19), start: '09:00', end: '18:00', status: 'confirmed' },
    { staffId: 'STAFF001', day: new Date(2025, 2, 20), start: '09:00', end: '13:00', status: 'confirmed' },
    { staffId: 'STAFF001', day: new Date(2025, 2, 21), start: '14:00', end: '18:00', status: 'tentative' },
    
    { staffId: 'STAFF002', day: new Date(2025, 2, 17), start: '08:00', end: '17:00', status: 'confirmed' },
    { staffId: 'STAFF002', day: new Date(2025, 2, 18), start: '08:00', end: '17:00', status: 'confirmed' },
    { staffId: 'STAFF002', day: new Date(2025, 2, 19), start: '14:00', end: '22:00', status: 'confirmed' },
    { staffId: 'STAFF002', day: new Date(2025, 2, 20), start: '14:00', end: '22:00', status: 'confirmed' },
    { staffId: 'STAFF002', day: new Date(2025, 2, 21), start: '08:00', end: '17:00', status: 'confirmed' },
    
    { staffId: 'STAFF003', day: new Date(2025, 2, 17), start: '09:00', end: '17:00', status: 'confirmed' },
    { staffId: 'STAFF003', day: new Date(2025, 2, 18), start: '09:00', end: '17:00', status: 'confirmed' },
    { staffId: 'STAFF003', day: new Date(2025, 2, 19), start: '09:00', end: '17:00', status: 'confirmed' },
    { staffId: 'STAFF003', day: new Date(2025, 2, 20), start: '09:00', end: '17:00', status: 'confirmed' },
    { staffId: 'STAFF003', day: new Date(2025, 2, 21), start: '09:00', end: '17:00', status: 'confirmed' },
    
    { staffId: 'STAFF004', day: new Date(2025, 2, 17), start: '10:00', end: '19:00', status: 'confirmed' },
    { staffId: 'STAFF004', day: new Date(2025, 2, 19), start: '10:00', end: '19:00', status: 'confirmed' },
    { staffId: 'STAFF004', day: new Date(2025, 2, 21), start: '10:00', end: '19:00', status: 'confirmed' },
    
    { staffId: 'STAFF005', day: new Date(2025, 2, 17), start: '09:00', end: '18:00', status: 'confirmed' },
    { staffId: 'STAFF005', day: new Date(2025, 2, 18), start: '09:00', end: '18:00', status: 'confirmed' },
    { staffId: 'STAFF005', day: new Date(2025, 2, 20), start: '09:00', end: '18:00', status: 'confirmed' },
    { staffId: 'STAFF005', day: new Date(2025, 2, 21), start: '09:00', end: '16:00', status: 'tentative' }
  ];

  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, -1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, 1));
  };

  const handleAddSchedule = () => {
    toast.success("Horaire ajouté avec succès");
  };

  const handleSaveSchedules = () => {
    toast.success("Planning enregistré avec succès");
  };

  const getScheduleForStaffAndDay = (staffId: string, day: Date) => {
    return schedules.find(schedule => 
      schedule.staffId === staffId && 
      isSameDay(new Date(schedule.day), day)
    );
  };

  const filteredStaff = selectedStaff === 'all' 
    ? staffMembers 
    : staffMembers.filter(staff => staff.id === selectedStaff);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              className="w-[200px]"
              onClick={() => setCalendarOpen(!calendarOpen)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(startDate, 'd MMM', { locale: fr })} - {format(endDate, 'd MMM yyyy', { locale: fr })}
            </Button>
            {calendarOpen && (
              <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg p-2 border">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      setCurrentDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                />
              </div>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Membre du personnel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les membres</SelectItem>
              {staffMembers.map(staff => (
                <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleAddSchedule}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Personnel</TableHead>
                  {daysOfWeek.map(day => (
                    <TableHead key={day.toString()} className="min-w-[120px] text-center">
                      <div>{format(day, 'EEEE', { locale: fr })}</div>
                      <div className="text-xs font-normal">{format(day, 'd MMM', { locale: fr })}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${staff.color}`}></div>
                        <div>
                          <div>{staff.name}</div>
                          <div className="text-xs text-gray-500">{staff.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    {daysOfWeek.map(day => {
                      const schedule = getScheduleForStaffAndDay(staff.id, day);
                      return (
                        <TableCell key={day.toString()} className="text-center">
                          {schedule ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span className="text-sm">{schedule.start} - {schedule.end}</span>
                              </div>
                              <Badge className={`text-xs ${
                                schedule.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                              }`}>
                                {schedule.status === 'confirmed' ? 'Confirmé' : 'Provisoire'}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">-</div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSchedules}>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer le planning
        </Button>
      </div>
    </div>
  );
};

export default StaffSchedules;
