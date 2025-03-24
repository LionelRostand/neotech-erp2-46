
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format, addDays, differenceInBusinessDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface CreateLeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LEAVE_TYPES = [
  { value: 'paid', label: 'Congés payés' },
  { value: 'rtt', label: 'RTT' },
  { value: 'sick', label: 'Maladie' },
  { value: 'unpaid', label: 'Sans solde' },
  { value: 'family', label: 'Événement familial' },
];

export const CreateLeaveRequestDialog: React.FC<CreateLeaveRequestDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [halfDay, setHalfDay] = useState('');
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [daysCount, setDaysCount] = useState<number | null>(null);

  const resetForm = () => {
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setHalfDay('');
    setReason('');
    setComment('');
    setDaysCount(null);
  };

  const calculateDays = () => {
    if (!startDate) return;
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    
    if (start && end) {
      let days = differenceInBusinessDays(end, start) + 1;
      
      if (halfDay === 'start' || halfDay === 'end') {
        days -= 0.5;
      } else if (halfDay === 'both') {
        days -= 1;
      }
      
      setDaysCount(Math.max(0, days));
    }
  };

  const handleSubmit = () => {
    if (!leaveType || !startDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!daysCount || daysCount <= 0) {
      toast.error("La période sélectionnée ne contient pas de jours ouvrés");
      return;
    }
    
    const formData = {
      type: leaveType,
      startDate,
      endDate: endDate || startDate,
      halfDay,
      daysCount,
      reason,
      comment
    };
    
    onSubmit(formData);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="leave-type">Type de congé *</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger id="leave-type">
                <SelectValue placeholder="Sélectionnez un type de congé" />
              </SelectTrigger>
              <SelectContent>
                {LEAVE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  id="start-date" 
                  type="date"
                  className="pl-9" 
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (!endDate || new Date(e.target.value) > new Date(endDate)) {
                      setEndDate(e.target.value);
                    }
                  }}
                  onBlur={calculateDays}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  id="end-date" 
                  type="date"
                  className="pl-9" 
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onBlur={calculateDays}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="half-day">Demi-journée</Label>
            <Select value={halfDay} onValueChange={(value) => {
              setHalfDay(value);
              setTimeout(calculateDays, 0);
            }}>
              <SelectTrigger id="half-day">
                <SelectValue placeholder="Journée complète" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Journée complète</SelectItem>
                <SelectItem value="start">Demi-journée en début de période</SelectItem>
                <SelectItem value="end">Demi-journée en fin de période</SelectItem>
                <SelectItem value="both">Demi-journée en début et fin de période</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {daysCount !== null && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Nombre de jours : </span>
                {daysCount} jour{daysCount !== 1 ? 's' : ''} ouvré{daysCount !== 1 ? 's' : ''}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motif</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Sélectionnez un motif (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacances</SelectItem>
                <SelectItem value="personal">Raison personnelle</SelectItem>
                <SelectItem value="family">Événement familial</SelectItem>
                <SelectItem value="medical">Rendez-vous médical</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea 
              id="comment" 
              placeholder="Commentaire additionnel (optionnel)" 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Soumettre la demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
