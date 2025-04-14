
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import PayslipFormControls from './PayslipFormControls';
import { Employee } from '@/types/employee';
import { Company } from '@/components/module/submodules/companies/types';
import PayslipViewer from './PayslipViewer';

interface NewPayslipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  companies: Company[];
}

const NewPayslipDialog: React.FC<NewPayslipDialogProps> = ({
  isOpen,
  onClose,
  employees,
  companies
}) => {
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

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setPeriod(`${selectedMonth} ${selectedYear}`);
    }
  }, [selectedMonth, selectedYear, setPeriod]);

  const handleGeneratePayslip = () => {
    const payslip = generatePayslip();
    if (payslip) {
      setShowPreview(true);
    }
  };

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

  if (showPreview && currentPayslip) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setShowPreview(false);
          onClose();
        }
      }}>
        <DialogContent className="max-w-5xl">
          <PayslipViewer 
            payslip={currentPayslip} 
            onClose={() => {
              setShowPreview(false);
              onClose();
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Custom handlers for employee and company selection
  const handleEmployeeSelection = (value: string) => {
    handleEmployeeSelect(value, employees);
  };

  const handleCompanySelection = (value: string) => {
    handleCompanySelect(value, companies);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Générer une nouvelle fiche de paie</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Employé</label>
              <Select 
                onValueChange={handleEmployeeSelection}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                    >
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Entreprise</label>
              <Select 
                onValueChange={handleCompanySelection}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem 
                      key={company.id} 
                      value={company.id}
                    >
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mois</label>
              <Select 
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Année</label>
              <Select 
                value={selectedYear}
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Salaire brut (€)</label>
            <Input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(e.target.value)}
              placeholder="Ex: 2500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Heures supplémentaires</label>
              <Input
                type="number"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                placeholder="Ex: 10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Majoration (%)</label>
              <Input
                type="number"
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                placeholder="Ex: 25"
              />
            </div>
          </div>

          <PayslipFormControls
            handleViewSample={handleViewSample}
            handleGeneratePaySlip={handleGeneratePayslip}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewPayslipDialog;
