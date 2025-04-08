
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { ClientFormData, Client } from '../types/crm-types';
import ClientForm from './ClientForm';
import ClientDetails from './ClientDetails';

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
  handleCreateClient: () => void;
  handleUpdateClient: () => void;
  handleDeleteClient: () => void;
  resetForm: () => void;
  sectorOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  openEditDialog: (client: Client) => void;
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
  statusOptions,
  openEditDialog,
}) => {
  // Add Client Dialog
  const AddClientDialog = (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un client</DialogTitle>
        </DialogHeader>
        <ClientForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          sectorOptions={sectorOptions}
          statusOptions={statusOptions}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreateClient}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Edit Client Dialog
  const EditClientDialog = (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
        </DialogHeader>
        <ClientForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          sectorOptions={sectorOptions}
          statusOptions={statusOptions}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleUpdateClient}>
            Mettre à jour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Delete Client Dialog
  const DeleteClientDialog = (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement le client{' '}
            <strong>{selectedClient?.name}</strong> et supprimera les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteClient} className="bg-red-500 hover:bg-red-600">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // View Client Details Dialog
  const ViewClientDetailsDialog = (
    <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du client</DialogTitle>
        </DialogHeader>
        {selectedClient && (
          <ClientDetails 
            client={selectedClient}
            onEdit={() => {
              setIsViewDetailsOpen(false);
              openEditDialog(selectedClient);
            }}
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {AddClientDialog}
      {EditClientDialog}
      {DeleteClientDialog}
      {ViewClientDetailsDialog}
    </>
  );
};

export default ClientDialogs;
