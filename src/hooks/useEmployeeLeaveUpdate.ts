
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

  // Fonction pour mettre à jour les soldes de congés
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

  // Fonction pour déduire des jours de congés du solde
  const deductLeaveDays = async (
    employeeId: string,
    leaveType: 'conges' | 'rtt',
    daysToDeduct: number,
    currentEmployee: Employee
  ): Promise<boolean> => {
    setIsUpdating(true);
    try {
      // Récupérer les valeurs actuelles
      const currentBalance = leaveType === 'conges' 
        ? currentEmployee.conges || { acquired: 25, taken: 0, balance: 25 }
        : currentEmployee.rtt || { acquired: 10, taken: 0, balance: 10 };
      
      // Calculer les nouvelles valeurs
      const newTaken = currentBalance.taken + daysToDeduct;
      const newBalance = Math.max(0, currentBalance.acquired - newTaken);
      
      const updatedBalance = {
        ...currentBalance,
        taken: newTaken,
        balance: newBalance
      };
      
      // Préparer l'objet de mise à jour
      const updateData = {
        [leaveType]: updatedBalance,
        updatedAt: new Date().toISOString()
      };
      
      // Mettre à jour le document dans Firestore
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, updateData);
      
      toast.success(`${daysToDeduct} jour(s) de ${leaveType === 'conges' ? 'congés' : 'RTT'} déduit(s) avec succès`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la déduction des jours de congés:', error);
      toast.error("Erreur lors de la déduction des jours de congés");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateEmployeeLeaveBalance,
    deductLeaveDays,
    isUpdating
  };
};
