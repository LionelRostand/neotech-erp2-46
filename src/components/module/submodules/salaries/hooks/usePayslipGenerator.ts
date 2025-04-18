import { useState, useCallback } from 'react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Company } from '@/components/module/submodules/companies/types';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { PaySlip, PaySlipDetail } from '@/types/payslip';

/**
 * Hook for handling payslip generation according to French labor laws
 */
export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [period, setPeriod] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [overtimeRate, setOvertimeRate] = useState('25');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { employees } = useEmployeeData();

  const resetForm = () => {
    setEmployeeName('');
    setPeriod('');
    setGrossSalary('');
    setOvertimeHours('0');
    setOvertimeRate('25');
    setSelectedEmployeeId('');
    setSelectedEmployee(null);
    setSelectedCompanyId('');
    setSelectedCompany(null);
    setShowPreview(false);
  };

  const handleEmployeeSelect = useCallback((employeeId: string, employees: Employee[]) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
      
      // If employee has a company, select it
      if (employee.company) {
        const companyId = typeof employee.company === 'string' 
          ? employee.company 
          : employee.company.id;
        
        setSelectedCompanyId(companyId);
      }
    }
  }, []);

  const handleCompanySelect = useCallback((companyId: string) => {
    setSelectedCompanyId(companyId);
    const company = findCompanyById(companyId);
    setSelectedCompany(company);
  }, []);

  const findCompanyById = (companyId: string): Company | null => {
    // Find company from employee's company if available
    if (selectedEmployee && selectedEmployee.company) {
      if (typeof selectedEmployee.company === 'object' && selectedEmployee.company.id === companyId) {
        return selectedEmployee.company;
      }
    }
    
    // Otherwise look through all employees for the company
    for (const emp of employees) {
      if (emp.company && typeof emp.company === 'object' && emp.company.id === companyId) {
        return emp.company;
      }
    }
    
    return null;
  };

  const generatePayslip = (): PaySlip => {
    if (!selectedEmployee) {
      toast.error("Veuillez sélectionner un employé");
      throw new Error("No employee selected");
    }

    if (!period) {
      toast.error("Veuillez sélectionner une période");
      throw new Error("No period selected");
    }

    const grossSalaryValue = Number(grossSalary) || 0;
    if (grossSalaryValue <= 0) {
      toast.error("Le salaire brut doit être supérieur à 0");
      throw new Error("Invalid gross salary");
    }

    // French payslip calculation according to labor laws
    const monthlySalary = grossSalaryValue / 12;
    const hoursPerMonth = 151.67; // 35 hours per week * 52 weeks / 12 months
    const hourlyRate = monthlySalary / hoursPerMonth;
    
    const overtimeHoursValue = Number(overtimeHours) || 0;
    const overtimeRateValue = Number(overtimeRate) || 25;
    
    // Calculate overtime pay according to French law
    // 25% for first 8 hours, 50% for hours beyond that
    let overtimePay = 0;
    if (overtimeHoursValue > 0) {
      const first8Hours = Math.min(overtimeHoursValue, 8);
      const beyondHours = Math.max(0, overtimeHoursValue - 8);
      
      // Use custom rate if provided, otherwise use French defaults
      const firstHoursRate = overtimeRateValue / 100;
      const beyondHoursRate = overtimeRateValue > 25 ? overtimeRateValue / 100 : 0.5;
      
      overtimePay = (first8Hours * hourlyRate * (1 + firstHoursRate)) + 
                   (beyondHours * hourlyRate * (1 + beyondHoursRate));
    }
    
    // Calculate total gross with overtime
    const totalGross = monthlySalary + overtimePay;
    
    // Calculate French social security contributions
    // Source: https://www.urssaf.fr/portail/home/taux-et-baremes.html
    const securityContributions = totalGross * 0.22; // ~22% employee contribution
    const pensionContribution = totalGross * 0.11;   // ~11% for pension
    const unemploymentInsurance = totalGross * 0.024; // 2.4% for unemployment
    const healthInsurance = totalGross * 0.075;      // 7.5% for health insurance
    
    // Calculate CSG/CRDS (social taxes)
    const csgCrds = totalGross * 0.098; // 9.8% for CSG/CRDS
    
    // Total deductions
    const totalDeductions = securityContributions + pensionContribution + 
                           unemploymentInsurance + healthInsurance + csgCrds;
    
    // Net salary
    const netSalary = totalGross - totalDeductions;
    
    // Generate payslip details according to French format
    const details: PaySlipDetail[] = [
      // Earnings
      { 
        label: "Salaire de base",
        amount: monthlySalary,
        type: "earning",
        base: `${hoursPerMonth.toFixed(2)} h`,
        rate: `${hourlyRate.toFixed(2)} €/h`
      },
      
      // Add overtime if any
      ...(overtimeHoursValue > 0 ? [
        {
          label: "Heures supplémentaires",
          amount: overtimePay,
          type: "earning",
          base: `${overtimeHoursValue} h`,
          rate: `+${overtimeRateValue}%`
        }
      ] : []),
      
      // French social security contributions
      {
        label: "Sécurité sociale",
        amount: securityContributions,
        type: "deduction",
        base: `${totalGross.toFixed(2)} €`,
        rate: "22.00%"
      },
      {
        label: "Cotisation retraite",
        amount: pensionContribution,
        type: "deduction",
        base: `${totalGross.toFixed(2)} €`,
        rate: "11.00%"
      },
      {
        label: "Assurance chômage",
        amount: unemploymentInsurance,
        type: "deduction",
        base: `${totalGross.toFixed(2)} €`,
        rate: "2.40%"
      },
      {
        label: "Assurance maladie",
        amount: healthInsurance,
        type: "deduction",
        base: `${totalGross.toFixed(2)} €`,
        rate: "7.50%"
      },
      {
        label: "CSG/CRDS",
        amount: csgCrds,
        type: "deduction",
        base: `${totalGross.toFixed(2)} €`,
        rate: "9.80%"
      }
    ];

    // Create date string for the payslip
    const [month, year] = period.split(' ');
    const monthNumber = getMonthNumber(month);
    const dateStr = `${year}-${monthNumber.toString().padStart(2, '0')}-15`;
    
    // Create employee object for the payslip
    const payslipEmployee = {
      firstName: selectedEmployee.firstName,
      lastName: selectedEmployee.lastName,
      employeeId: selectedEmployee.id,
      role: selectedEmployee.position || selectedEmployee.role || 'Employé',
      socialSecurityNumber: selectedEmployee.socialSecurityNumber || '',
      startDate: selectedEmployee.startDate || selectedEmployee.hireDate || ''
    };
    
    // Create the payslip object (compatible with French format)
    const payslip: PaySlip = {
      id: '', // Will be assigned by Firestore
      employee: payslipEmployee,
      employeeId: selectedEmployee.id,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      period,
      details,
      grossSalary: totalGross,
      totalDeductions,
      netSalary,
      hoursWorked: hoursPerMonth + overtimeHoursValue,
      paymentDate: new Date().toISOString(),
      date: new Date(dateStr).toISOString(),
      status: "Généré",
      
      // French legal requirements
      employerName: selectedCompany?.name || "Entreprise",
      employerAddress: selectedCompany?.address ? 
        `${selectedCompany.address.street}, ${selectedCompany.address.postalCode} ${selectedCompany.address.city}` : 
        "Adresse non spécifiée",
      employerSiret: selectedCompany?.siret || "",
      
      // Leave balances (required on French payslips)
      conges: {
        acquired: 2.5, // Standard 2.5 days per month in France
        taken: 0,
        balance: 2.5
      },
      rtt: {
        acquired: 1, // RTT (Reduction du Temps de Travail)
        taken: 0,
        balance: 1
      }
    };
    
    return payslip;
  };

  const getMonthNumber = (monthName: string): number => {
    const months = {
      'janvier': 1, 'février': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6,
      'juillet': 7, 'août': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12
    };
    return months[monthName as keyof typeof months] || 1;
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
    resetForm,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedEmployee,
    selectedCompanyId,
    selectedCompany,
    handleEmployeeSelect,
    handleCompanySelect
  };
};

export default usePayslipGenerator;
