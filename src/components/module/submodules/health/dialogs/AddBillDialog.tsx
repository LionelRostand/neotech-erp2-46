
import React from "react";
import FormDialog from "./FormDialog";
import AddBillForm from "../forms/AddBillForm";
import { toast } from "sonner";

interface AddBillDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddBillDialog = ({ open, onClose }: AddBillDialogProps) => {
  const handleSubmit = (data: any) => {
    console.log("New bill data:", data);
    toast.success("Facture créée avec succès");
    onClose();
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title="Nouvelle Facture"
      description="Créer une nouvelle facture"
    >
      <AddBillForm onSubmit={handleSubmit} onCancel={onClose} />
    </FormDialog>
  );
};

export default AddBillDialog;
