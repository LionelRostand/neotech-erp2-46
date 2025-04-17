
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import { PaySlip } from '@/types/payslip';

export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [period, setPeriod] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [overtimeRate, setOvertimeRate] = useState('25');
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySiret, setCompanySiret] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);

  const handleEmployeeSelect = (employeeId: string, employees: Employee[]) => {
    setSelectedEmployeeId(employeeId);
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
    }
  };

  const handleCompanySelect = (companyId: string, companies: Company[]) => {
    setSelectedCompanyId(companyId);
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCompanyName(company.name);
      setCompanyAddress(
        `${company.address?.street || ''}, ${company.address?.postalCode || ''} ${company.address?.city || ''}`
      );
      setCompanySiret(company.siret || '');
    }
  };

  const generatePayslip = () => {
    // French labor code-specific contribution rates
    const employeePortion = {
      healthInsurance: 0.0075, // Assurance maladie (0.75%)
      pensionBasic: 0.069, // Retraite de base (6.9%)
      pensionComplementary: 0.038, // Retraite complémentaire (3.8%)
      unemployment: 0.024, // Assurance chômage (2.4%)
      socialSecurity: 0.0075, // CSG déductible (7.5% of 98.25% of gross)
      csgCrds: 0.029, // CSG/CRDS non déductible (2.9% of 98.25% of gross)
    };

    const employerPortion = {
      healthInsurance: 0.13, // Assurance maladie (13%)
      pensionBasic: 0.085, // Retraite de base (8.5%)
      pensionComplementary: 0.146, // Retraite complémentaire (14.6%)
      unemployment: 0.042, // Assurance chômage (4.2%)
      familyAllowance: 0.0525, // Allocations familiales (5.25%)
      workAccidents: 0.01, // Accidents du travail (variable, average 1%)
      housingAid: 0.005, // Aide au logement (0.5%)
      professionalTraining: 0.01, // Formation professionnelle (1%)
      transportPayment: 0.01, // Versement transport (variable, average 1%)
    };

    // Parse inputs
    const parsedGrossSalary = parseFloat(grossSalary) / 12; // Convert annual to monthly
    const parsedOvertimeHours = parseFloat(overtimeHours) || 0;
    const parsedOvertimeRate = parseFloat(overtimeRate) || 25;

    // Overtime calculation
    const hourlyRate = parsedGrossSalary / 151.67; // Legal working hours in France
    const overtimePay = parsedOvertimeHours * hourlyRate * (1 + parsedOvertimeRate / 100);

    // Employee contributions
    const baseForSocialContributions = parsedGrossSalary;
    const baseForCSGCRDS = parsedGrossSalary * 0.9825; // 98.25% of gross

    // Calculate each employee contribution
    const healthInsuranceEmployee = baseForSocialContributions * employeePortion.healthInsurance;
    const pensionBasicEmployee = baseForSocialContributions * employeePortion.pensionBasic;
    const pensionComplementaryEmployee = baseForSocialContributions * employeePortion.pensionComplementary;
    const unemploymentEmployee = baseForSocialContributions * employeePortion.unemployment;
    const csgDeductible = baseForCSGCRDS * employeePortion.socialSecurity;
    const csgNonDeductible = baseForCSGCRDS * employeePortion.csgCrds;

    // Total employee contributions
    const employeeContributions = 
      healthInsuranceEmployee + 
      pensionBasicEmployee + 
      pensionComplementaryEmployee + 
      unemploymentEmployee + 
      csgDeductible + 
      csgNonDeductible;

    // Calculate total employer contributions (for reference)
    const employerContributions = parsedGrossSalary * 
      (employerPortion.healthInsurance + 
       employerPortion.pensionBasic + 
       employerPortion.pensionComplementary + 
       employerPortion.unemployment + 
       employerPortion.familyAllowance + 
       employerPortion.workAccidents + 
       employerPortion.housingAid + 
       employerPortion.professionalTraining + 
       employerPortion.transportPayment);

    // Net salary calculation
    const netSalary = parsedGrossSalary - employeeContributions + overtimePay;

    // Create detailed contributions list for payslip
    const details = [
      { label: 'Salaire de base', amount: parsedGrossSalary, type: 'earning' },
      { label: 'Heures supplémentaires', amount: overtimePay, type: 'earning' },
      { label: 'Assurance maladie', amount: healthInsuranceEmployee, type: 'deduction' },
      { label: 'Retraite de base', amount: pensionBasicEmployee, type: 'deduction' },
      { label: 'Retraite complémentaire', amount: pensionComplementaryEmployee, type: 'deduction' },
      { label: 'Assurance chômage', amount: unemploymentEmployee, type: 'deduction' },
      { label: 'CSG déductible', amount: csgDeductible, type: 'deduction' },
      { label: 'CSG/CRDS non déductible', amount: csgNonDeductible, type: 'deduction' },
    ];

    // Calculate paid leave balance
    // In France, employees typically earn 2.5 days of paid leave per month
    const monthsWorked = 12; // Assuming a full year for simplicity
    const paidLeaveAcquired = 2.5 * monthsWorked;
    const paidLeaveTaken = 5; // Example value
    const paidLeaveBalance = paidLeaveAcquired - paidLeaveTaken;

    // RTT (Reduction of Working Time) calculation
    // Typically depends on company policy, using example values
    const rttAcquired = 12; // Example: 1 day per month
    const rttTaken = 2; // Example value
    const rttBalance = rttAcquired - rttTaken;

    const newPayslip: PaySlip = {
      id: Math.random().toString(36).substring(7),
      employee: {
        firstName: employeeName.split(' ')[0],
        lastName: employeeName.split(' ')[1] || '',
        employeeId: selectedEmployeeId,
        role: 'Software Engineer', // This should be retrieved from employee data
        socialSecurityNumber: '123-456-789', // This should be retrieved from employee data
        startDate: '2022-01-01', // This should be retrieved from employee data
      },
      period: period,
      details: details,
      grossSalary: parsedGrossSalary,
      totalDeductions: employeeContributions,
      netSalary: netSalary,
      hoursWorked: 151.67 + parsedOvertimeHours,
      paymentDate: new Date().toLocaleDateString(),
      employerName: companyName,
      employerAddress: companyAddress,
      employerSiret: companySiret,
      conges: {
        acquired: paidLeaveAcquired,
        taken: paidLeaveTaken,
        balance: paidLeaveBalance,
      },
      rtt: {
        acquired: rttAcquired,
        taken: rttTaken,
        balance: rttBalance,
      },
      annualCumulative: {
        grossSalary: parseFloat(grossSalary),
        netSalary: netSalary * 12,
        taxableIncome: netSalary * 12 * 0.8, // Approximate calculation
      },
      status: "Généré",
      date: new Date().toISOString(),
    };

    setCurrentPayslip(newPayslip);
    return newPayslip;
  };

  return {
    employeeName,
    setEmployeeName,
    selectedEmployeeId,
    setSelectedEmployeeId,
    period,
    setPeriod,
    grossSalary,
    setGrossSalary,
    overtimeHours,
    setOvertimeHours,
    overtimeRate,
    setOvertimeRate,
    selectedCompanyId,
    setSelectedCompanyId,
    companyName,
    setCompanyName,
    companyAddress,
    setCompanyAddress,
    companySiret,
    setCompanySiret,
    showPreview,
    setShowPreview,
    currentPayslip,
    setCurrentPayslip,
    handleEmployeeSelect,
    handleCompanySelect,
    generatePayslip
  };
};
