
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AbsenceForm from '../absences/AbsenceForm';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CreateLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateLeaveDialog: React.FC<CreateLeaveDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleSubmit = async (data: any) => {
    try {
      console.log('Données du formulaire:', data);
      
      if (!data.startDate || !data.endDate) {
        toast.error("Veuillez sélectionner des dates valides");
        return;
      }
      
      // Préparation des données pour l'API
      const leaveData = {
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        type: data.type,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        reason: data.reason || '',
        notes: data.notes || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        days: Math.ceil(
          (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1 // +1 car inclusif
      };

      // Safety check for collection path
      const leavesCollection = COLLECTIONS.HR.LEAVES || 'hr_leaves';
      
      // Créer la demande de congé directement avec Firebase
      const collectionRef = collection(db, leavesCollection);
      await addDoc(collectionRef, leaveData);
      
      toast.success("Demande de congé créée avec succès");
      onOpenChange(false);
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error("Erreur lors de la création de la demande de congé:", error);
      toast.error("Erreur lors de la création de la demande de congé");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
        </DialogHeader>
        <AbsenceForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeaveDialog;
