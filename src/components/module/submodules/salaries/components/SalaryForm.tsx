
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { toast } from 'sonner';
import { Employee, Document } from '@/types/employee';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';

export const SalaryForm = () => {
  // Form state
  const [employeeId, setEmployeeId] = useState('');
  const [grossSalary, setGrossSalary] = useState('');
  const [netSalary, setNetSalary] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [paymentDate, setPaymentDate] = useState('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState<number>(0);
  
  // Fetch employees data
  const { employees, isLoading } = useEmployeeData();
  
  // Handle contract data for selected employee
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Use custom hook for employee contract data
  const { contract, salary } = selectedEmployee ? useEmployeeContract(selectedEmployee.id) : { contract: null, salary: 0 };
  
  // Update selected employee when employeeId changes
  useEffect(() => {
    if (employeeId && employees) {
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee) {
        setSelectedEmployee(employee);
        // Use contract salary or employee salary property if available, otherwise default to 0
        const employeeSalary = employee.salary || salary || 0;
        setGrossSalary(employeeSalary.toString());
        // Calculate estimated net salary (roughly 77% of gross)
        const estimatedNet = Math.round(employeeSalary * 0.77);
        setNetSalary(estimatedNet.toString());
      }
    }
  }, [employeeId, employees, salary]);
  
  // Set current month on component mount
  useEffect(() => {
    const currentDate = new Date();
    setMonth((currentDate.getMonth() + 1).toString().padStart(2, '0')); // Add 1 because getMonth is zero-based
    setPaymentDate(currentDate.toISOString().split('T')[0]);
  }, []);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type);
      setFileSize(file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileData(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !grossSalary || !netSalary || !month || !year || !paymentDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      // Create document object
      const payslipDocument: Document = {
        id: `payslip_${employeeId}_${year}_${month}`,
        name: `Fiche de paie - ${month}/${year}`,
        type: 'Fiche de paie',
        date: paymentDate,
        fileData: fileData || '',
        fileType: fileType || 'application/pdf',
        fileSize: fileSize,
        employeeId: employeeId
      };
      
      // Simulate payslip generation
      toast.success('Fiche de paie générée avec succès');
      
      // Reset form
      setFileData(null);
      setFileName('');
      
    } catch (error) {
      console.error('Erreur lors de la génération de la fiche de paie:', error);
      toast.error('Erreur lors de la génération de la fiche de paie');
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
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee selection */}
            <div className="space-y-2">
              <Label htmlFor="employee">Employé</Label>
              <Select
                value={employeeId}
                onValueChange={setEmployeeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : employees && employees.length > 0 ? (
                    employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>Aucun employé disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {/* Period selection */}
            <div className="space-y-2">
              <Label>Période</Label>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={month}
                  onValueChange={setMonth}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(m => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="Année"
                />
              </div>
            </div>
            
            {/* Gross salary */}
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Salaire brut (€)</Label>
              <Input
                id="grossSalary"
                type="number"
                min="0"
                step="0.01"
                value={grossSalary}
                onChange={e => {
                  setGrossSalary(e.target.value);
                  // Calculate estimated net salary (roughly 77% of gross)
                  const gross = parseFloat(e.target.value) || 0;
                  const estimatedNet = Math.round(gross * 0.77);
                  setNetSalary(estimatedNet.toString());
                }}
                placeholder="Salaire brut"
              />
            </div>
            
            {/* Net salary */}
            <div className="space-y-2">
              <Label htmlFor="netSalary">Salaire net (€)</Label>
              <Input
                id="netSalary"
                type="number"
                min="0"
                step="0.01"
                value={netSalary}
                onChange={e => setNetSalary(e.target.value)}
                placeholder="Salaire net"
              />
            </div>
            
            {/* Payment date */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date de paiement</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
              />
            </div>
            
            {/* File upload */}
            <div className="space-y-2">
              <Label htmlFor="payslipFile">Fichier PDF (optionnel)</Label>
              <Input
                id="payslipFile"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {fileName && (
                <p className="text-xs text-muted-foreground mt-1">
                  {fileName}
                </p>
              )}
            </div>
          </div>
          
          {/* Submit button */}
          <Button type="submit" className="w-full md:w-auto">
            Générer la fiche de paie
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SalaryForm;
