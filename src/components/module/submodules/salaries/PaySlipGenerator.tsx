import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaySlipTemplate from './PaySlipTemplate';
import { PaySlip } from '@/types/payslip';
import { toast } from 'sonner';
import { getAllDocuments } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import { useCompanyService } from '@/components/module/submodules/companies/services/companyService';
import { PaySlipDetail as LocalPaySlipDetail } from './types/payslip';

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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const { getCompanies } = useCompanyService();

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

  const handleCompanySelect = (companyId: string) => {
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

  const handleGeneratePaySlip = () => {
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

    const csgDeductible = totalGrossAmount * 0.0675;
    const csgNonDeductible = totalGrossAmount * 0.029;
    const healthInsurance = totalGrossAmount * 0.0095;
    const pension = totalGrossAmount * 0.031;
    const unemployment = totalGrossAmount * 0.019;
    const totalDeductions = csgDeductible + csgNonDeductible + healthInsurance + pension + unemployment;
    const netSalary = totalGrossAmount - totalDeductions;

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
      { label: 'CSG non déductible', base: `${totalGrossAmount.toFixed(2)} €`, rate: '2,90 %', amount: csgNonDeductible, type: 'deduction' },
      { label: 'Assurance maladie', base: `${totalGrossAmount.toFixed(2)} €`, rate: '0,95 %', amount: healthInsurance, type: 'deduction' },
      { label: 'Retraite complémentaire', base: `${totalGrossAmount.toFixed(2)} €`, rate: '3,10 %', amount: pension, type: 'deduction' },
      { label: 'Assurance chômage', base: `${totalGrossAmount.toFixed(2)} €`, rate: '1,90 %', amount: unemployment, type: 'deduction' }
    );

    setCurrentPayslip({
      id: `PS-${Date.now().toString().slice(-6)}`,
      employee: {
        firstName,
        lastName,
        employeeId: selectedEmployee?.id || `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        role: selectedEmployee?.position || 'Employé',
        socialSecurityNumber: '9 99 99 99 999 999 99',
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
      employerSiret: companySiret || '987 654 321 00098'
    });

    setShowPreview(true);
    toast.success('Bulletin de paie généré avec succès');
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
              <div className="space-y-2">
                <Label htmlFor="companySection">Informations de l'entreprise</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companySelect">Sélectionner une entreprise</Label>
                    <Select onValueChange={handleCompanySelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une entreprise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder">Sélectionner une entreprise</SelectItem>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input 
                      id="companyName" 
                      placeholder="ACME France SAS"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Adresse</Label>
                    <Input 
                      id="companyAddress" 
                      placeholder="15 Rue de la Paix, 75001 Paris"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySiret">SIRET</Label>
                    <Input 
                      id="companySiret" 
                      placeholder="123 456 789 00012"
                      value={companySiret}
                      onChange={(e) => setCompanySiret(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeSection">Informations de l'employé</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="employeeSelect">Sélectionner un employé</Label>
                    <select 
                      id="employeeSelect" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      onChange={handleEmployeeSelect}
                      defaultValue=""
                    >
                      <option value="">Sélectionner un employé</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName} - {employee.position}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Nom et prénom</Label>
                    <Input 
                      id="employeeName" 
                      placeholder="Jean Dupont"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Période</Label>
                    <Input 
                      id="period" 
                      placeholder="Juin 2023"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grossSalary">Salaire brut (€)</Label>
                    <Input 
                      id="grossSalary" 
                      placeholder="3000" 
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtimeSection">Heures supplémentaires</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="overtimeHours">Nombre d'heures supplémentaires</Label>
                    <Input 
                      id="overtimeHours" 
                      placeholder="0" 
                      type="number"
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overtimeRate">Majoration (%)</Label>
                    <Input 
                      id="overtimeRate" 
                      placeholder="25" 
                      type="number"
                      value={overtimeRate}
                      onChange={(e) => setOvertimeRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-between gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleViewSample}
                  className="w-full sm:w-auto"
                >
                  Voir un exemple
                </Button>
                <Button 
                  onClick={handleGeneratePaySlip}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  Générer le bulletin
                </Button>
              </div>
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
