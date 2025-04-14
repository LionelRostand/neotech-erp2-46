
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
import { generatePayslipPDF } from '../utils/payslipPdfUtils';
import { addEmployeeDocument } from '../../employees/services/documentService';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';

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
  
  // Récupérer les soldes de congés pour l'employé sélectionné
  const { leaveBalances } = useLeaveBalances(selectedEmployeeId);

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

      console.log('Employé sélectionné pour la fiche de paie:', selectedEmployee);
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

    // Calculer le montant des heures supplémentaires
    const overtimeAmount = parseFloat(overtimeHours) * (baseSalary / 151.67) * (1 + parseFloat(overtimeRate) / 100);

    // Récupérer les soldes de congés depuis les balances ou créer des valeurs par défaut
    const cpBalance = leaveBalances.find(b => b.employeeId === selectedEmployeeId && b.type === 'Congés payés');
    const rttBalance = leaveBalances.find(b => b.employeeId === selectedEmployeeId && b.type === 'RTT');
    
    // Calcul français typique: 2.5 jours de CP par mois travaillé et environ 1 RTT par mois
    const conges = {
      acquired: cpBalance?.total || 2.5,
      taken: cpBalance?.used || 0,
      balance: cpBalance?.remaining || 2.5
    };

    const rtt = {
      acquired: rttBalance?.total || 1,
      taken: rttBalance?.used || 0,
      balance: rttBalance?.remaining || 1
    };

    // Calculs standards français
    const grossSalary = baseSalary + overtimeAmount;
    const csgCrds = grossSalary * 0.098; // 9.8% pour CSG-CRDS
    const securiteSociale = grossSalary * 0.07; // ~7% pour SS
    const retraite = grossSalary * 0.12; // ~12% pour retraite
    const totalDeductions = csgCrds + securiteSociale + retraite;
    const netBeforeTax = grossSalary - totalDeductions;
    const taxDeduction = grossSalary * 0.036; // Prélèvement à la source ~3.6%
    const netSalary = netBeforeTax - taxDeduction;

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
          base: "151,67",
          amount: baseSalary,
          type: "earning"
        },
        {
          label: `Heures supplémentaires (${overtimeHours}h à ${overtimeRate}%)`,
          base: overtimeHours,
          rate: overtimeRate + "%",
          amount: overtimeAmount,
          type: "earning"
        },
        {
          label: "CSG-CRDS",
          base: (grossSalary * 0.9825).toFixed(2),
          rate: "9,80%",
          amount: csgCrds,
          type: "deduction"
        },
        {
          label: "Sécurité sociale",
          base: grossSalary.toFixed(2),
          rate: "7,00%",
          amount: securiteSociale,
          type: "deduction"
        },
        {
          label: "Retraite",
          base: grossSalary.toFixed(2),
          rate: "12,00%",
          amount: retraite,
          type: "deduction"
        },
        {
          label: "Prélèvement à la source",
          base: netBeforeTax.toFixed(2),
          rate: "3,60%",
          amount: taxDeduction,
          type: "deduction"
        }
      ],
      grossSalary,
      totalDeductions,
      netSalary,
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
      conges,
      rtt,
      annualCumulative: {
        // Par défaut, on considère 2 mois d'ancienneté pour le cumul
        grossSalary: grossSalary * 2,
        netSalary: netSalary * 2,
        taxableIncome: taxDeduction * 2
      }
    };

    try {
      const payslipRef = await addDocument(COLLECTIONS.HR.PAYSLIPS, newPaySlip);
      const payslipId = payslipRef.id;
      
      // Generate PDF
      const doc = generatePayslipPDF(newPaySlip);
      const pdfBase64 = doc.output('datauristring');

      // Add document to employee's profile
      const documentData = {
        id: `payslip_${payslipId}`,
        name: `Bulletin de paie - ${month} ${year}`,
        type: 'Fiche de paie',
        date: new Date().toISOString(),
        fileType: 'application/pdf',
        fileData: pdfBase64,
        employeeId: selectedEmployeeId
      };

      await addEmployeeDocument(selectedEmployeeId, documentData);
      
      const success = await addPayslipToEmployee(selectedEmployeeId, payslipId);

      if (success) {
        toast.success('Bulletin de paie créé et associé avec succès');
        // Save PDF
        doc.save(`bulletin_de_paie_${selectedEmployee.lastName.toLowerCase()}_${month.toLowerCase()}_${year}.pdf`);
      } else {
        toast.error('Bulletin de paie créé, mais erreur lors de l\'association à l\'employé');
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
