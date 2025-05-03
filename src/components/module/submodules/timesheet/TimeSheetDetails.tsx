
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, isSameDay, eachWeekOfInterval, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEmployeePermissions } from '@/components/module/submodules/employees/hooks/useEmployeePermissions';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { updateTimeSheet } from './services/timesheetService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimeReport, TimeReportDetail } from '@/types/timesheet';

interface TimeSheetDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeSheet: TimeReport | null;
  onSuccess: () => void;
}

interface WeekData {
  startDate: Date;
  endDate: Date;
  days: Date[];
  hours: { [key: string]: number };
  projects: { [key: string]: string };
  descriptions: { [key: string]: string };
  totalHours: number;
}

const TimeSheetDetails: React.FC<TimeSheetDetailsProps> = ({ 
  open, 
  onOpenChange, 
  timeSheet, 
  onSuccess 
}) => {
  const { canEdit } = useEmployeePermissions('employees-timesheet', timeSheet?.employeeId);
  const { employees } = useHrModuleData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(timeSheet?.status || 'En cours');
  const [comments, setComments] = useState(timeSheet?.comments || '');
  
  const [weekData, setWeekData] = useState<WeekData[]>(() => {
    if (!timeSheet || !timeSheet.startDate || !timeSheet.endDate) return [];
    
    try {
      const startDate = parseISO(timeSheet.startDate);
      const endDate = parseISO(timeSheet.endDate);
      
      // Obtenir toutes les semaines dans la période
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
      
      return weeks.map((weekStart) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const adjustedWeekEnd = weekEnd > endDate ? endDate : weekEnd;
        
        const weekDays = eachDayOfInterval({ start: weekStart, end: adjustedWeekEnd });
        
        const hours: {[key: string]: number} = {};
        const projects: {[key: string]: string} = {};
        const descriptions: {[key: string]: string} = {};
        
        // Préremplir les données existantes
        weekDays.forEach(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const existingDetail = timeSheet.details?.find(d => {
            try {
              return isSameDay(parseISO(d.date), day);
            } catch (e) {
              return false;
            }
          });
          
          hours[dateStr] = existingDetail?.hours || 0;
          projects[dateStr] = existingDetail?.project || '';
          descriptions[dateStr] = existingDetail?.description || '';
        });
        
        const weekTotalHours = Object.values(hours).reduce((sum, h) => sum + h, 0);
        
        return {
          startDate: weekStart,
          endDate: adjustedWeekEnd,
          days: weekDays,
          hours,
          projects,
          descriptions,
          totalHours: weekTotalHours
        };
      });
    } catch (e) {
      console.error('Erreur lors de la préparation des données de semaine:', e);
      return [];
    }
  });
  
  if (!timeSheet) return null;
  
  const handleHourChange = (weekIndex: number, dateStr: string, value: string) => {
    const numericValue = value === '' ? 0 : Math.min(24, Math.max(0, parseFloat(value) || 0));
    
    setWeekData(prevData => {
      const newData = [...prevData];
      newData[weekIndex] = {
        ...newData[weekIndex],
        hours: {
          ...newData[weekIndex].hours,
          [dateStr]: numericValue
        }
      };
      
      // Recalculer les heures totales de la semaine
      newData[weekIndex].totalHours = Object.values(newData[weekIndex].hours).reduce((sum, h) => sum + h, 0);
      
      return newData;
    });
  };
  
  const handleProjectChange = (weekIndex: number, dateStr: string, value: string) => {
    setWeekData(prevData => {
      const newData = [...prevData];
      newData[weekIndex] = {
        ...newData[weekIndex],
        projects: {
          ...newData[weekIndex].projects,
          [dateStr]: value
        }
      };
      return newData;
    });
  };
  
  const handleDescriptionChange = (weekIndex: number, dateStr: string, value: string) => {
    setWeekData(prevData => {
      const newData = [...prevData];
      newData[weekIndex] = {
        ...newData[weekIndex],
        descriptions: {
          ...newData[weekIndex].descriptions,
          [dateStr]: value
        }
      };
      return newData;
    });
  };
  
  const handleSubmit = async () => {
    if (!timeSheet.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Calculer les heures totales
      const totalHours = weekData.reduce((sum, week) => sum + week.totalHours, 0);
      
      // Préparer les détails
      const details: TimeReportDetail[] = [];
      
      weekData.forEach(week => {
        Object.keys(week.hours).forEach(dateStr => {
          if (week.hours[dateStr] > 0) {
            details.push({
              date: dateStr,
              hours: week.hours[dateStr],
              project: week.projects[dateStr],
              description: week.descriptions[dateStr]
            });
          }
        });
      });
      
      // Mettre à jour la feuille de temps
      await updateTimeSheet(timeSheet.id, {
        totalHours,
        status,
        comments,
        details,
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lastUpdateText: `Mise à jour le ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}`
      });
      
      toast.success('Feuille de temps mise à jour avec succès');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la feuille de temps:', error);
      toast.error('Erreur lors de la mise à jour de la feuille de temps');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const employee = employees.find(emp => emp.id === timeSheet.employeeId);
  const statusColors = {
    'En cours': 'bg-blue-100 text-blue-800',
    'Soumis': 'bg-amber-100 text-amber-800',
    'Validé': 'bg-green-100 text-green-800',
    'Rejeté': 'bg-red-100 text-red-800'
  };
  
  const totalSheetHours = weekData.reduce((sum, week) => sum + week.totalHours, 0);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{timeSheet.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3 items-center mb-4">
                <Avatar className="h-10 w-10">
                  {employee?.photoURL ? (
                    <AvatarImage src={employee.photoURL} alt={employee?.firstName} />
                  ) : (
                    <AvatarFallback>{getInitials(employee?.firstName + " " + employee?.lastName)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{employee?.firstName} {employee?.lastName}</p>
                  <p className="text-sm text-gray-500">{employee?.position}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">Période</p>
                <p className="font-medium">
                  {format(new Date(timeSheet.startDate), 'dd/MM/yyyy', { locale: fr })} - {format(new Date(timeSheet.endDate), 'dd/MM/yyyy', { locale: fr })}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">Statut</p>
                <div className="flex items-center">
                  {canEdit ? (
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Soumis">Soumis</SelectItem>
                        <SelectItem value="Validé">Validé</SelectItem>
                        <SelectItem value="Rejeté">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={statusColors[timeSheet.status as keyof typeof statusColors] || ''}>
                      {timeSheet.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {weekData.map((week, weekIndex) => (
            <Card key={weekIndex}>
              <CardHeader>
                <CardTitle className="text-lg">
                  Semaine du {format(week.startDate, 'dd MMMM', { locale: fr })} au {format(week.endDate, 'dd MMMM yyyy', { locale: fr })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left font-medium p-2 border-b">Jour</th>
                        <th className="text-left font-medium p-2 border-b">Date</th>
                        <th className="text-left font-medium p-2 border-b">Heures</th>
                        <th className="text-left font-medium p-2 border-b">Projet</th>
                        <th className="text-left font-medium p-2 border-b">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {week.days.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const dayName = format(day, 'EEEE', { locale: fr });
                        const dateFormatted = format(day, 'dd/MM/yyyy');
                        
                        return (
                          <tr key={dateStr}>
                            <td className="p-2 border-b">{dayName}</td>
                            <td className="p-2 border-b">{dateFormatted}</td>
                            <td className="p-2 border-b w-24">
                              <Input
                                type="number"
                                value={week.hours[dateStr] || 0}
                                onChange={(e) => handleHourChange(weekIndex, dateStr, e.target.value)}
                                min={0}
                                max={24}
                                step={0.5}
                                disabled={!canEdit}
                                className="w-24"
                              />
                            </td>
                            <td className="p-2 border-b">
                              <Input
                                type="text"
                                value={week.projects[dateStr] || ''}
                                onChange={(e) => handleProjectChange(weekIndex, dateStr, e.target.value)}
                                disabled={!canEdit}
                                placeholder="Projet"
                              />
                            </td>
                            <td className="p-2 border-b">
                              <Input
                                type="text"
                                value={week.descriptions[dateStr] || ''}
                                onChange={(e) => handleDescriptionChange(weekIndex, dateStr, e.target.value)}
                                disabled={!canEdit}
                                placeholder="Description des tâches"
                              />
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="font-medium">
                        <td colSpan={2} className="p-2 text-right">Total de la semaine:</td>
                        <td className="p-2">{week.totalHours}h</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={!canEdit}
                placeholder="Commentaires ou notes additionnelles..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center pt-4">
            <div className="text-lg font-medium">
              Total des heures: <span className="font-bold">{totalSheetHours}h</span>
            </div>
            
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>
              {canEdit && (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSheetDetails;
