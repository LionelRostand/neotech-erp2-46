
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import { PaySlip } from '@/types/payslip';

export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState('');
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
    const employeePortion = 0.22;
    const employerPortion = 0.45;

    const parsedGrossSalary = parseFloat(grossSalary);
    const parsedOvertimeHours = parseFloat(overtimeHours);
    const parsedOvertimeRate = parseFloat(overtimeRate);

    const hourlyRate = parsedGrossSalary / 151.67;
    const overtimePay = parsedOvertimeHours * hourlyRate * (1 + parsedOvertimeRate / 100);

    const employeeContributions = parsedGrossSalary * employeePortion;
    const employerContributions = parsedGrossSalary * employerPortion;

    const netSalary = parsedGrossSalary - employeeContributions + overtimePay;

    const newPayslip: PaySlip = {
      id: Math.random().toString(36).substring(7),
      employee: {
        firstName: employeeName.split(' ')[0],
        lastName: employeeName.split(' ')[1] || '',
        employeeId: 'EMP-001',
        role: 'Software Engineer',
        socialSecurityNumber: '123-456-789',
        startDate: '2022-01-01',
      },
      period: period,
      details: [
        { label: 'Salaire de base', amount: parsedGrossSalary, type: 'earning' },
        { label: 'Heures supplémentaires', amount: overtimePay, type: 'earning' },
        { label: 'Cotisations salariales', amount: employeeContributions, type: 'deduction' },
      ],
      grossSalary: parsedGrossSalary,
      totalDeductions: employeeContributions,
      netSalary: netSalary,
      hoursWorked: 151.67 + parsedOvertimeHours,
      paymentDate: new Date().toLocaleDateString(),
      employerName: companyName,
      employerAddress: companyAddress,
      employerSiret: companySiret,
      conges: {
        acquired: 25,
        taken: 5,
        balance: 20,
      },
      rtt: {
        acquired: 12,
        taken: 2,
        balance: 10,
      },
      annualCumulative: {
        grossSalary: parsedGrossSalary * 12,
        netSalary: netSalary * 12,
        taxableIncome: netSalary * 12 * 0.8,
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
