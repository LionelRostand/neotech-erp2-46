
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Container } from '@/types/freight';
import ContainerEditForm from './ContainerEditForm';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface ContainerEditDialogProps {
  open: boolean;
  onClose: () => void;
  container: Container;
  onSave?: () => void;
}

const ContainerEditDialog: React.FC<ContainerEditDialogProps> = ({
  open,
  onClose,
  container,
  onSave
}) => {
  const [editedContainer, setEditedContainer] = useState<Container>({ ...container });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Container, value: string) => {
    setEditedContainer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateDocument(COLLECTIONS.FREIGHT.CONTAINERS, container.id, editedContainer);
      toast.success('Conteneur mis à jour avec succès');
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du conteneur');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le conteneur {container.number}</DialogTitle>
        </DialogHeader>
        
        <ContainerEditForm
          container={editedContainer}
          onChange={handleChange}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerEditDialog;
