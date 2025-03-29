
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaySlipTemplate from './PaySlipTemplate';
import { PaySlip } from '@/types/payslip';
import { toast } from 'sonner';
import { getAllDocuments } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import { useCompanyService } from '@/components/module/submodules/companies/services/companyService';
import { usePayslipGenerator } from './hooks/usePayslipGenerator';
import CompanyInfoSection from './components/CompanyInfoSection';
import EmployeeInfoSection from './components/EmployeeInfoSection';
import OvertimeSection from './components/OvertimeSection';
import PayslipFormControls from './components/PayslipFormControls';

const samplePaySlip: PaySlip = {
  id: '12345',
  employee: {
    firstName: 'Jean',
    lastName: 'Dupont',
    employeeId: 'EMP001',
    role: 'Développeur Web',
    socialSecurityNumber: '1 85 12 75 108 111 42',
    startDate: '01/01/2022'
  },
  period: 'Juin 2023',
  details: [
    { label: 'Salaire de base', base: '151.67 H', rate: '20,00 €/H', amount: 3033.4, type: 'earning' },
    { label: 'Prime d\'ancienneté', base: '', rate: '', amount: 150, type: 'earning' },
    { label: 'Heures supplémentaires', base: '10.00 H', rate: '25,00 €/H', amount: 250, type: 'earning' },
    { label: 'CSG déductible', base: '3433,40 €', rate: '6,80 %', amount: 233.47, type: 'deduction' },
    { label: 'CSG non déductible', base: '3433,40 €', rate: '2,90 %', amount: 99.57, type: 'deduction' },
    { label: 'Assurance maladie', base: '3433,40 €', rate: '0,95 %', amount: 32.62, type: 'deduction' },
    { label: 'Retraite complémentaire', base: '3433,40 €', rate: '3,15 %', amount: 108.15, type: 'deduction' },
    { label: 'Assurance chômage', base: '3433,40 €', rate: '1,90 %', amount: 65.23, type: 'deduction' }
  ],
  grossSalary: 3433.40,
  totalDeductions: 539.04,
  netSalary: 2894.36,
  hoursWorked: 161.67,
  paymentDate: '30/06/2023',
  employerName: 'ACME France SAS',
  employerAddress: '15 Rue de la Paix, 75001 Paris',
  employerSiret: '123 456 789 00012'
};

const PaySlipGenerator: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { getCompanies } = useCompanyService();
  
  const {
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
    selectedCompany,
    handleCompanySelect: baseHandleCompanySelect,
    handleEmployeeSelect: baseHandleEmployeeSelect,
    generatePayslip
  } = usePayslipGenerator();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getAllDocuments(COLLECTIONS.EMPLOYEES);
        setEmployees(fetchedEmployees as Employee[]);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Erreur lors du chargement des employés');
      }
    };
    
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { companies: fetchedCompanies } = await getCompanies();
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Erreur lors du chargement des entreprises');
      }
    };

    fetchCompanies();
  }, [getCompanies]);

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    baseHandleEmployeeSelect(e, employees);
  };

  const handleCompanySelect = (companyId: string) => {
    baseHandleCompanySelect(companyId, companies);
  };

  const handleGeneratePaySlip = () => {
    generatePayslip();
  };

  const handleViewSample = () => {
    setCurrentPayslip(samplePaySlip);
    setShowPreview(true);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  return (
    <div className="space-y-6 py-6">
      {!showPreview ? (
        <div className="grid gap-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Générateur de Bulletin de Paie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CompanyInfoSection 
                companyName={companyName}
                setCompanyName={setCompanyName}
                companyAddress={companyAddress}
                setCompanyAddress={setCompanyAddress}
                companySiret={companySiret}
                setCompanySiret={setCompanySiret}
                companies={companies}
                handleCompanySelect={handleCompanySelect}
              />

              <EmployeeInfoSection 
                employeeName={employeeName}
                setEmployeeName={setEmployeeName}
                period={period}
                setPeriod={setPeriod}
                grossSalary={grossSalary}
                setGrossSalary={setGrossSalary}
                employees={employees}
                handleEmployeeSelect={handleEmployeeSelect}
              />

              <OvertimeSection 
                overtimeHours={overtimeHours}
                setOvertimeHours={setOvertimeHours}
                overtimeRate={overtimeRate}
                setOvertimeRate={setOvertimeRate}
              />

              <PayslipFormControls 
                handleViewSample={handleViewSample}
                handleGeneratePaySlip={handleGeneratePaySlip}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBack}>Retour au formulaire</Button>
          </div>
          {currentPayslip && <PaySlipTemplate payslip={currentPayslip} />}
        </div>
      )}
    </div>
  );
};

export default PaySlipGenerator;
