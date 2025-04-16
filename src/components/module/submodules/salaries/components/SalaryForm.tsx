
import React, { useState, useEffect } from 'react';
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
import { addPayslip } from '../services/salaryService';
import { addEmployeeDocument } from '@/components/module/submodules/employees/services/documentService';
import { toast } from 'sonner';

export const SalaryForm = () => {
  const { employees, contracts } = useHrModuleData();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [grossSalary, setGrossSalary] = useState('');
  const [netSalary, setNetSalary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get current date for default month selection
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    setMonth(currentMonth);
  }, []);
  
  // Update gross salary when employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      if (employee) {
        // Try to find the employee's contract to get salary information
        const employeeContract = contracts?.find(contract => contract.employeeId === employee.id);
        
        if (employeeContract && employeeContract.salary) {
          setGrossSalary(employeeContract.salary.toString());
          // Calculate estimated net salary (approximately 78% of gross in France)
          const estimatedNet = Math.round(Number(employeeContract.salary) * 0.78);
          setNetSalary(estimatedNet.toString());
        } else {
          // Default value if no contract found
          setGrossSalary('0');
          setNetSalary('0');
        }
      }
    }
  }, [selectedEmployee, employees, contracts]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee || !month || !year || !grossSalary || !netSalary) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      if (!employee) {
        toast.error('Employé non trouvé');
        setIsSubmitting(false);
        return;
      }
      
      const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      
      const monthName = monthNames[parseInt(month) - 1];
      const payslipTitle = `Fiche de paie - ${monthName} ${year}`;
      
      // Create the payslip
      const payslip = {
        id: `payslip-${Date.now()}`,
        employeeId: selectedEmployee,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        month: parseInt(month),
        year: parseInt(year),
        monthName,
        grossSalary: parseFloat(grossSalary),
        netSalary: parseFloat(netSalary),
        date: new Date().toISOString(),
        status: 'Émise'
      };
      
      // Add payslip to database
      await addPayslip(payslip);
      
      // Generate a simple PDF-like data for the document
      const payslipData = `
        FICHE DE PAIE
        -------------
        Employé: ${employee.firstName} ${employee.lastName}
        Mois: ${monthName} ${year}
        Salaire brut: ${grossSalary} €
        Salaire net: ${netSalary} €
        Date d'émission: ${new Date().toLocaleDateString('fr-FR')}
      `;
      
      // Create base64 representation (this is a simplified version)
      const base64Data = btoa(payslipData);
      
      // Create a document for the employee
      const document = {
        id: `payslip-doc-${Date.now()}`,
        name: payslipTitle,
        type: 'Fiche de paie',
        date: new Date().toISOString().split('T')[0],
        fileData: `data:text/plain;base64,${base64Data}`,
        fileType: 'text/plain',
        fileSize: base64Data.length.toString(),
        employeeId: selectedEmployee
      };
      
      // Add document to employee's profile
      await addEmployeeDocument(selectedEmployee, document);
      
      toast.success('Fiche de paie créée avec succès');
      
      // Reset form
      setSelectedEmployee('');
      setGrossSalary('');
      setNetSalary('');
      
    } catch (error) {
      console.error('Erreur lors de la création de la fiche de paie:', error);
      toast.error('Erreur lors de la création de la fiche de paie');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle fiche de paie</CardTitle>
          <CardDescription>
            Créer une nouvelle fiche de paie pour un employé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employé</Label>
            <Select
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un employé" />
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mois</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Salaire brut (€)</Label>
              <Input
                id="grossSalary"
                type="number"
                value={grossSalary}
                onChange={(e) => {
                  const value = e.target.value;
                  setGrossSalary(value);
                  // Calculate estimated net salary (approximately 78% of gross in France)
                  if (value) {
                    const estimatedNet = Math.round(Number(value) * 0.78);
                    setNetSalary(estimatedNet.toString());
                  } else {
                    setNetSalary('');
                  }
                }}
                placeholder="ex: 3000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="netSalary">Salaire net (€)</Label>
              <Input
                id="netSalary"
                type="number"
                value={netSalary}
                onChange={(e) => setNetSalary(e.target.value)}
                placeholder="ex: 2340"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Création en cours...' : 'Créer la fiche de paie'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
