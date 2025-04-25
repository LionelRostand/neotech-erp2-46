
import React from 'react';
import AddAppointmentDialog from './AddAppointmentDialog';
import { GarageClient, Vehicle } from '@/components/module/submodules/garage/types/garage-types';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients?: GarageClient[];
  vehicles?: Vehicle[];
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  open,
  onOpenChange,
  clients = [],
  vehicles = []
}) => {
  // Use the callback format for onOpenChange to ensure consistent behavior
  const handleOpenChange = (value: boolean) => {
    // If onOpenChange is provided, call it
    if (typeof onOpenChange === 'function') {
      onOpenChange(value);
    } else {
      console.error("onOpenChange is not a function in CreateAppointmentDialog");
    }
  };

  return (
    <AddAppointmentDialog
      open={open}
      onOpenChange={handleOpenChange}
      clients={clients}
      vehicles={vehicles}
    />
  );
};

export default CreateAppointmentDialog;
