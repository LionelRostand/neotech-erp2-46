
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PaySlipTemplate from './PaySlipTemplate';
import { PaySlip } from '@/types/payslip';
import { toast } from 'sonner';

// Sample data for a pay slip
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
  const [showPreview, setShowPreview] = useState(false);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);

  const handleGeneratePaySlip = () => {
    if (!employeeName || !period || !grossSalary) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Split employee name into first and last name
    const nameParts = employeeName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const grossAmount = parseFloat(grossSalary);
    if (isNaN(grossAmount) || grossAmount <= 0) {
      toast.error('Veuillez entrer un salaire brut valide');
      return;
    }

    // Calculate deductions (rough French social security estimation)
    const csgDeductible = grossAmount * 0.0675;
    const csgNonDeductible = grossAmount * 0.029;
    const healthInsurance = grossAmount * 0.0095;
    const pension = grossAmount * 0.031;
    const unemployment = grossAmount * 0.019;
    const totalDeductions = csgDeductible + csgNonDeductible + healthInsurance + pension + unemployment;
    const netSalary = grossAmount - totalDeductions;

    // Generate a custom payslip based on input
    const customPayslip: PaySlip = {
      id: `PS-${Date.now().toString().slice(-6)}`,
      employee: {
        firstName,
        lastName,
        employeeId: `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        role: 'Employé',
        socialSecurityNumber: '9 99 99 99 999 999 99',
        startDate: '01/01/2023'
      },
      period: period,
      details: [
        { label: 'Salaire de base', base: '151.67 H', rate: `${(grossAmount / 151.67).toFixed(2)} €/H`, amount: grossAmount, type: 'earning' },
        { label: 'CSG déductible', base: `${grossAmount.toFixed(2)} €`, rate: '6,75 %', amount: csgDeductible, type: 'deduction' },
        { label: 'CSG non déductible', base: `${grossAmount.toFixed(2)} €`, rate: '2,90 %', amount: csgNonDeductible, type: 'deduction' },
        { label: 'Assurance maladie', base: `${grossAmount.toFixed(2)} €`, rate: '0,95 %', amount: healthInsurance, type: 'deduction' },
        { label: 'Retraite complémentaire', base: `${grossAmount.toFixed(2)} €`, rate: '3,10 %', amount: pension, type: 'deduction' },
        { label: 'Assurance chômage', base: `${grossAmount.toFixed(2)} €`, rate: '1,90 %', amount: unemployment, type: 'deduction' }
      ],
      grossSalary: grossAmount,
      totalDeductions,
      netSalary,
      hoursWorked: 151.67,
      paymentDate: new Date().toLocaleDateString('fr-FR'),
      employerName: 'Votre Entreprise SARL',
      employerAddress: '1 Rue des Entrepreneurs, 75002 Paris',
      employerSiret: '987 654 321 00098'
    };

    setCurrentPayslip(customPayslip);
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
                <Label htmlFor="employeeName">Nom et prénom de l'employé</Label>
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
