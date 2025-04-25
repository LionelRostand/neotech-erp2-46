
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MaintenanceForm from './MaintenanceForm';

interface AddMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMaintenanceDialog = ({ open, onOpenChange }: AddMaintenanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une maintenance</DialogTitle>
        </DialogHeader>
        <MaintenanceForm onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddMaintenanceDialog;
