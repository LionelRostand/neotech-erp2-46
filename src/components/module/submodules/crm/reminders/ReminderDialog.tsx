
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { ReminderData } from "../types/crm-types";

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reminderData: ReminderData;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
  entityName: string;
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({
  isOpen,
  onClose,
  reminderData,
  onChange,
  onSave,
  entityName
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un rappel</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du rappel</Label>
            <Input
              id="title"
              value={reminderData.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Ex: Appel de suivi"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date du rappel</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={reminderData.date}
                onChange={(e) => onChange('date', e.target.value)}
                required
              />
              <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={reminderData.notes || ''}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder={`Notes concernant le rappel pour ${entityName}...`}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
