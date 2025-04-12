
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TimesheetForm from './TimesheetForm';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface CreateTimesheetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateTimesheetDialog: React.FC<CreateTimesheetDialogProps> = ({ 
  open, 
  onOpenChange,
  onSuccess
}) => {
  // Utiliser useEmployeeData pour obtenir les employés dédupliqués
  const { employees } = useEmployeeData();
  
  const handleSubmit = (data: any) => {
    console.log('Feuille de temps créée:', data);
    
    // Dans un cas réel, vous enverriez ces données à Firebase ici
    toast.success('Feuille de temps créée avec succès');
    
    // Fermer le dialogue et notifier le parent
    onOpenChange(false);
    onSuccess();
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <TimesheetForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          employees={employees || []}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTimesheetDialog;
