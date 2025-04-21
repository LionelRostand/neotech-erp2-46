
import React from "react";
import ShipmentWizardDialog from "./ShipmentWizardDialog";

interface ShipmentCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

// Composant qui ouvre le wizard dans un dialogue, puis ferme au succès
const ShipmentCreateDialog: React.FC<ShipmentCreateDialogProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  // onCreated sera déclenché lors d'une création réussie depuis le formulaire-wizard
  const handleCreated = () => {
    if (onCreated) onCreated();
    onClose();
  };

  return (
    <ShipmentWizardDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* ShipmentWizardDialog gère déjà son formulaire */}
    </ShipmentWizardDialog>
  );
};

export default ShipmentCreateDialog;
