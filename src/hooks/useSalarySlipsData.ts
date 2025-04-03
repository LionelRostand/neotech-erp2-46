
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface SalarySlip {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeePhoto?: string;
  month: string;
  year: number;
  date: string;
  netAmount: number;
  grossAmount: number;
  currency: string;
  status: 'Généré' | 'Envoyé' | 'Validé';
  pdfUrl?: string;
  department?: string;
}

/**
 * Hook pour accéder aux données des fiches de paie directement depuis Firebase
 */
export const useSalarySlipsData = () => {
  const { payslips, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les fiches de paie avec les noms des employés
  const formattedSalarySlips = useMemo(() => {
    if (!payslips || payslips.length === 0) return [];
    
    return payslips.map(payslip => {
      // Trouver l'employé associé à cette fiche de paie
      const employee = employees?.find(emp => emp.id === payslip.employeeId);
      
      // Extraire le mois et l'année de la date
      const date = new Date(payslip.date);
      const month = date.toLocaleDateString('fr-FR', { month: 'long' });
      const year = date.getFullYear();
      
      return {
        id: payslip.id,
        employeeId: payslip.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu',
        employeePhoto: employee?.photoURL || employee?.photo || '',
        month,
        year,
        date: formatDate(payslip.date),
        netAmount: payslip.netAmount || 0,
        grossAmount: payslip.grossAmount || 0,
        currency: payslip.currency || 'EUR',
        status: payslip.status || 'Généré',
        pdfUrl: payslip.pdfUrl,
        department: employee?.department || 'Non spécifié',
      } as SalarySlip;
    });
  }, [payslips, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur les fiches de paie
  const salaryStats = useMemo(() => {
    const generated = formattedSalarySlips.filter(slip => slip.status === 'Généré').length;
    const sent = formattedSalarySlips.filter(slip => slip.status === 'Envoyé').length;
    const validated = formattedSalarySlips.filter(slip => slip.status === 'Validé').length;
    const total = formattedSalarySlips.length;
    
    return { generated, sent, validated, total };
  }, [formattedSalarySlips]);
  
  return {
    salarySlips: formattedSalarySlips,
    stats: salaryStats,
    isLoading,
    error
  };
};
