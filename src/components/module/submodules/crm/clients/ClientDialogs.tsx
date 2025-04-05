
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ClientForm from './ClientForm';
import ClientDetails from './ClientDetails';
import { Client, ClientFormData } from '../types/crm-types';

interface ClientDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isViewDetailsOpen: boolean;
  setIsViewDetailsOpen: (open: boolean) => void;
  selectedClient: Client | null;
  formData: ClientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCreateClient: (data: ClientFormData) => void;
  handleUpdateClient: (data: ClientFormData) => void;
  handleDeleteClient: () => void;
  resetForm: () => void;
  sectorOptions: { value: string, label: string }[];
  statusOptions: { value: string, label: string }[];
}

const ClientDialogs: React.FC<ClientDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isViewDetailsOpen,
  setIsViewDetailsOpen,
  selectedClient,
  formData,
  handleInputChange,
  handleSelectChange,
  handleCreateClient,
  handleUpdateClient,
  handleDeleteClient,
  resetForm,
  sectorOptions,
  statusOptions
}) => {
  // Helper function to extract sectors array for the form
  const sectors = sectorOptions
    .filter(option => option.value !== 'all')
    .map(option => option.value);

  return (
    <>
      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Ajouter un client</DialogTitle>
            <DialogDescription>
              Remplissez les détails du nouveau client.
            </DialogDescription>
          </DialogHeader>
          
          <ClientForm
            formData={formData}
            sectors={sectors}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}>
              Annuler
            </Button>
            <Button onClick={() => handleCreateClient(formData)}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les détails du client.
            </DialogDescription>
          </DialogHeader>
          
          <ClientForm
            formData={formData}
            sectors={sectors}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              Annuler
            </Button>
            <Button onClick={() => handleUpdateClient(formData)}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Client Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le client
              {selectedClient && ` ${selectedClient.name}`} et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDeleteClient}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* View Client Details */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Détails du client</DialogTitle>
            <DialogDescription>
              Informations complètes sur le client.
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && <ClientDetails client={selectedClient} />}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Fermer
            </Button>
            {selectedClient && (
              <Button onClick={() => {
                setIsViewDetailsOpen(false);
                openEditDialog(selectedClient);
              }}>
                Modifier
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDialogs;
