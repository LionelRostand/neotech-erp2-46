
import { useState } from 'react';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { toast } from 'sonner';

export const useSalaryForm = () => {
  const { companies, isLoading, error } = useCompaniesData();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [employeeName, setEmployeeName] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompanyId || !employeeName || !salaryAmount || !paymentDate) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      // TODO: Implémenter la sauvegarde de la fiche de paie
      toast.success("Fiche de paie enregistrée avec succès");
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de la fiche de paie");
    }
  };

  const resetForm = () => {
    setSelectedCompanyId('');
    setEmployeeName('');
    setSalaryAmount('');
    setPaymentDate('');
    setPaymentMethod('');
    setNotes('');
  };

  return {
    companies,
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
