
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
  clients,
  vehicles
}) => {
  return (
    <AddAppointmentDialog
      open={open}
      onOpenChange={onOpenChange}
      clients={clients}
      vehicles={vehicles}
    />
  );
};

export default CreateAppointmentDialog;
