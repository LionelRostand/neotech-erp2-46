
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { formatDate } from "@/lib/formatters";
import { Company } from '@/components/module/submodules/companies/types';

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

// Function to get month and year from date
const parseMonthAndYear = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    return { month, year };
  } catch (error) {
    console.error('Error parsing date:', error);
    return { month: 'Inconnu', year: new Date().getFullYear() };
  }
};

/**
 * Hook pour accéder aux données des fiches de paie directement depuis Firebase
 */
export const useSalarySlipsData = () => {
  const { payslips, employees, companies, isLoading, error } = useHrModuleData();
  
  // Enrichir les fiches de paie avec les noms des employés
  const formattedSalarySlips = useMemo(() => {
    if (!payslips || payslips.length === 0) return [];
    
    return payslips.map(payslip => {
      // Trouver l'employé associé à cette fiche de paie
      const employee = employees?.find(emp => emp.id === payslip.employeeId);
      
      // Extraire le mois et l'année de la date
      const { month, year } = parseMonthAndYear(payslip.date);
      
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
    error,
    employees,
    companies
  };
};
