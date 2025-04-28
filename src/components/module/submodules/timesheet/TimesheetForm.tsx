import React, { useState } from 'react';
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Employee } from '@/types/employee';
import { TimeReportStatus } from '@/types/timesheet';

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
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [weekStartDate, setWeekStartDate] = useState<Date>();
  const [status, setStatus] = useState<string>('active');
  const [notes, setNotes] = useState<string>('');
  
  // Heures par jour
  const [hours, setHours] = useState<Record<string, string>>({
    monday: '0',
    tuesday: '0',
    wednesday: '0',
    thursday: '0',
    friday: '0',
    saturday: '0',
    sunday: '0'
  });

  // Calculer la date de fin (7 jours après la date de début)
  const weekEndDate = weekStartDate ? addDays(weekStartDate, 6) : undefined;
  
  // Formatage de la période pour l'affichage
  const periodText = weekStartDate && weekEndDate 
    ? `Période: ${format(weekStartDate, 'dd/MM/yyyy', { locale: fr })} - ${format(weekEndDate, 'dd/MM/yyyy', { locale: fr })}`
    : 'Sélectionnez une date de début';

  // Calculer le total des heures
  const totalHours = Object.values(hours).reduce((sum, hour) => sum + (parseFloat(hour) || 0), 0);

  // Mettre à jour les heures pour un jour spécifique
  const handleHoursChange = (day: string, value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (!selectedEmployee) {
      alert('Veuillez sélectionner un employé');
      return;
    }

    if (!weekStartDate) {
      alert('Veuillez sélectionner une date de début');
      return;
    }

    const formData = {
      employeeId: selectedEmployee,
      weekStartDate,
      weekEndDate,
      status,
      notes,
      hours,
      totalHours
    };

    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Nouvelle feuille de temps</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Employé</label>
          <Select
            value={selectedEmployee}
            onValueChange={setSelectedEmployee}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {`${employee.firstName} ${employee.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Début de semaine</label>
          <DatePicker
            date={weekStartDate}
            setDate={setWeekStartDate}
            placeholder="Sélectionner une date de début"
            disabled={isSubmitting}
          />
          {weekStartDate && (
            <p className="text-sm text-muted-foreground">{periodText}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Statut</label>
          <Select
            value={status}
            onValueChange={setStatus}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">En cours</SelectItem>
              <SelectItem value="pending">Soumis</SelectItem>
              <SelectItem value="validated">Validé</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Heures travaillées</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs">Lundi</label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.monday}
                onChange={(e) => handleHoursChange('monday', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs">Mardi</label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.tuesday}
                onChange={(e) => handleHoursChange('tuesday', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs">Mercredi</label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.wednesday}
                onChange={(e) => handleHoursChange('wednesday', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs">Jeudi</label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.thursday}
                onChange={(e) => handleHoursChange('thursday', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs">Vendredi</label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.friday}
                onChange={(e) => handleHoursChange('friday', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs">Samedi</label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.saturday}
                onChange={(e) => handleHoursChange('saturday', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs">Dimanche</label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours.sunday}
                onChange={(e) => handleHoursChange('sunday', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Total</label>
              <Input
                type="number"
                value={totalHours}
                readOnly
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            placeholder="Notes ou commentaires sur cette feuille de temps"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedEmployee || !weekStartDate}
          >
            {isSubmitting ? "Création en cours..." : "Créer la feuille de temps"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetForm;
