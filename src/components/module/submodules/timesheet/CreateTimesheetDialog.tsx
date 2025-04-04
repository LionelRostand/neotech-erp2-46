
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import TimesheetForm from './TimesheetForm';
import { toast } from 'sonner';
import { addTimeSheet } from './services/timesheetService';
import { TimeReport } from '@/types/timesheet';
import { useHrModuleData } from '@/hooks/useHrModuleData';

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
  const { employees } = useHrModuleData();
  
  const handleSubmit = async (data: any) => {
    try {
      // Trouver l'employé complet à partir de l'ID
      const employee = employees.find(emp => emp.id === data.employeeId);
      
      // Préparer les données pour la création de la feuille de temps
      const timeReportData: Omit<TimeReport, 'id'> = {
        title: `Semaine du ${new Date(data.weekStartDate).toLocaleDateString()} - ${employee?.firstName} ${employee?.lastName}`,
        employeeId: data.employeeId,
        employeeName: `${employee?.firstName || ''} ${employee?.lastName || ''}`,
        employeePhoto: employee?.photoURL || employee?.photo || '',
        startDate: new Date(data.weekStartDate).toISOString(),
        endDate: new Date(data.weekEndDate || data.weekStartDate).toISOString(),
        totalHours: data.totalHours,
        status: data.status === 'pending' ? 'Soumis' : (data.status === 'active' ? 'En cours' : data.status),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lastUpdateText: new Date().toLocaleDateString(),
        comments: data.notes
      };
      
      // Ajouter la feuille de temps
      const result = await addTimeSheet(timeReportData);
      
      if (result) {
        toast.success("Feuille de temps créée avec succès");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la feuille de temps:", error);
      toast.error("Erreur lors de la création de la feuille de temps");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <TimesheetForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          employees={employees}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTimesheetDialog;
