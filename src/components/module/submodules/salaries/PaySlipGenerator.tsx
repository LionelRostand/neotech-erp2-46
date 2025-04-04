
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayslipGenerator } from './hooks/usePayslipGenerator';
import PayslipFormControls from './components/PayslipFormControls';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PayslipViewer from './components/PayslipViewer';
import { Employee } from '@/types/employee';
import { Company } from '../companies/types';

interface PaySlipGeneratorProps {
  employees?: Employee[];
  companies?: Company[];
}

const PaySlipGenerator: React.FC<PaySlipGeneratorProps> = ({ employees, companies }) => {
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
    handleEmployeeSelect,
    handleCompanySelect,
    generatePayslip
  } = usePayslipGenerator();

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i);
  
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  React.useEffect(() => {
    if (selectedMonth && selectedYear) {
      setPeriod(`${selectedMonth} ${selectedYear}`);
    }
  }, [selectedMonth, selectedYear, setPeriod]);

  const handleViewSample = () => {
    setEmployeeName("Pierre Dupont");
    setGrossSalary("2500");
    setOvertimeHours("10");
    setOvertimeRate("25");
    setCompanyName("Entreprise ACME");
    setCompanyAddress("15 rue des Lilas, 75001 Paris");
    setCompanySiret("123 456 789 00012");
    setPeriod(`${selectedMonth} ${selectedYear}`);
  };

  const handleGeneratePaySlip = () => {
    generatePayslip();
    setShowPreview(true);
  };

  if (showPreview && currentPayslip) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            Retour
          </Button>
        </div>
        <PayslipViewer payslip={currentPayslip} />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Générer une fiche de paie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Employé</Label>
            {employees && employees.length > 0 ? (
              <Select onValueChange={(value) => handleEmployeeSelect(value, employees)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Nom et prénom de l'employé"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Entreprise</Label>
            {companies && companies.length > 0 ? (
              <Select onValueChange={(value) => handleCompanySelect(value, companies)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom de l'entreprise"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Mois</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Année</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Salaire brut (€)</Label>
          <Input
            type="number"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            placeholder="Ex: 2500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Heures supplémentaires</Label>
            <Input
              type="number"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
              placeholder="Ex: 10"
            />
          </div>

          <div className="space-y-2">
            <Label>Majoration (%)</Label>
            <Input
              type="number"
              value={overtimeRate}
              onChange={(e) => setOvertimeRate(e.target.value)}
              placeholder="Ex: 25"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Adresse de l'entreprise</Label>
          <Input
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            placeholder="Ex: 15 rue des Lilas, 75001 Paris"
          />
        </div>

        <div className="space-y-2">
          <Label>SIRET</Label>
          <Input
            value={companySiret}
            onChange={(e) => setCompanySiret(e.target.value)}
            placeholder="Ex: 123 456 789 00012"
          />
        </div>

        <PayslipFormControls
          handleViewSample={handleViewSample}
          handleGeneratePaySlip={handleGeneratePaySlip}
        />
      </CardContent>
    </Card>
  );
};

export default PaySlipGenerator;
