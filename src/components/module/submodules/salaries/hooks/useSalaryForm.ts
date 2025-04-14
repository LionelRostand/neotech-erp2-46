
import { useState } from 'react';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { toast } from 'sonner';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export const useSalaryForm = () => {
  const { companies, isLoading, error } = useCompaniesData();
  const { companies: firebaseCompanies } = useFirebaseCompanies();
  const { employees, payslips } = useHrModuleData();
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [employeeName, setEmployeeName] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [paymentMethod, setPaymentMethod] = useState('virement');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompanyId || !employeeName || !salaryAmount || !paymentDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      console.log("Génération de la fiche de paie:", {
        companyId: selectedCompanyId,
        employeeName,
        salaryAmount,
        paymentDate,
        paymentMethod,
        notes
      });
      
      // Simulation d'une opération asynchrone
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Fiche de paie générée avec succès");
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Erreur lors de la génération de la fiche de paie");
    }
  };

  const resetForm = () => {
    setSelectedCompanyId('');
    setEmployeeName('');
    setSalaryAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('virement');
    setNotes('');
  };

  return {
    companies: firebaseCompanies.length > 0 ? firebaseCompanies : companies,
    employees, // We need to explicitly return the employees data
    isLoading,
    error,
    selectedCompanyId,
    setSelectedCompanyId,
    employeeName,
    setEmployeeName,
    salaryAmount,
    setSalaryAmount,
    paymentDate,
    setPaymentDate,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    handleSubmit,
    resetForm
  };
};
