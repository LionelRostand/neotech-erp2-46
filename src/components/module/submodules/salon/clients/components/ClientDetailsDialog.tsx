
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalonClient } from '../../types/salon-types';
import ClientForm from './ClientForm';
import { useClientForm } from '../hooks/useClientForm';
import ClientVisitHistory from './ClientVisitHistory';
import ClientAppointments from './ClientAppointments';
import ClientLoyalty from './ClientLoyalty';
import DeleteClientDialog from './DeleteClientDialog';

interface ClientDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: SalonClient;
  onUpdate: (client: SalonClient) => void;
  onDelete: (clientId: string) => void;
}

const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  client,
  onUpdate,
  onDelete
}) => {
  const { formData, formErrors, setFormData, updateFormField, validateForm } = useClientForm(client);
  const [activeTab, setActiveTab] = useState("profile");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSubmit = () => {
    if (validateForm()) {
      const updatedClient = {
        ...client,
        ...formData
      };
      onUpdate(updatedClient);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{client.firstName} {client.lastName}</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
              <TabsTrigger value="loyalty">Fidélité</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ClientForm 
                formData={formData} 
                formErrors={formErrors} 
                onChange={updateFormField} 
                isEdit={true}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <ClientVisitHistory visits={client.visits} />
            </TabsContent>
            
            <TabsContent value="appointments">
              <ClientAppointments appointments={client.appointments} />
            </TabsContent>
            
            <TabsContent value="loyalty">
              <ClientLoyalty 
                loyaltyPoints={client.loyaltyPoints} 
                clientId={client.id} 
                onPointsUpdated={(newPoints) => {
                  onUpdate({
                    ...client,
                    loyaltyPoints: newPoints
                  });
                }}
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Supprimer
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
              {activeTab === "profile" && (
                <Button onClick={handleSubmit}>Enregistrer</Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteClientDialog 
        isOpen={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        clientName={`${client.firstName} ${client.lastName}`}
        onConfirm={() => {
          onDelete(client.id);
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
};

export default ClientDetailsDialog;
