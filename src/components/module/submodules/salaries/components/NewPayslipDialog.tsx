
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import CompanySelect from './CompanySelect';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';

interface NewPayslipDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
}

const NewPayslipDialog: React.FC<NewPayslipDialogProps> = ({ open, onClose, onGenerate }) => {
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
  const { companies } = useFirebaseCompanies();
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

  const handleGeneratePayslip = () => {
    const payslip = generatePayslip();
    setShowPreview(true);
    onGenerate();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle fiche de paie</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <label htmlFor="dialog-employee" className="block text-sm font-medium mb-1">
              Employé
            </label>
            <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange}>
              <SelectTrigger id="dialog-employee">
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Entreprise
            </label>
            <CompanySelect
              selectedCompanyId={selectedCompanyId}
              onCompanySelect={(id) => handleCompanySelect(id, companies || [])}
              companies={companies}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dialog-period" className="block text-sm font-medium mb-1">
                Période
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="dialog-period">
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

            <div>
              <label htmlFor="dialog-gross-salary" className="block text-sm font-medium mb-1">
                Salaire brut annuel
              </label>
              <Input
                id="dialog-gross-salary"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                placeholder="Salaire brut annuel"
                className={contractSalary > 0 ? "bg-gray-50" : ""}
              />
              {contractSalary > 0 && (
                <p className="text-xs text-gray-500 mt-1">Récupéré du contrat</p>
              )}
            </div>

            <div>
              <label htmlFor="dialog-overtime-hours" className="block text-sm font-medium mb-1">
                Heures supplémentaires
              </label>
              <Input
                id="dialog-overtime-hours"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                placeholder="Heures supplémentaires"
              />
            </div>

            <div>
              <label htmlFor="dialog-overtime-rate" className="block text-sm font-medium mb-1">
                Taux de majoration (%)
              </label>
              <Input
                id="dialog-overtime-rate"
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                placeholder="Taux de majoration"
              />
            </div>
          </div>

          {/* Display company details if selected */}
          {selectedCompany && (
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <p><strong>Entreprise:</strong> {selectedCompany.name}</p>
              {selectedCompany.address && (
                <p><strong>Adresse:</strong> {selectedCompany.address.street}, {selectedCompany.address.postalCode} {selectedCompany.address.city}</p>
              )}
              <p><strong>SIRET:</strong> {selectedCompany.siret || "Non spécifié"}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleGeneratePayslip}>
            Générer la fiche de paie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewPayslipDialog;
