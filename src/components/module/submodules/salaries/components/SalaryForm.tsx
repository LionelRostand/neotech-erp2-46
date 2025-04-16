import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeContract } from '@/hooks/useEmployeeContract';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrency } from '@/lib/formatters';

const formSchema = z.object({
  employeeId: z.string().min(1, { message: "Veuillez sélectionner un employé." }),
  baseSalary: z.string().min(1, { message: "Le salaire de base est requis." }),
  netSalary: z.string().optional(),
  grossSalary: z.string().optional(),
  deductions: z.string().optional(),
  allowances: z.string().optional(),
  paymentDate: z.string().min(1, { message: "La date de paiement est requise." }),
});

export const SalaryForm = () => {
  const { employees } = useEmployeeData();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { contract, salary } = useEmployeeContract(selectedEmployee?.id || '');
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      baseSalary: "",
      netSalary: "",
      grossSalary: "",
      deductions: "",
      allowances: "",
      paymentDate: "",
    },
  });
  
  const { setValue } = form;
  
  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId) || null;
    setSelectedEmployee(employee);
    
    if (employee) {
      // Set base salary from contract or employee record
      // Use the provided salary as a fallback if no specific employee salary is found
      const baseSalary = salary || 0;
      form.setValue('baseSalary', baseSalary.toString());
      
      setValue("employeeId", employeeId);
    }
  };
  
  const onSubmit = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Créer une fiche de paie</CardTitle>
          <CardDescription>
            Générez une nouvelle fiche de paie pour un employé.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employé</FormLabel>
                    <Select onValueChange={handleEmployeeSelect}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un employé" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees?.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire de base</FormLabel>
                    <FormControl>
                      <Input placeholder="Salaire de base" {...field} />
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
                      <Input placeholder="Salaire net" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grossSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire brut</FormLabel>
                    <FormControl>
                      <Input placeholder="Salaire brut" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Déductions</FormLabel>
                    <FormControl>
                      <Input placeholder="Déductions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allowances"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocations</FormLabel>
                    <FormControl>
                      <Input placeholder="Allocations" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de paiement</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Soumettre</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
