
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface AbsenceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    type: 'maladie',
    startDate: new Date(),
    endDate: new Date(),
    status: 'pending',
    reason: '',
    notes: '',
    createdAt: new Date(),
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="employeeName" className="block text-sm font-medium mb-1">
            Employé
          </label>
          <Input 
            id="employeeName" 
            placeholder="Nom de l'employé"
            value={formData.employeeName}
            onChange={(e) => handleChange('employeeName', e.target.value)}
            required
          />
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
                {format(formData.startDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => {
                  handleChange('startDate', date);
                  setStartDateOpen(false);
                }}
                initialFocus
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
                {format(formData.endDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => {
                  handleChange('endDate', date);
                  setEndDateOpen(false);
                }}
                initialFocus
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
        <Button type="submit">
          Soumettre
        </Button>
      </div>
    </form>
  );
};

export default AbsenceForm;
