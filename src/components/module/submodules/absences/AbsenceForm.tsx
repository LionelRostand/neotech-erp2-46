
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface AbsenceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ onSubmit, onCancel }) => {
  const { employees, isLoading } = useEmployeeData();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    type: 'maladie',
    startDate: new Date(),
    endDate: new Date(),
    status: 'En attente',
    reason: '',
    notes: '',
    createdAt: new Date(),
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    if (selectedEmployee) {
      handleChange('employeeId', employeeId);
      handleChange('employeeName', `${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
            Employé
          </label>
          <Select 
            value={formData.employeeId}
            onValueChange={handleEmployeeChange}
          >
            <SelectTrigger id="employeeId">
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading">Chargement des employés...</SelectItem>
              ) : employees.length === 0 ? (
                <SelectItem value="none">Aucun employé disponible</SelectItem>
              ) : (
                employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type d'absence
          </label>
          <Select 
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maladie">Maladie</SelectItem>
              <SelectItem value="familial">Raison familiale</SelectItem>
              <SelectItem value="personnel">Personnel</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Date de début
          </label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.startDate, 'dd/MM/yyyy', { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => {
                  if (date) {
                    handleChange('startDate', date);
                    setStartDateOpen(false);
                  }
                }}
                initialFocus
                locale={fr}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Date de fin
          </label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(formData.endDate, 'dd/MM/yyyy', { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => {
                  if (date) {
                    handleChange('endDate', date);
                    setEndDateOpen(false);
                  }
                }}
                initialFocus
                locale={fr}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium mb-1">
          Raison
        </label>
        <Textarea 
          id="reason"
          placeholder="Détails de l'absence"
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!formData.employeeId}>
          Soumettre
        </Button>
      </div>
    </form>
  );
};

export default AbsenceForm;
