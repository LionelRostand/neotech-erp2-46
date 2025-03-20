
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, BellRing, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ProspectForm from './ProspectForm';
import ProspectDetails from './ProspectDetails';
import { Prospect, ProspectFormData, ReminderData } from '../types/crm-types';

interface ProspectDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isViewDetailsOpen: boolean;
  setIsViewDetailsOpen: (isOpen: boolean) => void;
  isConvertDialogOpen: boolean;
  setIsConvertDialogOpen: (isOpen: boolean) => void;
  isReminderDialogOpen: boolean;
  setIsReminderDialogOpen: (isOpen: boolean) => void;
  selectedProspect: Prospect | null;
  formData: ProspectFormData;
  reminderData: ReminderData;
  sourcesOptions: string[];
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCreateProspect: () => void;
  handleUpdateProspect: () => void;
  handleDeleteProspect: () => void;
  handleConvertToClient: () => void;
  handleScheduleReminder: () => void;
  setReminderData: React.Dispatch<React.SetStateAction<ReminderData>>;
  openEditDialog: (prospect: Prospect) => void;
  openReminderDialog: (prospect: Prospect) => void;
  openConvertDialog: (prospect: Prospect) => void;
}

const ProspectDialogs: React.FC<ProspectDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isViewDetailsOpen,
  setIsViewDetailsOpen,
  isConvertDialogOpen,
  setIsConvertDialogOpen,
  isReminderDialogOpen,
  setIsReminderDialogOpen,
  selectedProspect,
  formData,
  reminderData,
  sourcesOptions,
  getStatusBadgeClass,
  getStatusText,
  handleInputChange,
  handleSelectChange,
  handleCreateProspect,
  handleUpdateProspect,
  handleDeleteProspect,
  handleConvertToClient,
  handleScheduleReminder,
  setReminderData,
  openEditDialog,
  openReminderDialog,
  openConvertDialog
}) => {
  return (
    <>
      {/* Dialog d'ajout de prospect */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau prospect</DialogTitle>
          </DialogHeader>
          
          <ProspectForm 
            formData={formData}
            sourcesOptions={sourcesOptions}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateProspect}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification de prospect */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le prospect</DialogTitle>
          </DialogHeader>
          
          <ProspectForm 
            formData={formData}
            sourcesOptions={sourcesOptions}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateProspect}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le prospect {selectedProspect?.name} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProspect} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de conversion en client */}
      <AlertDialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Convertir en client</AlertDialogTitle>
            <AlertDialogDescription>
              Convertir {selectedProspect?.name} en client ? Cette action transformera ce prospect en client actif dans votre CRM.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConvertToClient} className="bg-green-600 hover:bg-green-700 text-white">
              Convertir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de détails du prospect */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Détails du prospect</DialogTitle>
          </DialogHeader>
          
          {selectedProspect && (
            <ProspectDetails 
              prospect={selectedProspect}
              getStatusBadgeClass={getStatusBadgeClass}
              getStatusText={getStatusText}
            />
          )}
          
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Fermer
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setIsViewDetailsOpen(false);
                openReminderDialog(selectedProspect!);
              }}
            >
              <BellRing className="mr-2 h-4 w-4" />
              Programmer une relance
            </Button>
            <Button 
              onClick={() => {
                setIsViewDetailsOpen(false);
                openEditDialog(selectedProspect!);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setIsViewDetailsOpen(false);
                openConvertDialog(selectedProspect!);
              }}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Convertir en client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de programmation de relance */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Programmer une relance</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de relance</label>
              <Select
                value={reminderData.type}
                onValueChange={(value) => setReminderData({...reminderData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de relance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="appel">Appel téléphonique</SelectItem>
                  <SelectItem value="rendez-vous">Rendez-vous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de la relance</label>
              <Input
                type="date"
                value={reminderData.date}
                onChange={(e) => setReminderData({...reminderData, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <Input
                placeholder="Information complémentaire sur la relance"
                value={reminderData.note}
                onChange={(e) => setReminderData({...reminderData, note: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleScheduleReminder}>
              <BellRing className="mr-2 h-4 w-4" />
              Programmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProspectDialogs;
