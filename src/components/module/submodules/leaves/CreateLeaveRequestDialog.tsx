
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { DatePicker } from '@/components/ui/date-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';

interface CreateLeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateLeaveRequestDialog: React.FC<CreateLeaveRequestDialogProps> = ({ 
  isOpen, 
  onClose,
  onSubmit
}) => {
  const { employees } = useHrModuleData();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filtrer les employés uniques basés sur leur ID pour éviter les doublons
  const uniqueEmployees = employees?.reduce((acc: any[], current) => {
    const isDuplicate = acc.find(item => item.id === current.id);
    if (!isDuplicate) {
      acc.push(current);
    }
    return acc;
  }, []) || [];
  
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    // Add 1 because the period is inclusive
    return differenceInDays(addDays(endDate, 1), startDate);
  };
  
  const handleSubmit = () => {
    if (!selectedEmployee) {
      toast.error("Veuillez sélectionner un employé");
      return;
    }
    
    if (!leaveType) {
      toast.error("Veuillez sélectionner un type de congé");
      return;
    }
    
    if (!startDate) {
      toast.error("Veuillez sélectionner une date de début");
      return;
    }
    
    if (!endDate) {
      toast.error("Veuillez sélectionner une date de fin");
      return;
    }
    
    if (startDate > endDate) {
      toast.error("La date de fin doit être postérieure à la date de début");
      return;
    }
    
    setIsSubmitting(true);
    
    // Calculer le nombre de jours
    const diffDays = calculateDays();
    
    // Récupérer l'employé sélectionné
    const employee = uniqueEmployees.find(emp => emp.id === selectedEmployee);
    
    const newLeaveRequest = {
      employeeId: selectedEmployee,
      type: leaveType,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      days: diffDays,
      status: 'En attente',
      reason,
      requestDate: new Date().toISOString(),
      employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
    };
    
    // Simuler une latence réseau
    setTimeout(() => {
      onSubmit(newLeaveRequest);
      setIsSubmitting(false);
      resetForm();
    }, 1000);
  };
  
  const resetForm = () => {
    setSelectedEmployee('');
    setLeaveType('');
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employé</Label>
            <Select 
              value={selectedEmployee} 
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger id="employee">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {uniqueEmployees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="leaveType">Type de congé</Label>
            <Select 
              value={leaveType} 
              onValueChange={setLeaveType}
            >
              <SelectTrigger id="leaveType">
                <SelectValue placeholder="Sélectionner un type de congé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Congés payés">Congés payés</SelectItem>
                <SelectItem value="RTT">RTT</SelectItem>
                <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                <SelectItem value="Congé familial">Congé familial</SelectItem>
                <SelectItem value="Congé maternité">Congé maternité</SelectItem>
                <SelectItem value="Congé paternité">Congé paternité</SelectItem>
                <SelectItem value="Congé exceptionnel">Congé exceptionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <DatePicker 
                date={startDate} 
                onSelect={setStartDate}
                placeholder="Début du congé"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <DatePicker 
                date={endDate} 
                onSelect={setEndDate}
                placeholder="Fin du congé"
              />
            </div>
          </div>
          
          {startDate && endDate && (
            <div className="bg-blue-50 p-3 rounded-md flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm text-blue-700">
                Durée: <span className="font-semibold">{calculateDays()} jour{calculateDays() > 1 ? 's' : ''}</span>
              </span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motif (optionnel)</Label>
            <Textarea 
              id="reason" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              placeholder="Précisez le motif de votre demande de congé"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="h-4 w-4 mr-2 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
                Envoi en cours...
              </span>
            ) : 'Soumettre la demande'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
