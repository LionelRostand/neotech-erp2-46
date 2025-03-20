
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import ClientForm from './ClientForm';
import ClientDetails from './ClientDetails';

interface ClientDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isViewDetailsOpen: boolean;
  setIsViewDetailsOpen: (isOpen: boolean) => void;
  selectedClient: any;
  formData: {
    name: string;
    sector: string;
    revenue: string;
    status: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  sectors: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCreateClient: () => void;
  handleUpdateClient: () => void;
  handleDeleteClient: () => void;
  openEditDialog: (client: any) => void;
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
  sectors,
  handleInputChange,
  handleSelectChange,
  handleCreateClient,
  handleUpdateClient,
  handleDeleteClient,
  openEditDialog
}) => {
  return (
    <>
      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
          </DialogHeader>
          
          <ClientForm 
            formData={formData}
            sectors={sectors}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateClient}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          
          <ClientForm 
            formData={formData}
            sectors={sectors}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateClient}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer le client "{selectedClient?.name}" ?</p>
            <p className="text-muted-foreground mt-2">Cette action est irréversible.</p>
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Détails du client</DialogTitle>
          </DialogHeader>
          
          {selectedClient && <ClientDetails client={selectedClient} />}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Fermer
            </Button>
            <Button 
              onClick={() => {
                setIsViewDetailsOpen(false);
                openEditDialog(selectedClient);
              }}
            >
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientDialogs;
