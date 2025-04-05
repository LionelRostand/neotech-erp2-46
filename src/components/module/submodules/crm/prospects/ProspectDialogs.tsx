
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import ProspectForm from './ProspectForm';
import ProspectDetails from './ProspectDetails';
import { Prospect, ProspectFormData, ReminderData } from '../types/crm-types';
import { useProspectForm } from '../hooks/prospect/useProspectForm';

interface ProspectDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isViewDetailsOpen: boolean;
  isConvertDialogOpen: boolean;
  isReminderDialogOpen: boolean;
  
  setIsAddDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsViewDetailsOpen: (open: boolean) => void;
  setIsConvertDialogOpen: (open: boolean) => void;
  setIsReminderDialogOpen: (open: boolean) => void;
  
  formData: ProspectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProspectFormData>>;
  
  reminderData: ReminderData;
  setReminderData: React.Dispatch<React.SetStateAction<ReminderData>>;
  
  selectedProspect: Prospect | null;
  isSubmitting: boolean;
  
  sourcesOptions: string[];
  
  handleAddProspect: () => void;
  handleUpdateProspect: () => void;
  handleDeleteProspect: () => void;
  handleAddReminder: () => void;
  handleConvertToClient: () => void;
}

const ProspectDialogs: React.FC<ProspectDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isViewDetailsOpen,
  isConvertDialogOpen,
  isReminderDialogOpen,
  
  setIsAddDialogOpen,
  setIsEditDialogOpen,
  setIsDeleteDialogOpen,
  setIsViewDetailsOpen,
  setIsConvertDialogOpen,
  setIsReminderDialogOpen,
  
  formData,
  setFormData,
  
  reminderData,
  setReminderData,
  
  selectedProspect,
  isSubmitting,
  
  sourcesOptions,
  
  handleAddProspect,
  handleUpdateProspect,
  handleDeleteProspect,
  handleAddReminder,
  handleConvertToClient
}) => {
  // Reusing the form handlers
  const { handleInputChange, handleSelectChange } = useProspectForm(setFormData);
  
  // Handle changes for the reminder dialog
  const handleReminderInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReminderData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleReminderDateChange = (date: Date | undefined) => {
    if (date) {
      setReminderData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
    }
  };
  
  const handleReminderCheckboxChange = (checked: boolean) => {
    setReminderData(prev => ({ ...prev, completed: checked }));
  };

  return (
    <>
      {/* Add Prospect Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau prospect</DialogTitle>
          </DialogHeader>
          
          <ProspectForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            sourcesOptions={sourcesOptions}
            onSubmit={handleAddProspect}
            isSubmitting={isSubmitting}
            buttonText="Ajouter le prospect"
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Prospect Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le prospect</DialogTitle>
            {selectedProspect && (
              <DialogDescription>
                Modification de {selectedProspect.company} - {selectedProspect.contactName || selectedProspect.name}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <ProspectForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            sourcesOptions={sourcesOptions}
            onSubmit={handleUpdateProspect}
            isSubmitting={isSubmitting}
            buttonText="Enregistrer les modifications"
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Prospect Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Supprimer le prospect</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce prospect ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProspect && (
            <div className="my-4 p-4 border rounded-md">
              <p><strong>Entreprise:</strong> {selectedProspect.company}</p>
              <p><strong>Contact:</strong> {selectedProspect.contactName || selectedProspect.name}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProspect}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails du prospect</DialogTitle>
          </DialogHeader>
          
          {selectedProspect && <ProspectDetails prospect={selectedProspect} />}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Convert to Client Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Convertir en client</DialogTitle>
            <DialogDescription>
              Voulez-vous convertir ce prospect en client ? Les informations seront transférées dans la section clients.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProspect && (
            <div className="my-4 p-4 border rounded-md">
              <p><strong>Entreprise:</strong> {selectedProspect.company}</p>
              <p><strong>Contact:</strong> {selectedProspect.contactName || selectedProspect.name}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConvertDialogOpen(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConvertToClient}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Conversion..." : "Convertir en client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un rappel</DialogTitle>
            <DialogDescription>
              Créez un rappel pour le suivi de ce prospect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du rappel</Label>
              <Input
                id="title"
                name="title"
                value={reminderData.title}
                onChange={handleReminderInputChange}
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
                    onSelect={handleReminderDateChange}
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
                onChange={handleReminderInputChange}
                placeholder="Détails du rappel..."
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="completed"
                checked={reminderData.completed}
                onCheckedChange={handleReminderCheckboxChange}
              />
              <Label htmlFor="completed">Déjà complété</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReminderDialogOpen(false)}
              disabled={isSubmitting}
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button 
              onClick={handleAddReminder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Clock className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Création..." : "Créer le rappel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProspectDialogs;
