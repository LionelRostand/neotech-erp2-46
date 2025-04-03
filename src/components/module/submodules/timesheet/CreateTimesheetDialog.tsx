
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TimesheetForm from './TimesheetForm';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface CreateTimesheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateTimesheetDialog: React.FC<CreateTimesheetDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleSubmit = async (data: any) => {
    try {
      await addDocument(COLLECTIONS.HR.TIME_SHEETS, data);
      toast.success("Feuille de temps créée avec succès");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la création de la feuille de temps:", error);
      toast.error("Erreur lors de la création de la feuille de temps");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <TimesheetForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTimesheetDialog;
