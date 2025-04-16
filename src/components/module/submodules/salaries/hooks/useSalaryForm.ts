
import { useState } from 'react';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';
import { addDocument } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addPayslipToEmployee } from '../services/employeeSalaryService';

export const useSalaryForm = () => {
  // Access data from useHrModuleData hook
  const { employees, companies, isLoading } = useHrModuleData();

  // Form state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState<string>('Virement');
  const [notes, setNotes] = useState<string>('');
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [overtimeRate, setOvertimeRate] = useState<number>(1.25);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  // Handle employee selection
  const handleEmployeeSelect = (employeeId: string) => {
    console.log('Employee selected:', employeeId);
    setSelectedEmployeeId(employeeId);

    // Optional: Pre-fill salary data based on the selected employee
    if (employeeId) {
      const selectedEmployee = employees.find(emp => emp.id === employeeId);
      if (selectedEmployee && selectedEmployee.salary) {
        setBaseSalary(selectedEmployee.salary);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    console.log('Form submitted with data:', {
      selectedEmployeeId,
      baseSalary,
      month,
      year,
      paymentMethod,
      notes,
      overtimeHours,
      overtimeRate
    });
    
    // Form validation
    if (!selectedEmployeeId) {
      toast.error('Veuillez sélectionner un employé');
      return;
    }
    
    if (!baseSalary || baseSalary <= 0) {
      toast.error('Veuillez saisir un salaire brut valide');
      return;
    }
    
    if (!month) {
      toast.error('Veuillez sélectionner un mois');
      return;
    }

    try {
      // Find the selected employee
      const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
      
      if (!selectedEmployee) {
        toast.error('Employé non trouvé');
        return;
      }
      
      // Calculate net salary (simplified for demo purposes)
      const netAmount = baseSalary * 0.78;
      
      // Calculate overtime pay
      const overtimePay = overtimeHours > 0 ? overtimeHours * (baseSalary / 151.67) * overtimeRate : 0;
      
      // Prepare date string
      const date = new Date(year, getMonthNumber(month), 1).toISOString();
      
      // Prepare payslip data
      const payslipData = {
        employeeId: selectedEmployeeId,
        employee: {
          firstName: selectedEmployee.firstName,
          lastName: selectedEmployee.lastName,
          employeeId: selectedEmployeeId,
          role: selectedEmployee.position || selectedEmployee.role || 'Employé',
          socialSecurityNumber: selectedEmployee.socialSecurityNumber || '',
          startDate: selectedEmployee.hireDate || selectedEmployee.startDate || ''
        },
        netAmount,
        grossAmount: baseSalary + overtimePay,
        month,
        year,
        date,
        paymentMethod,
        notes,
        status: 'Généré',
        currency: 'EUR',
        details: [
          {
            label: 'Salaire de base',
            base: '151.67h',
            amount: baseSalary,
            type: 'earning'
          }
        ],
        createdAt: new Date().toISOString()
      };
      
      // Add overtime if any
      if (overtimeHours > 0) {
        payslipData.details.push({
          label: 'Heures supplémentaires',
          base: `${overtimeHours}h`,
          rate: `${overtimeRate}`,
          amount: overtimePay,
          type: 'earning'
        });
      }
      
      // Add payslip to Firestore
      console.log('Adding payslip to Firestore:', payslipData);
      const result = await addDocument(COLLECTIONS.HR.PAYSLIPS, payslipData);
      
      if (result && result.id) {
        // Add payslip reference to employee
        await addPayslipToEmployee(selectedEmployeeId, result.id);
        
        toast.success('Fiche de paie générée avec succès');
        
        // Reset form
        setBaseSalary(0);
        setMonth('');
        setOvertimeHours(0);
        setNotes('');
      } else {
        toast.error('Erreur lors de la génération de la fiche de paie');
      }
    } catch (error: any) {
      console.error('Error generating payslip:', error);
      toast.error(`Erreur: ${error.message || 'Impossible de générer la fiche de paie'}`);
    }
  };

  // Helper to convert month name to number
  const getMonthNumber = (monthName: string): number => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months.indexOf(monthName);
  };

  return {
    selectedEmployeeId,
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
    selectedCompanyId,
    setSelectedCompanyId,
    handleSubmit,
    isLoadingCompanies: isLoading,
    companies
  };
};

