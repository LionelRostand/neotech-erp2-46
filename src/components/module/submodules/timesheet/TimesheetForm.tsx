
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Employee } from '@/types/employee';

interface TimesheetFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  employees: Employee[];
  isSubmitting?: boolean;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ 
  onSubmit, 
  onCancel, 
  employees,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    weekStartDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
    weekEndDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
    status: 'active',
    hours: {
      monday: 8,
      tuesday: 8,
      wednesday: 8,
      thursday: 8,
      friday: 8,
      saturday: 0,
      sunday: 0,
    },
    totalHours: 40,
    notes: '',
    createdAt: new Date(),
  });

  const [weekStartDateOpen, setWeekStartDateOpen] = useState(false);

  // Dédupliquer les employés par ID pour le sélecteur
  const uniqueEmployees = React.useMemo(() => {
    const employeeIds = new Set();
    return employees.filter(employee => {
      // Si l'ID de l'employé n'est pas déjà dans le Set, l'ajouter et garder cet employé
      if (!employeeIds.has(employee.id)) {
        employeeIds.add(employee.id);
        return true;
      }
      return false;
    });
  }, [employees]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHoursChange = (day: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newHours = { ...formData.hours, [day]: numValue };
    
    // Calculate total hours
    const totalHours = Object.values(newHours).reduce((sum, val) => sum + val, 0);
    
    setFormData(prev => ({
      ...prev,
      hours: newHours,
      totalHours
    }));
  };

  const handleWeekSelection = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    setFormData(prev => ({
      ...prev,
      weekStartDate: weekStart,
      weekEndDate: weekEnd
    }));
    setWeekStartDateOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Initialize with the first employee if available
  useEffect(() => {
    if (uniqueEmployees.length > 0 && !formData.employeeId) {
      setFormData(prev => ({
        ...prev,
        employeeId: uniqueEmployees[0].id
      }));
    }
  }, [uniqueEmployees, formData.employeeId]);

  // Calculate week end date
  const weekEndDate = formData.weekEndDate || endOfWeek(formData.weekStartDate, { weekStartsOn: 1 });

  // Get day names for the selected week
  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Format dates for display
  const dayDates = dayKeys.map((_, index) => 
    format(addDays(formData.weekStartDate, index), 'dd/MM', { locale: fr })
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Nouvelle feuille de temps</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
            Employé
          </label>
          <Select 
            value={formData.employeeId}
            onValueChange={(value) => handleChange('employeeId', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              {uniqueEmployees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Semaine commençant le
          </label>
          <Popover open={weekStartDateOpen} onOpenChange={setWeekStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                disabled={isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.weekStartDate, "dd/MM/yyyy")} - {format(weekEndDate, "dd/MM/yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.weekStartDate}
                onSelect={handleWeekSelection}
                initialFocus
                locale={fr}
                weekStartsOn={1}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">
          Heures travaillées
        </label>
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, index) => (
            <div key={day} className="flex flex-col items-center">
              <span className="text-xs font-medium">{day}</span>
              <span className="text-xs text-gray-500 mb-1">{dayDates[index]}</span>
              <Input 
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.hours[dayKeys[index] as keyof typeof formData.hours]}
                onChange={(e) => handleHoursChange(dayKeys[index], e.target.value)}
                className="w-full text-center"
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Statut
          </label>
          <Select 
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">En cours</SelectItem>
              <SelectItem value="pending">Soumis</SelectItem>
              <SelectItem value="validated">Validée</SelectItem>
              <SelectItem value="rejected">Rejetée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-right">
          <span className="block text-sm font-medium mb-1">Total des heures</span>
          <span className="text-2xl font-bold">{formData.totalHours}h</span>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <Textarea 
          id="notes"
          placeholder="Notes ou commentaires"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            'Soumettre'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default TimesheetForm;
