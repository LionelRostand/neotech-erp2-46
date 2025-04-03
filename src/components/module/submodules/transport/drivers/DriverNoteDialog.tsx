import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogFooter, DialogTitle, DialogContent, Dialog, DialogDescription } from "@/components/ui/dialog";
import { Clock, Book } from "lucide-react";
import { TransportDriver } from '../types';

interface DriverNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: TransportDriver | null;
  onSave: (data: { title: string; note: string }) => void;
}

const DriverNoteDialog: React.FC<DriverNoteDialogProps> = ({
  open,
  onOpenChange,
  driver,
  onSave
}) => {
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, note });
    setTitle("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une note</DialogTitle>
          <DialogDescription>
            {driver ? `Ajouter une note pour ${driver.firstName} ${driver.lastName}` : 'Ajouter une note'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Titre</label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ex: Préférences de conduite"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium">Note</label>
            <Textarea 
              id="note" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="Détails de la note..."
              rows={5}
              required
            />
          </div>
          
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={12} />
            <span>Ajoutée le {new Date().toLocaleDateString()}</span>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex items-center gap-1">
              <Book size={16} />
              <span>Enregistrer la note</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DriverNoteDialog;
