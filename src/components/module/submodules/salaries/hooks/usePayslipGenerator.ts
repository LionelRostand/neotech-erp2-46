
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Company } from '@/components/module/submodules/companies/types';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { PaySlipDetail, PaySlip } from '@/types/payslip';

export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [period, setPeriod] = useState('avril 2025');
  const [grossSalary, setGrossSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [overtimeRate, setOvertimeRate] = useState('25');
  const [showPreview, setShowPreview] = useState(false);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const { companies } = useFirebaseCompanies();

  // Handle company selection
  const handleCompanySelect = useCallback((companyId: string, companiesList: Company[]) => {
    setSelectedCompanyId(companyId);
    const company = companiesList.find(c => c.id === companyId) || null;
    setSelectedCompany(company);
  }, []);

  // Handle employee selection
  const handleEmployeeSelect = useCallback((employeeId: string, employees: any[]) => {
    setSelectedEmployeeId(employeeId);
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
    }
  }, []);

  // Fonction pour calculer les cotisations sociales selon la législation française
  const calculateSocialContributions = (monthlySalary: number): PaySlipDetail[] => {
    // Taux de cotisations standards en France (simplifiés)
    const secuSocialeTaux = 0.073; // 7.3%
    const retraiteTaux = 0.0315; // 3.15%
    const chomageTaux = 0.024; // 2.4%
    const complSanteTaux = 0.01; // 1%
    const prevoyanceTaux = 0.015; // 1.5%
    
    // Calcul des montants
    const secuSociale = Math.round(monthlySalary * secuSocialeTaux * 100) / 100;
    const retraite = Math.round(monthlySalary * retraiteTaux * 100) / 100;
    const chomage = Math.round(monthlySalary * chomageTaux * 100) / 100;
    const complSante = Math.round(monthlySalary * complSanteTaux * 100) / 100;
    const prevoyance = Math.round(monthlySalary * prevoyanceTaux * 100) / 100;
    
    // Retourne un tableau de cotisations conformes au type PaySlipDetail
    const contributions: PaySlipDetail[] = [
      {
        label: "Sécurité sociale",
        base: `${monthlySalary.toFixed(2)} €`,
        rate: `${(secuSocialeTaux * 100).toFixed(2)}%`,
        amount: secuSociale,
        type: "deduction" as const
      },
      {
        label: "Retraite complémentaire",
        base: `${monthlySalary.toFixed(2)} €`,
        rate: `${(retraiteTaux * 100).toFixed(2)}%`,
        amount: retraite,
        type: "deduction" as const
      },
      {
        label: "Assurance chômage",
        base: `${monthlySalary.toFixed(2)} €`,
        rate: `${(chomageTaux * 100).toFixed(2)}%`,
        amount: chomage,
        type: "deduction" as const
      },
      {
        label: "Complémentaire santé",
        base: `${monthlySalary.toFixed(2)} €`,
        rate: `${(complSanteTaux * 100).toFixed(2)}%`,
        amount: complSante,
        type: "deduction" as const
      },
      {
        label: "Prévoyance",
        base: `${monthlySalary.toFixed(2)} €`,
        rate: `${(prevoyanceTaux * 100).toFixed(2)}%`,
        amount: prevoyance,
        type: "deduction" as const
      }
    ];
    
    return contributions;
  };

  // Generate payslip function
  const generatePayslip = useCallback(() => {
    // Convert string inputs to numbers
    const annualGrossSalary = parseFloat(grossSalary) || 0;
    const monthlyGrossSalary = annualGrossSalary / 12;
    const overtimeHoursNum = parseFloat(overtimeHours) || 0;
    const overtimeRateNum = parseFloat(overtimeRate) || 25;
    
    // Calculate overtime pay (French regulations)
    const hourlyRate = monthlyGrossSalary / 151.67; // Standard monthly hours in France
    const overtimePay = overtimeHoursNum * hourlyRate * (1 + overtimeRateNum / 100);
    
    // Create earnings details
    const earnings: PaySlipDetail[] = [
      {
        label: "Salaire de base",
        base: "151.67 h",
        rate: `${hourlyRate.toFixed(2)} €/h`,
        amount: monthlyGrossSalary,
        type: "earning" as const
      }
    ];
    
    // Add overtime if applicable
    if (overtimeHoursNum > 0) {
      earnings.push({
        label: "Heures supplémentaires",
        base: `${overtimeHoursNum} h`,
        rate: `${overtimeRateNum}%`,
        amount: overtimePay,
        type: "earning" as const
      });
    }
    
    // Total gross including overtime
    const totalGrossSalary = monthlyGrossSalary + overtimePay;
    
    // Calculate social contributions
    const deductions = calculateSocialContributions(totalGrossSalary);
    
    // Calculate total deductions
    const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate net salary
    const netSalary = totalGrossSalary - totalDeductions;
    
    // Combine all details
    const allDetails: PaySlipDetail[] = [...earnings, ...deductions];
    
    // Get company info
    const employerName = selectedCompany?.name || "Entreprise non spécifiée";
    const employerAddress = selectedCompany?.address 
      ? `${selectedCompany.address.street}, ${selectedCompany.address.postalCode} ${selectedCompany.address.city}`
      : "Adresse non spécifiée";
    const employerSiret = selectedCompany?.siret || "00000000000000";
    
    // Create the payslip object
    const payslip: PaySlip = {
      id: uuidv4(),
      employee: {
        firstName: employeeName.split(' ')[0] || '',
        lastName: employeeName.split(' ').slice(1).join(' ') || '',
        employeeId: selectedEmployeeId,
        role: "Employé",
        socialSecurityNumber: "1 99 99 99 999 999 99",
        startDate: new Date().toISOString()
      },
      period: period,
      details: allDetails,
      grossSalary: totalGrossSalary,
      totalDeductions: totalDeductions,
      netSalary: netSalary,
      hoursWorked: 151.67 + overtimeHoursNum,
      paymentDate: new Date().toISOString(),
      employerName: employerName,
      employerAddress: employerAddress,
      employerSiret: employerSiret,
      conges: {
        acquired: 2.08, // 2.08 jours acquis par mois (25 jours / 12 mois)
        taken: 0,
        balance: 2.08
      },
      rtt: {
        acquired: 1,
        taken: 0,
        balance: 1
      },
      annualCumulative: {
        grossSalary: totalGrossSalary,
        netSalary: netSalary,
        taxableIncome: netSalary * 0.9 // Approximation du revenu imposable
      }
    };
    
    setCurrentPayslip(payslip);
    return payslip;
  }, [employeeName, period, grossSalary, overtimeHours, overtimeRate, selectedCompany, selectedEmployeeId]);

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
    showPreview,
    setShowPreview,
    currentPayslip,
    generatePayslip,
    selectedCompanyId,
    handleCompanySelect,
    handleEmployeeSelect,
    selectedEmployeeId,
    setSelectedEmployeeId
  };
};
