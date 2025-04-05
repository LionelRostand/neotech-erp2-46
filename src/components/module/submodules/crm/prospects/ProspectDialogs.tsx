
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProspectFormData, Prospect } from '../types/crm-types';
import ProspectForm from './ProspectForm';

interface ProspectDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  isConvertDialogOpen: boolean;
  setIsConvertDialogOpen: (isOpen: boolean) => void;
  prospect: Prospect | null;
  formData: ProspectFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleAddProspect: (data: ProspectFormData) => void;
  handleUpdateProspect: (data: ProspectFormData) => void;
  handleDeleteProspect: () => void;
  handleConvertToClient: () => void;
  sourceOptions: { value: string; label: string; }[];
  statusOptions: { value: string; label: string; }[];
}

const industryOptions = [
  { value: 'technology', label: 'Technologie' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'manufacturing', label: 'Industrie' },
  { value: 'hospitality', label: 'Hôtellerie' },
  { value: 'consulting', label: 'Conseil' },
  { value: 'real_estate', label: 'Immobilier' },
  { value: 'construction', label: 'Construction' },
  { value: 'other', label: 'Autre' }
];

const ProspectDialogs: React.FC<ProspectDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isConvertDialogOpen,
  setIsConvertDialogOpen,
  prospect,
  formData,
  handleInputChange,
  handleSelectChange,
  handleAddProspect,
  handleUpdateProspect,
  handleDeleteProspect,
  handleConvertToClient,
  sourceOptions,
  statusOptions
}) => {
  return (
    <>
      {/* Add Prospect Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un prospect</DialogTitle>
          </DialogHeader>
          
          <ProspectForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            onSubmit={handleAddProspect}
            buttonText="Ajouter"
            sourceOptions={sourceOptions}
            statusOptions={statusOptions}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Prospect Dialog */}
      {prospect && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier le prospect</DialogTitle>
            </DialogHeader>
            
            <ProspectForm
              initialData={prospect}
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              onSubmit={handleUpdateProspect}
              buttonText="Mettre à jour"
              sourceOptions={sourceOptions}
              statusOptions={statusOptions}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Prospect Dialog */}
      {prospect && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Détails du prospect</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Entreprise</h4>
                    <p className="text-lg">{prospect.company}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Contact</h4>
                    <p className="text-lg">{prospect.contactName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p className="text-lg">{prospect.contactEmail}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Téléphone</h4>
                    <p className="text-lg">{prospect.contactPhone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Statut</h4>
                    <p className="text-lg capitalize">{prospect.status}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Source</h4>
                    <p className="text-lg">{prospect.source}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Industrie</h4>
                    <p className="text-lg">{prospect.industry || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Site web</h4>
                    <p className="text-lg">{prospect.website || 'Non spécifié'}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Adresse</h4>
                    <p className="text-lg">{prospect.address || 'Non spécifié'}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-4">
                <p>Historique à venir...</p>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                  <div className="border p-4 rounded-md min-h-[100px]">
                    {prospect.notes || 'Aucune note disponible.'}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Prospect Dialog */}
      {prospect && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le prospect</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le prospect {prospect.company} ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteProspect}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Convert to Client Dialog */}
      {prospect && (
        <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convertir en client</DialogTitle>
              <DialogDescription>
                Voulez-vous convertir le prospect {prospect.company} en client ? Les informations du prospect seront transférées vers un nouveau client.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleConvertToClient}>
                Convertir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProspectDialogs;
