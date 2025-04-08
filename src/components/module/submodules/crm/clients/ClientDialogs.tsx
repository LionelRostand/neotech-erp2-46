
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Client, ClientFormData } from '../types/crm-types';
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
  handleCreateClient: (e: React.FormEvent) => void;
  handleUpdateClient: (e: React.FormEvent) => void;
  handleDeleteClient: () => void;
  resetForm: () => void;
  sectorOptions: { label: string; value: string }[];
  statusOptions: { label: string; value: string }[];
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
  openEditDialog
}) => {
  return (
    <>
      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogDescription>
              Complétez les informations pour créer un nouveau client
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateClient}>
            <ClientForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              sectorOptions={sectorOptions}
              statusOptions={statusOptions}
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>
              Modifiez les informations du client
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateClient}>
            <ClientForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              sectorOptions={sectorOptions}
              statusOptions={statusOptions}
            />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Client Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le client</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedClient && (
              <div>
                <p><strong>Client :</strong> {selectedClient.name}</p>
                <p><strong>Contact :</strong> {selectedClient.contactName}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteClient}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Client Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Détails du client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientDetails 
              client={selectedClient} 
              onEdit={() => {
                setIsViewDetailsOpen(false);
                // Use setTimeout to avoid dialog closing conflicts
                setTimeout(() => openEditDialog(selectedClient), 100);
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
    </>
  );
};

export default ClientDialogs;
