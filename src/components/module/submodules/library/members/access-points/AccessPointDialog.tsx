
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AccessPointForm from './AccessPointForm';
import { AccessPoint } from './types';

interface AccessPointDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accessPoint?: AccessPoint;
  onSubmit: (data: any) => void;
  mode: 'add' | 'edit';
}

const AccessPointDialog: React.FC<AccessPointDialogProps> = ({
  isOpen,
  onOpenChange,
  accessPoint,
  onSubmit,
  mode
}) => {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Ajouter un point d\'accès' : 'Modifier le point d\'accès'}
          </DialogTitle>
        </DialogHeader>
        <AccessPointForm 
          accessPoint={accessPoint}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AccessPointDialog;
