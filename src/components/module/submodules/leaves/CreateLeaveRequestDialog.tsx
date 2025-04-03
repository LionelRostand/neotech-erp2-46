
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      toast.error("La date de fin doit être postérieure à la date de début");
      return;
    }
    
    setIsSubmitting(true);
    
    // Calculer le nombre de jours
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 car inclusif
    
    // Récupérer l'employé sélectionné
    const employee = employees?.find(emp => emp.id === selectedEmployee);
    
    const newLeaveRequest = {
      employeeId: selectedEmployee,
      type: leaveType,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
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
    setStartDate('');
    setEndDate('');
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
                {employees?.map(employee => (
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
                <SelectItem value="Congé exceptionnel">Congé exceptionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input 
                id="startDate" 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input 
                id="endDate" 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
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
