
import { useState } from 'react';
import { toast } from 'sonner';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';

interface LeaveBalanceUpdate {
  acquired: number;
  taken: number;
  balance: number;
}

export const useEmployeeLeaveUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateEmployeeLeaveBalance = async (
    employeeId: string, 
    conges: LeaveBalanceUpdate, 
    rtt: LeaveBalanceUpdate
  ): Promise<boolean> => {
    setIsUpdating(true);
    try {
      // Mettre à jour les congés de l'employé
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, {
        conges,
        rtt,
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Soldes de congés mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des congés:', error);
      toast.error("Erreur lors de la mise à jour des soldes de congés");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateEmployeeLeaveBalance,
    isUpdating
  };
};
