
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DatePicker } from '@/components/ui/date-picker';

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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sélection de l'employé */}
      <div className="space-y-2">
        <Label htmlFor="employee">Employé</Label>
        <Select value={employeeId} onValueChange={(value) => {
          setEmployeeId(value);
          // Ici, vous pourriez également mettre à jour employeeName en fonction de l'ID sélectionné
        }}>
          <SelectTrigger id="employee">
            <SelectValue placeholder="Sélectionner un employé" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="emp1">Jean Dupont</SelectItem>
            <SelectItem value="emp2">Marie Martin</SelectItem>
            <SelectItem value="emp3">Pierre Durand</SelectItem>
            {/* Ces options devraient être générées dynamiquement à partir des données d'employés */}
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
            <SelectItem value="unpaid">Congés sans solde</SelectItem>
            <SelectItem value="sick">Arrêt maladie</SelectItem>
            <SelectItem value="family">Congés familiaux</SelectItem>
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
