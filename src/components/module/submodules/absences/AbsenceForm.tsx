
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface AbsenceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ 
  onSubmit, 
  onCancel,
  isLoading = false
}) => {
  // États pour stocker les valeurs du formulaire
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  
  // Récupérer la liste des employés
  const { employees, isLoading: employeesLoading } = useEmployeeData();

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation minimale
    if (!employeeId || !type || !startDate || !endDate) {
      return;
    }
    
    // Préparation des données à soumettre
    const formData = {
      employeeId,
      employeeName,
      type,
      startDate,
      endDate,
      reason,
      notes
    };
    
    onSubmit(formData);
  };

  // Mettre à jour le nom de l'employé lorsque l'ID change
  useEffect(() => {
    if (employeeId && employees && Array.isArray(employees)) {
      const selectedEmployee = employees.find(emp => emp && emp.id === employeeId);
      if (selectedEmployee) {
        setEmployeeName(`${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
      }
    }
  }, [employeeId, employees]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sélection de l'employé */}
      <div className="space-y-2">
        <Label htmlFor="employee">Employé</Label>
        <Select value={employeeId} onValueChange={setEmployeeId}>
          <SelectTrigger id="employee">
            <SelectValue placeholder="Sélectionner un employé" />
          </SelectTrigger>
          <SelectContent>
            {employeesLoading ? (
              <SelectItem value="loading" disabled>Chargement...</SelectItem>
            ) : (
              employees && Array.isArray(employees) ? employees.map(emp => emp && (
                <SelectItem key={emp.id} value={emp.id}>
                  {`${emp.firstName} ${emp.lastName}`}
                </SelectItem>
              )) : <SelectItem value="no-data" disabled>Aucun employé trouvé</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Type de congé */}
      <div className="space-y-2">
        <Label htmlFor="type">Type de congé</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Sélectionner un type de congé" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paid">Congés payés</SelectItem>
            <SelectItem value="rtt">RTT</SelectItem>
            <SelectItem value="rtte">RTTe</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dates de début et fin avec DatePicker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            placeholder="Début du congé"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <DatePicker
            date={endDate}
            setDate={setEndDate}
            placeholder="Fin du congé"
          />
        </div>
      </div>

      {/* Motif (optionnel) */}
      <div className="space-y-2">
        <Label htmlFor="reason">Motif (optionnel)</Label>
        <Textarea 
          id="reason" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          placeholder="Précisez le motif de votre demande de congé" 
          className="resize-none h-24"
        />
      </div>

      {/* Notes internes (optionnel) */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea 
          id="notes" 
          value={notes} 
          onChange={(e) => setNotes(e.target.value)} 
          placeholder="Notes internes" 
          className="resize-none h-16"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          Soumettre la demande
        </Button>
      </div>
    </form>
  );
};

export default AbsenceForm;
