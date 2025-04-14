
import { useState } from 'react';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { toast } from 'sonner';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { addDocument } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { v4 as uuidv4 } from 'uuid';

export const useSalaryForm = () => {
  const { companies, isLoading, error } = useCompaniesData();
  const { companies: firebaseCompanies } = useFirebaseCompanies();
  const { employees, payslips } = useHrModuleData();
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
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
      // Préparer les données de la fiche de paie
      const grossAmount = parseFloat(salaryAmount);
      const netAmount = grossAmount * 0.78; // Estimation simplifiée (après charges sociales)
      const payslipId = uuidv4();
      
      // Obtenir les données de l'entreprise
      const selectedCompany = firebaseCompanies.find(company => company.id === selectedCompanyId) || 
                              companies.find(company => company.id === selectedCompanyId);
      
      // Obtenir l'employé sélectionné
      const selectedEmployee = employees.find(emp => emp.id === employeeId);
      
      if (!selectedEmployee) {
        toast.error("Impossible de trouver les informations de l'employé");
        return;
      }
      
      // Structure conforme au code du travail français
      const payslipData = {
        id: payslipId,
        employeeId: employeeId,
        employeeName: employeeName,
        date: paymentDate,
        period: `${new Date(paymentDate).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`,
        grossSalary: grossAmount,
        netSalary: netAmount,
        totalDeductions: grossAmount - netAmount,
        grossAmount: grossAmount,
        netAmount: netAmount,
        currency: 'EUR',
        details: [
          {
            label: "Salaire brut",
            amount: grossAmount,
            type: "earning"
          },
          {
            label: "Cotisations sociales",
            amount: grossAmount - netAmount,
            type: "deduction"
          }
        ],
        status: "Généré",
        paymentMethod: paymentMethod,
        notes: notes,
        companyId: selectedCompanyId,
        companyName: selectedCompany?.name || "Entreprise",
        hoursWorked: 151.67, // Durée légale mensuelle (35h/semaine)
        employerName: selectedCompany?.name || "Entreprise",
        employerAddress: selectedCompany?.address ? 
          `${selectedCompany.address.street}, ${selectedCompany.address.postalCode} ${selectedCompany.address.city}` : "",
        employerSiret: selectedCompany?.siret || "",
        // Informations sur les congés
        conges: {
          acquired: 2.08, // 25 jours / 12 mois
          taken: 0,
          balance: selectedEmployee.conges?.balance || 0
        },
        rtt: {
          acquired: 1, // 12 jours / 12 mois
          taken: 0,
          balance: selectedEmployee.rtt?.balance || 0
        },
        createdAt: new Date().toISOString()
      };
      
      // Sauvegarde dans Firebase
      await addDocument(COLLECTIONS.HR.PAYSLIPS, payslipData);
      
      console.log("Fiche de paie générée:", payslipData);
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
    setEmployeeId('');
    setSalaryAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('virement');
    setNotes('');
  };

  return {
    companies: firebaseCompanies.length > 0 ? firebaseCompanies : companies,
    employees, // Nous avons besoin de retourner explicitement les données des employés
    isLoading,
    error,
    selectedCompanyId,
    setSelectedCompanyId,
    employeeName,
    setEmployeeName,
    employeeId,
    setEmployeeId,
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
