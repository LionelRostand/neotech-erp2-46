import { useState } from 'react';
import { toast } from 'sonner';
import { PaySlip } from '@/types/payslip';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';

export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [period, setPeriod] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [overtimeRate, setOvertimeRate] = useState('25');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySiret, setCompanySiret] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>, employees: Employee[]) => {
    const employeeId = e.target.value;
    if (!employeeId) {
      setSelectedEmployee(null);
      setEmployeeName('');
      setGrossSalary('');
      return;
    }
    
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
      
      if (employee.contract) {
        const contractParts = employee.contract.split('|');
        if (contractParts.length > 1) {
          const salarySectionMatch = contractParts.find(part => part.trim().startsWith('Salaire:'));
          if (salarySectionMatch) {
            const salaryMatch = salarySectionMatch.match(/Salaire:\s*(\d+)/);
            if (salaryMatch && salaryMatch[1]) {
              setGrossSalary(salaryMatch[1]);
            }
          }
        }
      }
    }
  };

  const handleCompanySelect = (companyId: string, companies: Company[]) => {
    if (companyId === 'placeholder') {
      setSelectedCompany(null);
      setCompanyName('');
      setCompanyAddress('');
      setCompanySiret('');
      return;
    }
    
    const company = companies.find(comp => comp.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setCompanyName(company.name);
      
      if (company.address) {
        const address = [
          company.address.street,
          company.address.city,
          company.address.postalCode,
          company.address.country
        ].filter(Boolean).join(', ');
        
        setCompanyAddress(address);
      }
      
      if (company.siret) {
        setCompanySiret(company.siret);
      }
    } else {
      setSelectedCompany(null);
      setCompanyName('');
      setCompanyAddress('');
      setCompanySiret('');
    }
  };

  const generatePayslip = () => {
    if (!employeeName || !period || !grossSalary || !companyName) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const nameParts = employeeName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const grossAmount = parseFloat(grossSalary);
    if (isNaN(grossAmount) || grossAmount <= 0) {
      toast.error('Veuillez entrer un salaire brut valide');
      return;
    }

    let overtimePay = 0;
    const overtimeHoursValue = parseFloat(overtimeHours || '0');
    const overtimeRateValue = parseFloat(overtimeRate || '25');
    
    if (!isNaN(overtimeHoursValue) && overtimeHoursValue > 0) {
      const hourlyRate = grossAmount / 151.67;
      overtimePay = overtimeHoursValue * hourlyRate * (1 + overtimeRateValue / 100);
    }

    const totalGrossAmount = grossAmount + overtimePay;

    const csgCrds = totalGrossAmount * 0.0975;
    const csgDeductible = totalGrossAmount * 0.0675;
    const csgNonDeductible = totalGrossAmount * 0.029;
    const healthInsurance = totalGrossAmount * 0.0075;
    const pension = totalGrossAmount * 0.0410;
    const unemployment = totalGrossAmount * 0.024;
    const retirementComplementary = totalGrossAmount * 0.0380;
    
    const totalDeductions = csgCrds + healthInsurance + pension + unemployment + retirementComplementary;
    const netSalary = totalGrossAmount - totalDeductions;

    const taxableIncome = totalGrossAmount * 0.98 - (healthInsurance + pension + unemployment + retirementComplementary);

    const details: any[] = [
      { label: 'Salaire de base', base: '151.67 H', rate: `${(grossAmount / 151.67).toFixed(2)} €/H`, amount: grossAmount, type: 'earning' },
    ];

    if (overtimePay > 0) {
      details.push({
        label: 'Heures supplémentaires', 
        base: `${overtimeHoursValue.toFixed(2)} H`, 
        rate: `${(grossAmount / 151.67 * (1 + overtimeRateValue / 100)).toFixed(2)} €/H`, 
        amount: overtimePay, 
        type: 'earning'
      });
    }

    details.push(
      { label: 'CSG déductible', base: `${totalGrossAmount.toFixed(2)} €`, rate: '6,75 %', amount: csgDeductible, type: 'deduction' },
      { label: 'CSG/CRDS non déductible', base: `${totalGrossAmount.toFixed(2)} €`, rate: '2,90 %', amount: csgNonDeductible, type: 'deduction' },
      { label: 'Sécurité sociale - Maladie', base: `${totalGrossAmount.toFixed(2)} €`, rate: '0,75 %', amount: healthInsurance, type: 'deduction' },
      { label: 'Assurance vieillesse', base: `${totalGrossAmount.toFixed(2)} €`, rate: '4,10 %', amount: pension, type: 'deduction' },
      { label: 'Retraite complémentaire', base: `${totalGrossAmount.toFixed(2)} €`, rate: '3,80 %', amount: retirementComplementary, type: 'deduction' },
      { label: 'Assurance chômage', base: `${totalGrossAmount.toFixed(2)} €`, rate: '2,40 %', amount: unemployment, type: 'deduction' }
    );

    const payslip: PaySlip = {
      id: `PS-${Date.now().toString().slice(-6)}`,
      employee: {
        firstName,
        lastName,
        employeeId: selectedEmployee?.id || `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        role: selectedEmployee?.position || 'Employé',
        socialSecurityNumber: '1 99 99 99 999 999 99',
        startDate: selectedEmployee?.hireDate || '01/01/2023'
      },
      period: period,
      details: details,
      grossSalary: totalGrossAmount,
      totalDeductions,
      netSalary,
      hoursWorked: 151.67 + (overtimeHoursValue || 0),
      paymentDate: new Date().toLocaleDateString('fr-FR'),
      employerName: companyName || 'Votre Entreprise SARL',
      employerAddress: companyAddress || '1 Rue des Entrepreneurs, 75002 Paris',
      employerSiret: companySiret || '987 654 321 00098',
      conges: {
        acquired: 2.5,
        taken: 0,
        balance: 25
      },
      rtt: {
        acquired: 1,
        taken: 0,
        balance: 9
      },
      annualCumulative: {
        grossSalary: totalGrossAmount * 9,
        netSalary: netSalary * 9,
        taxableIncome: taxableIncome * 9
      }
    };

    setCurrentPayslip(payslip);
    setShowPreview(true);
    toast.success('Bulletin de paie généré avec succès');
    
    return payslip;
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
    selectedEmployee,
    setSelectedEmployee,
    selectedCompany,
    setSelectedCompany,
    handleEmployeeSelect,
    handleCompanySelect,
    generatePayslip
  };
};
