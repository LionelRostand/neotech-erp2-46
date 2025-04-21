
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContainerTabs from './ContainerTabs';
import ContainerEditForm from './ContainerEditForm';
import { useCreateContainer } from '@/hooks/modules/useContainersFirestore';
import { toast } from 'sonner';
import useFreightData from '@/hooks/modules/useFreightData';

interface ContainerCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const defaultValues = {
  number: '',
  type: '',
  size: '',
  status: '',
  carrierName: '',
  origin: '',
  destination: '',
  departure: '',
  arrival: '',
  client: '',
  location: '',
};

const ContainerCreateDialog: React.FC<ContainerCreateDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [tab, setTab] = useState("info");
  const [values, setValues] = useState(defaultValues);
  const { carriers, clients, routes } = useFreightData();
  const createContainer = useCreateContainer();

  const handleChange = (field: keyof typeof defaultValues, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await createContainer.mutateAsync(values);
      toast.success('Conteneur créé avec succès');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating container:', error);
      toast.error('Erreur lors de la création du conteneur');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau conteneur</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <ContainerTabs 
            tab={tab} 
            setTab={setTab}
          />

          <div className="mt-4">
            {tab === "info" && (
              <ContainerEditForm
                container={values}
                onChange={handleChange}
                transporteurs={carriers}
                clients={clients}
                routes={routes}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createContainer.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerCreateDialog;
