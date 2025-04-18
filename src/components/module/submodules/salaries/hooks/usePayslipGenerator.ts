
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Company } from '@/components/module/submodules/companies/types';
import { PaySlip, PaySlipDetail } from '@/types/payslip';
import { Employee } from '@/types/employee';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [grossSalary, setGrossSalary] = useState<string>('0');
  const [overtimeHours, setOvertimeHours] = useState<string>('0');
  const [overtimeRate, setOvertimeRate] = useState<string>('25');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);

  // Handle company selection
  const handleCompanySelect = useCallback((companyId: string, companies: Company[]) => {
    if (!companies || !companyId) return;
    
    setSelectedCompanyId(companyId);
    
    // Find the selected company
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
    }
  }, []);

  // Handle employee selection
  const handleEmployeeSelect = useCallback((employeeId: string, employees: Employee[]) => {
    if (!employees || !employeeId) return;
    
    setSelectedEmployeeId(employeeId);
    
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
    }
  }, []);

  // Calculate social security contributions as per French labor code
  const calculateFrenchSocialContributions = (monthlySalary: number) => {
    // French social security rates (simplified version)
    const healthInsurance = monthlySalary * 0.07;  // 7%
    const pensionContribution = monthlySalary * 0.11;  // 11%
    const unemploymentInsurance = monthlySalary * 0.024;  // 2.4%
    const complementaryPension = monthlySalary * 0.038;  // 3.8%
    const csg = monthlySalary * 0.098;  // 9.8% CSG/CRDS
    
    const totalContributions = healthInsurance + pensionContribution + 
                               unemploymentInsurance + complementaryPension + csg;
    
    const details: PaySlipDetail[] = [
      {
        label: "Sécurité sociale - Maladie",
        amount: healthInsurance,
        type: "deduction",
        base: formatCurrency(monthlySalary),
        rate: "7%"
      },
      {
        label: "Retraite de base",
        amount: pensionContribution,
        type: "deduction",
        base: formatCurrency(monthlySalary),
        rate: "11%"
      },
      {
        label: "Assurance chômage",
        amount: unemploymentInsurance,
        type: "deduction",
        base: formatCurrency(monthlySalary),
        rate: "2.4%"
      },
      {
        label: "Retraite complémentaire",
        amount: complementaryPension,
        type: "deduction",
        base: formatCurrency(monthlySalary),
        rate: "3.8%"
      },
      {
        label: "CSG/CRDS",
        amount: csg,
        type: "deduction",
        base: formatCurrency(monthlySalary),
        rate: "9.8%"
      }
    ];
    
    return { totalContributions, details };
  };

  // Generate payslip according to French labor law
  const generatePayslip = useCallback(() => {
    if (!selectedEmployeeId || !period || !selectedCompany) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return null;
    }

    try {
      // Convert strings to numbers
      const annualGrossSalary = Number(grossSalary) || 0;
      const overtimeHoursNum = Number(overtimeHours) || 0;
      const overtimeRateNum = Number(overtimeRate) || 25;
      
      // Standard hours per month in France (35h/week * 52 weeks / 12 months)
      const standardMonthlyHours = 151.67;
      
      // Calculate monthly gross salary
      const monthlyGrossSalary = annualGrossSalary / 12;
      
      // Calculate hourly rate
      const hourlyRate = monthlyGrossSalary / standardMonthlyHours;
      
      // Calculate overtime pay according to French labor code
      let overtimePay = 0;
      if (overtimeHoursNum > 0) {
        // In France: first 8 hours at 25%, above that at 50%
        const firstEightHours = Math.min(overtimeHoursNum, 8);
        const remainingHours = Math.max(0, overtimeHoursNum - 8);
        
        overtimePay = (firstEightHours * hourlyRate * 1.25) + 
                      (remainingHours * hourlyRate * 1.5);
      }
      
      // Calculate total gross with overtime
      const totalGrossSalary = monthlyGrossSalary + overtimePay;
      
      // Calculate French social security contributions
      const { totalContributions, details: deductionDetails } = 
        calculateFrenchSocialContributions(totalGrossSalary);
      
      // Calculate net salary
      const netSalary = totalGrossSalary - totalContributions;
      
      // Create earnings details
      const earningDetails: PaySlipDetail[] = [
        {
          label: "Salaire mensuel de base",
          amount: monthlyGrossSalary,
          type: "earning",
          base: `${standardMonthlyHours} heures`,
          rate: formatCurrency(hourlyRate) + "/h"
        }
      ];
      
      // Add overtime if applicable
      if (overtimeHoursNum > 0) {
        const firstEightHours = Math.min(overtimeHoursNum, 8);
        const remainingHours = Math.max(0, overtimeHoursNum - 8);
        
        if (firstEightHours > 0) {
          earningDetails.push({
            label: "Heures supplémentaires (25%)",
            amount: firstEightHours * hourlyRate * 1.25,
            type: "earning",
            base: `${firstEightHours} heures`,
            rate: "25%"
          });
        }
        
        if (remainingHours > 0) {
          earningDetails.push({
            label: "Heures supplémentaires (50%)",
            amount: remainingHours * hourlyRate * 1.5,
            type: "earning",
            base: `${remainingHours} heures`,
            rate: "50%"
          });
        }
      }
      
      // Create complete payslip
      const payslip: PaySlip = {
        id: uuidv4(),
        employeeId: selectedEmployeeId,
        employeeName: employeeName,
        period: period,
        details: [...earningDetails, ...deductionDetails],
        grossSalary: totalGrossSalary,
        netSalary: netSalary,
        totalDeductions: totalContributions,
        date: new Date().toISOString(),
        status: "Généré",
        department: "",
        hoursWorked: standardMonthlyHours + (overtimeHoursNum || 0),
        employerName: selectedCompany.name,
        employerAddress: selectedCompany.address ? 
          `${selectedCompany.address.street}, ${selectedCompany.address.postalCode} ${selectedCompany.address.city}` : 
          "",
        employerSiret: selectedCompany.siret || "",
        // French specific fields
        conges: {
          acquired: 2.5, // 2.5 days per month in France
          taken: 0,
          balance: 2.5
        },
        rtt: {
          acquired: 1,  // Typical RTT value
          taken: 0,
          balance: 1
        },
        annualCumulative: {
          grossSalary: totalGrossSalary,
          netSalary: netSalary,
          taxableIncome: netSalary * 0.9 // Approximation for "net imposable"
        }
      };
      
      // Store the current payslip
      setCurrentPayslip(payslip);
      console.log("Generated payslip:", payslip);
      
      return payslip;
    } catch (error) {
      console.error('Error generating payslip:', error);
      toast.error("Erreur lors de la génération de la fiche de paie");
      return null;
    }
  }, [
    selectedEmployeeId,
    employeeName,
    period,
    grossSalary,
    overtimeHours,
    overtimeRate,
    selectedCompany
  ]);

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
    selectedCompanyId,
    handleCompanySelect,
    handleEmployeeSelect,
    showPreview,
    setShowPreview,
    generatePayslip,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedCompany,
    currentPayslip
  };
};
