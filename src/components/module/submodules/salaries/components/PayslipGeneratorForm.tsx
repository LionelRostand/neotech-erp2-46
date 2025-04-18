
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CompanySelect from './CompanySelect';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';
import { toast } from 'sonner';
import { PaySlip } from '@/types/payslip';

interface PayslipGeneratorFormProps {
  onPayslipGenerated?: (payslip: PaySlip) => void;
}

const PayslipGeneratorForm: React.FC<PayslipGeneratorFormProps> = ({ onPayslipGenerated }) => {
  const { employees } = useEmployeeData();
  
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
    selectedCompanyId,
    handleCompanySelect,
    handleEmployeeSelect,
    showPreview,
    setShowPreview,
    generatePayslip,
    selectedEmployeeId,
    setSelectedEmployeeId
  } = usePayslipGenerator();

  // We'll use this hook to get the employee's salary from their contract
  const { salary: contractSalary } = useEmployeeContract(selectedEmployeeId);

  // Update gross salary when contract salary changes
  useEffect(() => {
    if (contractSalary > 0) {
      setGrossSalary(contractSalary.toString());
    }
  }, [contractSalary, setGrossSalary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before generating payslip
    if (!selectedEmployeeId) {
      toast.error("Veuillez sélectionner un employé");
      return;
    }
    
    if (!selectedCompanyId) {
      toast.error("Veuillez sélectionner une entreprise");
      return;
    }
    
    if (!period) {
      toast.error("Veuillez sélectionner une période");
      return;
    }
    
    if (!grossSalary || Number(grossSalary) <= 0) {
      toast.error("Le salaire brut doit être supérieur à 0");
      return;
    }
    
    // Generate the payslip according to French labor laws
    try {
      const payslip = await generatePayslip();
      if (payslip && onPayslipGenerated) {
        onPayslipGenerated(payslip);
      }
      console.log("Fiche de paie générée:", payslip);
      setShowPreview(true);
    } catch (error) {
      console.error("Erreur lors de la génération de la fiche de paie:", error);
      toast.error("Erreur lors de la génération de la fiche de paie");
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    handleEmployeeSelect(employeeId, employees);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-6">Créer une nouvelle fiche de paie</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="employee-select" className="text-sm font-medium">
            Employé
          </label>
          <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange}>
            <SelectTrigger id="employee-select">
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <CompanySelect 
          selectedCompanyId={selectedCompanyId}
          onCompanySelect={handleCompanySelect}
        />
        
        <div>
          <label htmlFor="period-select" className="text-sm font-medium">
            Période
          </label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period-select">
              <SelectValue placeholder="Sélectionner la période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="janvier 2025">janvier 2025</SelectItem>
              <SelectItem value="février 2025">février 2025</SelectItem>
              <SelectItem value="mars 2025">mars 2025</SelectItem>
              <SelectItem value="avril 2025">avril 2025</SelectItem>
              <SelectItem value="mai 2025">mai 2025</SelectItem>
              <SelectItem value="juin 2025">juin 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="gross-salary" className="text-sm font-medium">
            Salaire brut annuel
          </label>
          <Input
            id="gross-salary"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value)}
            placeholder="Salaire brut annuel récupéré depuis le contrat"
            className={contractSalary > 0 ? "bg-gray-50" : ""}
          />
          {contractSalary > 0 && (
            <p className="text-xs text-gray-500 mt-1">Récupéré du contrat de travail</p>
          )}
        </div>
        
        <div>
          <label htmlFor="overtime-hours" className="text-sm font-medium">
            Heures supplémentaires
          </label>
          <Input
            id="overtime-hours"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(e.target.value)}
            placeholder="Nombre d'heures supplémentaires"
          />
        </div>
        
        <div>
          <label htmlFor="overtime-rate" className="text-sm font-medium">
            Majoration (%)
          </label>
          <Input
            id="overtime-rate"
            value={overtimeRate}
            onChange={(e) => setOvertimeRate(e.target.value)}
            placeholder="Pourcentage de majoration"
          />
          <p className="text-xs text-gray-500 mt-1">Selon le Code du travail français : 25% pour les 8 premières heures, 50% au-delà</p>
        </div>
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full">
          Générer la fiche de paie
        </Button>
      </div>
    </form>
  );
};

export default PayslipGeneratorForm;
