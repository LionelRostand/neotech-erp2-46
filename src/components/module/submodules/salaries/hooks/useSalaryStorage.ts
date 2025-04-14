
import { useState } from 'react';
import { savePaySlip, updatePaySlip, getEmployeePaySlips } from '../services/payslipService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { PaySlipData } from '../types/payslip-types';

interface UseSalaryStorageProps {
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: string;
  netSalary: number;
  deductions: any[];
  earnings: any[];
  overtimeHours?: string;
  overtimeRate?: string;
  companyName?: string;
  companyAddress?: string;
}

export const useSalaryStorage = ({
  employeeId,
  employeeName,
  period,
  grossSalary,
  netSalary,
  deductions,
  earnings,
  overtimeHours,
  overtimeRate,
  companyName,
  companyAddress
}: UseSalaryStorageProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [savedPayslipId, setSavedPayslipId] = useState<string | null>(null);
  const { isOffline } = useAuth();

  const handleSavePaySlip = async () => {
    if (isOffline) {
      toast.error("Impossible de sauvegarder en mode hors ligne");
      return;
    }

    if (!employeeId || !employeeName || !period || !grossSalary) {
      toast.error("Veuillez remplir toutes les informations obligatoires");
      return;
    }

    setIsSaving(true);

    try {
      const payslipData = {
        employeeId,
        employeeName,
        period,
        grossSalary: parseFloat(grossSalary),
        netSalary,
        deductions,
        earnings,
        taxes: calculateTaxes(parseFloat(grossSalary)),
        contributions: calculateContributions(parseFloat(grossSalary)),
        overtimeHours: overtimeHours ? parseFloat(overtimeHours) : undefined,
        overtimeRate: overtimeRate ? parseFloat(overtimeRate) : undefined,
        companyName,
        companyAddress,
      };

      const result = await savePaySlip(payslipData);
      
      if (result && result.id) {
        setSavedPayslipId(result.id);
        toast.success("Bulletin de salaire sauvegardé avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde du bulletin");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to calculate taxes (simplified example)
  const calculateTaxes = (grossAmount: number): number => {
    return grossAmount * 0.15; // 15% tax rate (example)
  };

  // Helper function to calculate contributions (simplified example)
  const calculateContributions = (grossAmount: number): number => {
    return grossAmount * 0.10; // 10% contributions rate (example)
  };

  const loadEmployeePaySlips = async (empId: string) => {
    if (isOffline) {
      toast.warning("Mode hors ligne - Impossible de charger les fiches de paie");
      return [];
    }
    
    try {
      return await getEmployeePaySlips(empId);
    } catch (error) {
      console.error("Erreur lors du chargement des fiches de paie:", error);
      toast.error("Erreur lors du chargement des fiches de paie");
      return [];
    }
  };

  return {
    isSaving,
    savedPayslipId,
    handleSavePaySlip,
    loadEmployeePaySlips
  };
};
