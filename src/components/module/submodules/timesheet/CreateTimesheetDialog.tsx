
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TimesheetForm from './TimesheetForm';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { toast } from 'sonner';
import { addTimeSheet } from './services/timesheetService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      console.log('Données du formulaire:', data);
      
      // Récupérer l'employé sélectionné pour avoir son nom
      const selectedEmployee = employees.find(emp => emp.id === data.employeeId);
      
      // Formater les données pour Firestore
      const timeSheetData = {
        employeeId: data.employeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : 'Employé inconnu',
        employeePhoto: selectedEmployee?.photoURL || '',
        startDate: format(data.weekStartDate, 'yyyy-MM-dd'),
        endDate: format(data.weekEndDate, 'yyyy-MM-dd'),
        title: `Feuille de temps du ${format(data.weekStartDate, 'dd/MM/yyyy', { locale: fr })}`,
        status: data.status === 'active' ? 'En cours' : 
               data.status === 'pending' ? 'Soumis' : 
               data.status === 'validated' ? 'Validé' : 
               data.status === 'rejected' ? 'Rejeté' : 'En cours',
        totalHours: data.totalHours,
        hours: data.hours,
        notes: data.notes,
        details: Object.entries(data.hours).map(([day, hours]) => ({
          date: format(addDays(data.weekStartDate, getDayIndex(day)), 'yyyy-MM-dd'),
          hours: Number(hours)
        }))
      };
      
      // Envoyer les données à Firebase
      const result = await addTimeSheet(timeSheetData);
      
      if (result) {
        toast.success('Feuille de temps créée avec succès');
        
        // Fermer le dialogue et notifier le parent
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error('Erreur lors de la création de la feuille de temps');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de la feuille de temps');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  // Helper pour obtenir l'index du jour (0 pour lundi, 1 pour mardi, etc.)
  const getDayIndex = (day: string): number => {
    const dayMap: Record<string, number> = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6
    };
    return dayMap[day] || 0;
  };
  
  // Helper pour ajouter des jours à une date
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <TimesheetForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          employees={employees || []}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTimesheetDialog;
