
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';
import { toast } from 'sonner';
import SalaryCalculationCard from './SalaryCalculationCard';

export const SalaryForm: React.FC = () => {
  const { employees, companies } = useHrModuleData();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [monthlyGrossSalary, setMonthlyGrossSalary] = useState<number | null>(null);
  
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
    handleEmployeeSelect,
    handleCompanySelect,
    generatePayslip
  } = usePayslipGenerator();

  // Récupérer le contrat de l'employé sélectionné
  const { contract, salary } = useEmployeeContract(selectedEmployee);

  // Mettre à jour les données lorsqu'un employé est sélectionné
  useEffect(() => {
    if (selectedEmployee && employees) {
      const employee = employees.find(e => e.id === selectedEmployee);
      if (employee) {
        handleEmployeeSelect(selectedEmployee, employees);
        
        // Utiliser le salaire du contrat s'il est disponible
        if (salary) {
          setMonthlyGrossSalary(salary / 12); // Convertir le salaire annuel en mensuel
          setGrossSalary((salary / 12).toString()); // Mettre à jour le salaire brut mensuel
        }
      }
    }
  }, [selectedEmployee, employees, salary, handleEmployeeSelect, setGrossSalary]);

  // Mettre à jour les données lorsqu'une entreprise est sélectionnée
  useEffect(() => {
    if (selectedCompany && companies) {
      handleCompanySelect(selectedCompany, companies);
    }
  }, [selectedCompany, companies, handleCompanySelect]);

  const handleGeneratePayslip = () => {
    if (!selectedEmployee || !period || !grossSalary) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const payslip = generatePayslip();
    if (payslip) {
      setShowPreview(true);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Créer une nouvelle fiche de paie</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="employee">Employé</Label>
                <Select
                  value={selectedEmployee}
                  onValueChange={setSelectedEmployee}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="period">Période</Label>
                <Select
                  value={period}
                  onValueChange={setPeriod}
                >
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Sélectionner la période" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }).map((_, index) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - index);
                      const value = `${date.toLocaleString('fr-FR', { month: 'long' })} ${date.getFullYear()}`;
                      return (
                        <SelectItem key={index} value={value}>
                          {value}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="grossSalary">Salaire brut mensuel (basé sur le salaire annuel)</Label>
                <div className="flex items-center">
                  <Input
                    id="grossSalary"
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(e.target.value)}
                    className="flex-1"
                  />
                  <div className="ml-2 text-sm text-muted-foreground">
                    {monthlyGrossSalary && (
                      <span>Annuel: {(Number(monthlyGrossSalary) * 12).toLocaleString('fr-FR')} €</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="overtime">Heures supplémentaires</Label>
                <Input
                  id="overtime"
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="overtimeRate">Majoration (%)</Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  value={overtimeRate}
                  onChange={(e) => setOvertimeRate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="companyName">Nom de l'entreprise</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="companyAddress">Adresse de l'entreprise</Label>
                <Input
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="companySiret">Numéro SIRET</Label>
                <Input
                  id="companySiret"
                  value={companySiret}
                  onChange={(e) => setCompanySiret(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleGeneratePayslip} 
                  className="w-full"
                  disabled={!selectedEmployee || !period || !grossSalary}
                >
                  Générer la fiche de paie
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showPreview && currentPayslip && (
        <SalaryCalculationCard
          details={currentPayslip.details}
          grossSalary={currentPayslip.grossSalary}
          totalDeductions={currentPayslip.totalDeductions}
          netSalary={currentPayslip.netSalary}
        />
      )}
    </div>
  );
};
