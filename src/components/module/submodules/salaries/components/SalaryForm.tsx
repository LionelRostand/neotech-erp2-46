
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';
import { savePaySlip } from '../services/salaryService';

export const SalaryForm: React.FC = () => {
  const { employees, companies, isLoading } = useHrModuleData();
  
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [grossSalary, setGrossSalary] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Generate years options (current year and 2 previous years)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  
  // French month names
  const months = [
    { value: '01', label: 'Janvier' },
    { value: '02', label: 'Février' },
    { value: '03', label: 'Mars' },
    { value: '04', label: 'Avril' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Juin' },
    { value: '07', label: 'Juillet' },
    { value: '08', label: 'Août' },
    { value: '09', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' }
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !selectedMonth || !selectedYear || !grossSalary) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      // Find the selected employee
      const employee = employees.find(emp => emp.id === selectedEmployee);
      
      if (!employee) {
        toast.error('Employé non trouvé');
        return;
      }
      
      // Calculate net salary (simplified)
      const grossAmount = parseFloat(grossSalary);
      const netAmount = grossAmount * 0.78; // Simple 22% deduction
      
      // Prepare data
      const payslipData = {
        employeeId: selectedEmployee,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        period: `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`,
        grossSalary: grossAmount,
        netSalary: netAmount,
        deductions: [
          { name: 'Cotisations sociales', amount: grossAmount * 0.22 }
        ],
        earnings: [
          { name: 'Salaire de base', amount: grossAmount }
        ],
        date: new Date().toISOString()
      };
      
      // Save the payslip
      const result = await savePaySlip(payslipData);
      
      if (result && result.id) {
        toast.success('Fiche de paie créée avec succès');
        // Reset form
        setSelectedEmployee('');
        setSelectedMonth('');
        setSelectedYear(currentYear.toString());
        setGrossSalary('');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la fiche de paie:', error);
      toast.error('Erreur lors de la création de la fiche de paie');
    } finally {
      setFormSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement des données...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle fiche de paie</CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous pour générer une fiche de paie pour un employé
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employé</Label>
            <Select 
              value={selectedEmployee} 
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger id="employee">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mois</Label>
              <Select 
                value={selectedMonth} 
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger id="month">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Select 
                value={selectedYear} 
                onValueChange={setSelectedYear}
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grossSalary">Salaire brut (€)</Label>
            <Input 
              id="grossSalary" 
              type="number" 
              step="0.01"
              min="0"
              value={grossSalary} 
              onChange={e => setGrossSalary(e.target.value)}
              placeholder="Exemple: 3500.00" 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={formSubmitting}>
            {formSubmitting ? 'Création en cours...' : 'Créer fiche de paie'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
