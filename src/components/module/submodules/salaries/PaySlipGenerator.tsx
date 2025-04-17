
import React from 'react';
import { usePayslipGenerator } from './hooks/usePayslipGenerator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import CompanySelect from './components/CompanySelect';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types/employee';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';

const PaySlipGenerator: React.FC = () => {
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
    generatePayslip,
    setShowPreview,
    selectedCompanyId,
    handleCompanySelect,
    handleEmployeeSelect,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedCompany
  } = usePayslipGenerator();

  const { employees } = useEmployeeData();
  const { salary: contractSalary } = useEmployeeContract(selectedEmployeeId);

  // Update employee name when selected from dropdown
  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    handleEmployeeSelect(employeeId, employees);
  };

  // Update gross salary when contract salary changes
  React.useEffect(() => {
    if (contractSalary > 0) {
      setGrossSalary(contractSalary.toString());
    }
  }, [contractSalary, setGrossSalary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePayslip();
    setShowPreview(true);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Générer une fiche de paie</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee select */}
          <div>
            <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-1">
              Employé
            </label>
            <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange}>
              <SelectTrigger id="employee-select">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee: Employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company select */}
          <CompanySelect
            selectedCompanyId={selectedCompanyId}
            onCompanySelect={handleCompanySelect}
          />

          {/* Period select */}
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Sélectionner la période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="janvier 2025">Janvier 2025</SelectItem>
                <SelectItem value="février 2025">Février 2025</SelectItem>
                <SelectItem value="mars 2025">Mars 2025</SelectItem>
                <SelectItem value="avril 2025">Avril 2025</SelectItem>
                <SelectItem value="mai 2025">Mai 2025</SelectItem>
                <SelectItem value="juin 2025">Juin 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gross salary */}
          <div>
            <label htmlFor="gross-salary" className="block text-sm font-medium text-gray-700 mb-1">
              Salaire brut annuel
            </label>
            <Input
              id="gross-salary"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
              placeholder="Salaire brut annuel"
              className={contractSalary > 0 ? "bg-gray-50" : ""}
            />
            {contractSalary > 0 && (
              <p className="text-xs text-gray-500 mt-1">Récupéré du contrat de travail</p>
            )}
          </div>

          {/* Overtime hours */}
          <div>
            <label htmlFor="overtime-hours" className="block text-sm font-medium text-gray-700 mb-1">
              Heures supplémentaires
            </label>
            <Input
              id="overtime-hours"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
              placeholder="Heures supplémentaires"
            />
          </div>

          {/* Overtime rate */}
          <div>
            <label htmlFor="overtime-rate" className="block text-sm font-medium text-gray-700 mb-1">
              Taux de majoration (%)
            </label>
            <Input
              id="overtime-rate"
              value={overtimeRate}
              onChange={(e) => setOvertimeRate(e.target.value)}
              placeholder="Taux de majoration"
            />
          </div>
        </div>

        {/* Company details display */}
        {selectedCompany && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Informations de l'entreprise</h3>
            <p className="text-sm text-gray-600">
              <strong>Nom :</strong> {selectedCompany.name}
            </p>
            {selectedCompany.address && (
              <p className="text-sm text-gray-600">
                <strong>Adresse :</strong> {selectedCompany.address.street}, {selectedCompany.address.postalCode} {selectedCompany.address.city}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <strong>SIRET :</strong> {selectedCompany.siret || "Non spécifié"}
            </p>
          </div>
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full">
            Générer la fiche de paie
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PaySlipGenerator;
