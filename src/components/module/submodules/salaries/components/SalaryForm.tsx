
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { addPayslip } from '../services/salaryService';
import { Document } from '@/types/employee';

// Schema for form validation
const salaryFormSchema = z.object({
  employeeId: z.string().min(1, "Veuillez sélectionner un employé"),
  month: z.string().min(1, "Veuillez sélectionner un mois"),
  year: z.string().min(1, "Veuillez sélectionner une année"),
  grossSalary: z.string().min(1, "Le salaire brut est requis"),
  netSalary: z.string().min(1, "Le salaire net est requis"),
  status: z.string().default("Payé")
});

type SalaryFormValues = z.infer<typeof salaryFormSchema>;

export const SalaryForm = () => {
  const { employees, payslips } = useHrModuleData();
  const [selectedEmployeeGrossSalary, setSelectedEmployeeGrossSalary] = useState<string>('');
  
  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      employeeId: '',
      month: new Date().getMonth().toString(),
      year: new Date().getFullYear().toString(),
      grossSalary: '',
      netSalary: '',
      status: 'Payé'
    }
  });
  
  // Handle employee selection to auto-fill gross salary
  const handleEmployeeChange = (employeeId: string) => {
    form.setValue('employeeId', employeeId);
    
    // Find the selected employee
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    
    // If employee has salary information, populate the gross salary field
    if (selectedEmployee && selectedEmployee.salary) {
      const grossSalary = selectedEmployee.salary.toString();
      setSelectedEmployeeGrossSalary(grossSalary);
      form.setValue('grossSalary', grossSalary);
      
      // Calculate an estimated net salary (for example, 80% of gross)
      const estimatedNetSalary = (selectedEmployee.salary * 0.8).toFixed(2);
      form.setValue('netSalary', estimatedNetSalary);
    } else {
      setSelectedEmployeeGrossSalary('');
    }
  };
  
  // Calculate net salary based on gross salary (simplified example)
  const handleGrossSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const grossSalary = parseFloat(event.target.value);
    if (!isNaN(grossSalary)) {
      // Simple calculation of net salary (for example, 80% of gross)
      const netSalary = (grossSalary * 0.8).toFixed(2);
      form.setValue('netSalary', netSalary);
    }
  };
  
  const onSubmit = async (data: SalaryFormValues) => {
    try {
      // Get month name based on month number
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];
      const monthIndex = parseInt(data.month);
      const monthName = monthNames[monthIndex];
      
      // Find the employee to get their name
      const employee = employees.find(emp => emp.id === data.employeeId);
      const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
      
      // Create a payslip object
      const payslipData = {
        id: `payslip_${Date.now()}`,
        employeeId: data.employeeId,
        employeeName: employeeName,
        month: parseInt(data.month),
        year: parseInt(data.year),
        monthName,
        grossSalary: parseFloat(data.grossSalary),
        netSalary: parseFloat(data.netSalary),
        date: new Date().toISOString().split('T')[0],
        status: data.status
      };
      
      // Save the payslip
      const result = await addPayslip(payslipData);
      
      if (result) {
        // Create a document for this payslip to show in employee documents
        if (employee) {
          // Generate PDF data (this would actually generate a PDF in a real system)
          const pdfData = `data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G`;
          
          // Create the document with the proper fileSize as a number 
          const documentData: Document = {
            id: `payslip_doc_${Date.now()}`,
            name: `Fiche de paie - ${monthName} ${data.year}`,
            type: 'Fiche de paie',
            date: new Date().toISOString().split('T')[0],
            fileData: pdfData,
            fileType: 'application/pdf',
            fileSize: pdfData.length, // This is now properly typed as a number
            employeeId: data.employeeId
          };
          
          // In a real implementation, you would save this document to the employee's documents collection
          // Here you might call a function like: await addEmployeeDocument(data.employeeId, documentData);
        }
        
        // Reset the form
        form.reset();
        toast.success("Fiche de paie créée avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la création de la fiche de paie:", error);
      toast.error("Erreur lors de la création de la fiche de paie");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une fiche de paie</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={(value) => handleEmployeeChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un employé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees
                        .filter(emp => emp.status === 'active' || emp.status === 'Actif')
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mois</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un mois" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Janvier</SelectItem>
                        <SelectItem value="1">Février</SelectItem>
                        <SelectItem value="2">Mars</SelectItem>
                        <SelectItem value="3">Avril</SelectItem>
                        <SelectItem value="4">Mai</SelectItem>
                        <SelectItem value="5">Juin</SelectItem>
                        <SelectItem value="6">Juillet</SelectItem>
                        <SelectItem value="7">Août</SelectItem>
                        <SelectItem value="8">Septembre</SelectItem>
                        <SelectItem value="9">Octobre</SelectItem>
                        <SelectItem value="10">Novembre</SelectItem>
                        <SelectItem value="11">Décembre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une année" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(5)].map((_, i) => {
                          const year = new Date().getFullYear() - 2 + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grossSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire brut</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        onChange={(e) => {
                          field.onChange(e);
                          handleGrossSalaryChange(e);
                        }}
                        placeholder={selectedEmployeeGrossSalary || "Saisir le salaire brut"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="netSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire net</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="Saisir le salaire net"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Payé">Payé</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">Créer la fiche de paie</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
