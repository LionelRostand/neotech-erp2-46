
import { useState } from 'react';
import { PaySlip } from '@/types/payslip';
import { generateAndSavePayslip } from '../services/payslipGeneratorService';
import { useNavigate } from 'react-router-dom';

export const usePayslipGenerator = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [period, setPeriod] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [overtimeRate, setOvertimeRate] = useState('25');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);
  
  const navigate = useNavigate();

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleEmployeeSelect = (employeeId: string, employees: any[]) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployeeId(employeeId);
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
    }
  };

  const generatePayslip = async () => {
    if (!selectedEmployeeId || !selectedCompanyId || !period || !grossSalary) {
      return null;
    }

    const baseGrossSalary = parseFloat(grossSalary);
    const overtime = parseFloat(overtimeHours) || 0;
    const rate = parseFloat(overtimeRate) || 25;

    // Calcul du salaire selon le droit du travail français
    const overtimeAmount = (baseGrossSalary / 151.67) * overtime * (1 + rate / 100);
    const totalGross = baseGrossSalary + overtimeAmount;

    // Calcul des cotisations selon les taux légaux français
    const socialContributions = totalGross * 0.22; // 22% pour les cotisations sociales
    const healthInsurance = totalGross * 0.07;     // 7% pour l'assurance maladie
    const retirementContribution = totalGross * 0.11; // 11% pour la retraite
    const unemploymentInsurance = totalGross * 0.024; // 2.4% pour l'assurance chômage

    const totalDeductions = socialContributions + healthInsurance + 
                          retirementContribution + unemploymentInsurance;

    const netSalary = totalGross - totalDeductions;

    // Récupérer le mois et l'année à partir de la période (ex: "Janvier 2025")
    const [month, yearStr] = period.split(' ');
    const year = parseInt(yearStr);

    const employeeFirstName = employeeName.split(' ')[0] || '';
    const employeeLastName = employeeName.split(' ').slice(1).join(' ') || '';

    const payslip: PaySlip = {
      id: '',
      employeeId: selectedEmployeeId,
      employeeName: employeeName,
      period,
      details: [
        { label: 'Salaire de base', amount: baseGrossSalary, type: 'earning' },
        { label: 'Heures supplémentaires', amount: overtimeAmount, type: 'earning' },
        { label: 'Cotisations sociales', amount: -socialContributions, type: 'deduction' },
        { label: 'Assurance maladie', amount: -healthInsurance, type: 'deduction' },
        { label: 'Cotisation retraite', amount: -retirementContribution, type: 'deduction' },
        { label: 'Assurance chômage', amount: -unemploymentInsurance, type: 'deduction' }
      ],
      grossSalary: totalGross,
      totalDeductions,
      netSalary,
      hoursWorked: 151.67 + overtime,
      paymentDate: new Date().toISOString(),
      status: 'Généré',
      date: new Date().toISOString(),
      month: month,
      year: year,
      employerName: 'Votre Entreprise', // Remplir avec des valeurs par défaut
      employerAddress: '123 Rue de Paris, 75000 Paris',
      employerSiret: '123 456 789 00012',
      employee: {
        firstName: employeeFirstName,
        lastName: employeeLastName,
        employeeId: selectedEmployeeId,
        role: '',
        socialSecurityNumber: '',
        startDate: ''
      }
    };

    const success = await generateAndSavePayslip(payslip);
    if (success) {
      setCurrentPayslip(payslip);
      setShowPreview(true);
      
      // Rediriger vers l'historique après la génération
      navigate('/modules/employees/salaries?tab=history');
    }

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
    showPreview,
    setShowPreview,
    selectedCompanyId,
    handleCompanySelect,
    handleEmployeeSelect,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedCompany,
    setSelectedCompany,
    currentPayslip,
    generatePayslip
  };
};
