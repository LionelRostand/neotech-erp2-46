
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { generateAndSavePayslip } from '../services/payslipGeneratorService';
import { Company } from '@/components/module/submodules/companies/types';
import { PaySlip } from '@/types/payslip';
import { toast } from 'sonner';

export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [period, setPeriod] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [overtimeRate, setOvertimeRate] = useState('25');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { employees } = useEmployeeData();

  const handleCompanySelect = (companyId: string) => {
    if (!companyId) return;
    
    setSelectedCompanyId(companyId);
    const employee = employees.find(emp => emp.company === companyId);
    let company = null;
    
    if (employee && employee.company) {
      if (typeof employee.company === 'object') {
        company = employee.company;
      } else {
        // Try to find company information from other employees
        const employeeWithCompanyObject = employees.find(emp => 
          typeof emp.company === 'object' && emp.company.id === companyId
        );
        
        if (employeeWithCompanyObject && typeof employeeWithCompanyObject.company === 'object') {
          company = employeeWithCompanyObject.company;
        }
      }
    }
    
    setSelectedCompany(company);
  };

  const handleEmployeeSelect = (employeeId: string, employeesList: Employee[]) => {
    if (!employeeId) return;
    
    const employee = employeesList.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployeeId(employeeId);
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
      
      if (employee.company) {
        if (typeof employee.company === 'object') {
          setSelectedCompany(employee.company);
          setSelectedCompanyId(employee.company.id);
        } else {
          setSelectedCompanyId(employee.company);
          
          // Try to find company information from other employees
          const employeeWithCompanyObject = employeesList.find(emp => 
            typeof emp.company === 'object' && emp.company.id === employee.company
          );
          
          if (employeeWithCompanyObject && typeof employeeWithCompanyObject.company === 'object') {
            setSelectedCompany(employeeWithCompanyObject.company);
          }
        }
      }
    }
  };

  const validateData = (): boolean => {
    // Log values for debugging
    console.log("Validation des données:", {
      selectedEmployeeId,
      selectedCompanyId,
      period,
      grossSalary
    });

    if (!selectedEmployeeId || selectedEmployeeId === '') {
      toast.error('Veuillez sélectionner un employé');
      return false;
    }

    if (!selectedCompanyId || selectedCompanyId === '') {
      toast.error('Veuillez sélectionner une entreprise');
      return false;
    }

    if (!period || period === '') {
      toast.error('Veuillez sélectionner une période');
      return false;
    }

    if (!grossSalary || Number(grossSalary) <= 0) {
      toast.error('Le salaire brut doit être supérieur à 0');
      return false;
    }

    return true;
  };

  const generatePayslip = async () => {
    if (!validateData()) {
      return null;
    }

    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error('Employé non trouvé');
      return null;
    }

    const [month, year] = period.split(' ');

    const payslipData: PaySlip = {
      id: '',
      employeeId: selectedEmployeeId,
      employee: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        employeeId: employee.id,
        role: employee.role,
        socialSecurityNumber: employee.socialSecurityNumber,
        startDate: employee.startDate
      },
      period: period,
      month: month,
      year: parseInt(year),
      employerName: selectedCompany?.name || '',
      employerAddress: selectedCompany?.address ? 
        `${selectedCompany.address.street}, ${selectedCompany.address.postalCode} ${selectedCompany.address.city}` : '',
      employerSiret: selectedCompany?.siret || '',
      grossSalary: Number(grossSalary),
      netSalary: calculateNetSalary(Number(grossSalary)),
      totalDeductions: calculateDeductions(Number(grossSalary)),
      hoursWorked: 151.67, // Durée légale mensuelle en France
      paymentDate: new Date().toISOString(),
      details: generatePayslipDetails(Number(grossSalary), Number(overtimeHours), Number(overtimeRate)),
      status: 'Généré',
      date: new Date().toISOString()
    };

    console.log("Données pour fiche de paie:", { 
      employeeId: selectedEmployeeId, 
      companyId: selectedCompanyId,
      selectedCompany
    });

    try {
      const success = await generateAndSavePayslip(payslipData);
      if (success) {
        toast.success("Fiche de paie générée avec succès");
        return payslipData;
      } else {
        toast.error("Erreur lors de la génération de la fiche de paie");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Erreur lors de la génération de la fiche de paie");
      return null;
    }
  };

  const calculateNetSalary = (gross: number): number => {
    const deductions = calculateDeductions(gross);
    return gross - deductions;
  };

  const calculateDeductions = (gross: number): number => {
    // Taux de charges sociales simplifié pour l'exemple (23%)
    return gross * 0.23;
  };

  const generatePayslipDetails = (gross: number, overtimeHours: number, overtimeRate: number): PaySlip['details'] => {
    const baseHourlyRate = gross / 151.67; // Taux horaire de base
    const overtimeAmount = overtimeHours * baseHourlyRate * (1 + overtimeRate / 100);

    return [
      {
        label: 'Salaire de base',
        base: '151.67 h',
        amount: gross,
        type: 'earning'
      },
      {
        label: 'Heures supplémentaires',
        base: `${overtimeHours} h`,
        rate: `${overtimeRate}%`,
        amount: overtimeAmount,
        type: 'earning'
      },
      {
        label: 'Cotisations sociales',
        base: `${gross}`,
        rate: '23%',
        amount: calculateDeductions(gross),
        type: 'deduction'
      }
    ];
  };

  return {
    employeeName,
    setEmployeeName,
    period,
    setPeriod,
    grossSalary,
    setGrossSalary,
    overtimeHours,
    setOvertimeHours,
    overtimeRate,
    setOvertimeRate,
    generatePayslip,
    showPreview,
    setShowPreview,
    selectedCompanyId,
    handleCompanySelect,
    handleEmployeeSelect,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedCompany
  };
};
