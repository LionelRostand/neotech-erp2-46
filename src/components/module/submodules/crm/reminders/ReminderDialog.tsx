
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  relatedTo: {
    type: 'prospect' | 'client' | 'opportunity';
    id: string;
    name: string;
  };
  onAddReminder?: (data: ReminderData) => void;
}

export interface ReminderData {
  id?: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
  prospectId?: string;
  clientId?: string;
  opportunityId?: string;
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({
  isOpen,
  onClose,
  relatedTo,
  onAddReminder
}) => {
  const [reminderData, setReminderData] = useState<ReminderData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    completed: false,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReminderData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setReminderData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setReminderData(prev => ({ ...prev, completed: checked }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Add relation ID based on type
      const data = { ...reminderData };
      if (relatedTo.type === 'prospect') {
        data.prospectId = relatedTo.id;
      } else if (relatedTo.type === 'client') {
        data.clientId = relatedTo.id;
      } else if (relatedTo.type === 'opportunity') {
        data.opportunityId = relatedTo.id;
      }
      
      if (onAddReminder) {
        await onAddReminder(data);
      }
      
      // Reset form
      setReminderData({
        title: '',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        notes: ''
      });
      
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un rappel</DialogTitle>
          <DialogDescription>
            Créez un rappel pour le suivi de {relatedTo.type === 'prospect' ? 'ce prospect' : 
              relatedTo.type === 'client' ? 'ce client' : 'cette opportunité'}: {relatedTo.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du rappel</Label>
            <Input
              id="title"
              name="title"
              value={reminderData.title}
              onChange={handleInputChange}
              placeholder="Ex: Appeler pour suivre la proposition"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date du rappel</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !reminderData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reminderData.date ? (
                    format(new Date(reminderData.date), "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={reminderData.date ? new Date(reminderData.date) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={reminderData.notes || ''}
              onChange={handleInputChange}
              placeholder="Détails du rappel..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="completed"
              checked={reminderData.completed}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="completed">Déjà complété</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? "Création..." : "Créer le rappel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
