
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CreateLeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateLeaveRequestDialog: React.FC<CreateLeaveRequestDialogProps> = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState('');
  const [halfDay, setHalfDay] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically save the leave request
    console.log('Creating leave request', { startDate, endDate, leaveType, halfDay });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="leave-type">Type de congé</Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger id="leave-type">
                <SelectValue placeholder="Sélectionner un type de congé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conges-payes">Congés payés</SelectItem>
                <SelectItem value="rtt">RTT</SelectItem>
                <SelectItem value="maladie">Maladie</SelectItem>
                <SelectItem value="conges-speciaux">Congés spéciaux</SelectItem>
                <SelectItem value="conges-sans-solde">Congés sans solde</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {startDate ? (
                      format(startDate, 'PP', { locale: fr })
                    ) : (
                      <span className="text-gray-400">Sélectionner une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {endDate ? (
                      format(endDate, 'PP', { locale: fr })
                    ) : (
                      <span className="text-gray-400">Sélectionner une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="half-day">Demi-journée</Label>
            <Select value={halfDay} onValueChange={setHalfDay}>
              <SelectTrigger id="half-day">
                <SelectValue placeholder="Journée complète" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Journée complète</SelectItem>
                <SelectItem value="morning-start">Matin premier jour</SelectItem>
                <SelectItem value="afternoon-start">Après-midi premier jour</SelectItem>
                <SelectItem value="morning-end">Matin dernier jour</SelectItem>
                <SelectItem value="afternoon-end">Après-midi dernier jour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motif (optionnel)</Label>
            <Textarea
              id="reason"
              placeholder="Précisez le motif de votre demande de congé..."
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">Soumettre la demande</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
