import { useState, useEffect } from 'react';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { PaySlip } from '@/types/payslip';
import { addPayslipToEmployee } from '../services/employeeSalaryService';
import { Company } from '@/components/module/submodules/companies/types';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

export const useSalaryForm = () => {
  const { employees } = useHrModuleData();
  const { companies, isLoading: isLoadingCompanies } = useFirebaseCompanies();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState<string>('Virement');
  const [notes, setNotes] = useState<string>('');
  const [overtimeHours, setOvertimeHours] = useState<string>('0');
  const [overtimeRate, setOvertimeRate] = useState<string>('25');

  const { salary: contractSalary } = useEmployeeContract(selectedEmployeeId);

  useEffect(() => {
    if (selectedCompanyId) {
      // Reset employee selection when company changes
      setSelectedEmployeeId('');
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedEmployeeId && contractSalary) {
      setBaseSalary(contractSalary);
      console.log(`Salaire du contrat récupéré: ${contractSalary}€`);
    }
  }, [selectedEmployeeId, contractSalary]);

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    const selectedEmployee = employees.find(emp => emp.id === employeeId);

    if (selectedEmployee) {
      // Set the company if not already selected
      if (!selectedCompanyId && selectedEmployee.company) {
        const companyId = typeof selectedEmployee.company === 'string' 
          ? selectedEmployee.company 
          : (selectedEmployee.company as Company).id;
        
        setSelectedCompanyId(companyId);
      }

      // Ensure conges has default values if undefined
      const conges = selectedEmployee.conges || {
        acquired: 0,
        taken: 0,
        balance: 0
      };

      // Ensure rtt has default values if undefined
      const rtt = selectedEmployee.rtt || {
        acquired: 0,
        taken: 0,
        balance: 0
      };

      console.log('Données de congés:', conges);
      console.log('Données RTT:', rtt);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployeeId || !month || !year || !selectedCompanyId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    const company = companies.find(c => c.id === selectedCompanyId);

    if (!selectedEmployee || !company) {
      toast.error('Employé ou entreprise non trouvé');
      return;
    }

    const employeeName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
    // const company = companies.find(c => c.id === selectedEmployee.company);

    // Calculer le montant des heures supplémentaires
    const overtimeAmount = parseFloat(overtimeHours) * (baseSalary / 151.67) * (1 + parseFloat(overtimeRate) / 100);

    // Ensure conges and rtt have default values if undefined
    const conges = selectedEmployee.conges || {
      acquired: 0,
      taken: 0,
      balance: 0
    };

    const rtt = selectedEmployee.rtt || {
      acquired: 0,
      taken: 0,
      balance: 0
    };

    const newPaySlip: PaySlip = {
      id: '',
      employee: {
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        employeeId: selectedEmployeeId,
        role: selectedEmployee.role || 'Employé',
        socialSecurityNumber: selectedEmployee.socialSecurityNumber || '',
        startDate: selectedEmployee.startDate || selectedEmployee.hireDate || ''
      },
      period: `${month} ${year}`,
      details: [
        {
          label: "Salaire de base",
          amount: baseSalary,
          type: "earning"
        },
        {
          label: `Heures supplémentaires (${overtimeHours}h à ${overtimeRate}%)`,
          amount: overtimeAmount,
          type: "earning"
        }
      ],
      grossSalary: baseSalary + overtimeAmount,
      totalDeductions: 0,
      netSalary: (baseSalary + overtimeAmount) * 0.78,
      hoursWorked: 151.67 + parseFloat(overtimeHours),
      paymentDate: new Date().toISOString(),
      employerName: company?.name || 'NEOTECH',
      employerAddress: company?.address?.street || 'Paris, France',
      employerSiret: company?.siret || '12345678901234',
      month,
      year,
      employeeId: selectedEmployeeId,
      employeeName,
      status: 'Généré',
      date: new Date().toISOString(),
      paymentMethod,
      notes,
      conges: conges,
      rtt: rtt
    };

    try {
      const payslipRef = await addDocument(COLLECTIONS.HR.PAYSLIPS, newPaySlip);
      const payslipId = payslipRef.id;
      
      const success = await addPayslipToEmployee(selectedEmployeeId, payslipId);

      if (success) {
        toast.success('Fiche de paie créée et associée avec succès');
      } else {
        toast.error('Fiche de paie créée, mais erreur lors de l\'association à l\'employé');
      }
    } catch (error) {
      console.error("Erreur lors de la création de la fiche de paie:", error);
      toast.error("Erreur lors de la création de la fiche de paie");
    }
  };

  return {
    selectedEmployeeId,
    selectedCompanyId,
    baseSalary,
    month,
    year,
    paymentMethod,
    notes,
    overtimeHours,
    overtimeRate,
    handleEmployeeSelect,
    setBaseSalary,
    setMonth,
    setYear,
    setPaymentMethod,
    setNotes,
    setOvertimeHours,
    setOvertimeRate,
    setSelectedCompanyId,
    handleSubmit,
    companies,
    isLoadingCompanies
  };
};
