
import { useState } from 'react';
import { useLeaveBalances } from './useLeaveBalances';
import { useFirebaseLeaves } from './useFirebaseLeaves';
import { useLeaveData } from './useLeaveData';
import { useEmployeeLeaveUpdate } from './useEmployeeLeaveUpdate';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';

export const useEmployeeLeavesDeduction = (employeeId: string, employee: Employee) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { leaves } = useLeaveData();
  const { leaveBalances, refetch: refetchBalances } = useLeaveBalances(employeeId);
  const { deductLeaveDays, isUpdating } = useEmployeeLeaveUpdate();
  
  // Obtenir les demandes de congés approuvées pour cet employé
  const approvedLeaves = leaves.filter(leave => 
    leave.employeeId === employeeId && 
    (leave.status === 'Approuvé' || leave.status === 'approved')
  );

  // Fonction pour déduire tous les congés approuvés non encore comptabilisés
  const deductApprovedLeaves = async () => {
    if (!employee || isProcessing || isUpdating) return;
    
    setIsProcessing(true);
    try {
      // Compter les jours par type de congés
      const pendingDeductions = approvedLeaves.reduce((acc, leave) => {
        const type = leave.type.toLowerCase().includes('rtt') ? 'rtt' : 'conges';
        if (!acc[type]) acc[type] = 0;
        acc[type] += leave.days;
        return acc;
      }, { conges: 0, rtt: 0 } as Record<'conges' | 'rtt', number>);
      
      // Si aucun jour à déduire, on s'arrête là
      if (pendingDeductions.conges === 0 && pendingDeductions.rtt === 0) {
        toast.info('Aucun nouveau congé à déduire du solde');
        setIsProcessing(false);
        return;
      }
      
      // Déduire les congés payés si nécessaire
      if (pendingDeductions.conges > 0) {
        await deductLeaveDays(employeeId, 'conges', pendingDeductions.conges, employee);
      }
      
      // Déduire les RTT si nécessaire
      if (pendingDeductions.rtt > 0) {
        await deductLeaveDays(employeeId, 'rtt', pendingDeductions.rtt, employee);
      }
      
      // Rafraîchir les soldes après déduction
      refetchBalances();
      
    } catch (error) {
      console.error('Erreur lors de la déduction des congés:', error);
      toast.error('Une erreur est survenue lors de la déduction des congés');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Calculer le nombre total de congés à déduire par type
  const pendingDeductions = approvedLeaves.reduce((acc, leave) => {
    const type = leave.type.toLowerCase().includes('rtt') ? 'rtt' : 'conges';
    if (!acc[type]) acc[type] = 0;
    acc[type] += leave.days;
    return acc;
  }, { conges: 0, rtt: 0 } as Record<'conges' | 'rtt', number>);

  return {
    approvedLeaves,
    pendingDeductions,
    deductApprovedLeaves,
    isProcessing: isProcessing || isUpdating
  };
};
