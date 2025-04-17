
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
import { toast } from 'sonner';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import SalaryCalculationCard from './SalaryCalculationCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { PaySlip, PaySlipDetail } from '@/types/payslip';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

const formSchema = z.object({
  employeeId: z.string().min(1, { message: "Veuillez sélectionner un employé." }),
  companyId: z.string().min(1, { message: "Veuillez sélectionner une entreprise." }),
  baseSalary: z.coerce.number().min(0, { message: "Le salaire de base doit être un nombre positif." }),
  hoursWorked: z.coerce.number().min(0, { message: "Les heures travaillées doivent être un nombre positif." }),
  overtimeHours: z.coerce.number().min(0, { message: "Les heures supplémentaires doivent être un nombre positif." }),
  overtimeRate: z.coerce.number().min(0, { message: "Le taux des heures supplémentaires doit être un nombre positif." }),
  paymentDate: z.string().min(1, { message: "La date de paiement est requise." }),
  period: z.string().min(1, { message: "La période de paie est requise." }),
  includeDefaultDeductions: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export const SalaryForm = () => {
  const { employees } = useEmployeeData();
  const { companies } = useFirebaseCompanies();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const { contract, salary } = useEmployeeContract(selectedEmployee?.id || '');
  const { leaveBalances } = useLeaveBalances(selectedEmployee?.id);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPayslip, setCurrentPayslip] = useState<PaySlip | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      companyId: "",
      baseSalary: 0,
      hoursWorked: 151.67, // Standard monthly hours in France
      overtimeHours: 0,
      overtimeRate: 25, // 25% by default according to French labor code
      paymentDate: new Date().toISOString().split('T')[0],
      period: `${new Date().toLocaleString('fr-FR', {month: 'long', year: 'numeric'})}`,
      includeDefaultDeductions: true,
    },
  });
  
  const { setValue, watch, handleSubmit } = form;
  const formValues = watch();
  
  // Handle employee selection
  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId) || null;
    setSelectedEmployee(employee);
    
    if (employee) {
      // Set base salary from contract
      const employeeSalary = salary || 0;
      setValue("baseSalary", employeeSalary);
      setValue("employeeId", employeeId);
      
      // If employee has a company, select it
      if (employee.company && typeof employee.company === 'string') {
        setValue("companyId", employee.company);
        setSelectedCompany(employee.company);
      }
    }
  };
  
  // Handle company selection
  const handleCompanySelect = (companyId: string) => {
    setValue("companyId", companyId);
    setSelectedCompany(companyId);
  };
  
  // Generate payslip preview
  const generatePayslipPreview = () => {
    const values = form.getValues();
    
    // Find selected company data
    const company = companies.find(c => c.id === values.companyId);
    
    // Calculate salary components
    const hourlyRate = values.baseSalary / values.hoursWorked;
    const overtimePay = values.overtimeHours * hourlyRate * (1 + values.overtimeRate / 100);
    const grossSalary = values.baseSalary + overtimePay;
    
    // French social contribution rates
    const healthInsurance = grossSalary * 0.073; // 7.3%
    const retirementBasic = grossSalary * 0.0690; // 6.90%
    const retirementComplementary = grossSalary * 0.0240; // 2.40%
    const unemploymentInsurance = grossSalary * 0.0240; // 2.40%
    const otherContributions = grossSalary * 0.0295; // 2.95% (other contributions)
    
    const totalDeductions = healthInsurance + retirementBasic + retirementComplementary + 
                            unemploymentInsurance + otherContributions;
    const netSalary = grossSalary - totalDeductions;
    
    // Find leave balances
    const congesPayes = leaveBalances?.find(balance => balance.type === 'Congés payés');
    const rtt = leaveBalances?.find(balance => balance.type === 'RTT');
    
    // Create payslip details
    const details: PaySlipDetail[] = [
      { label: 'Salaire de base', amount: values.baseSalary, type: 'earning', base: `${values.hoursWorked} h`, rate: `${hourlyRate.toFixed(2)} €/h` },
    ];
    
    if (values.overtimeHours > 0) {
      details.push({ 
        label: 'Heures supplémentaires', 
        amount: overtimePay, 
        type: 'earning', 
        base: `${values.overtimeHours} h`, 
        rate: `${hourlyRate.toFixed(2)} €/h (+${values.overtimeRate}%)` 
      });
    }
    
    if (values.includeDefaultDeductions) {
      details.push(
        { label: 'Sécurité sociale - Maladie', amount: healthInsurance, type: 'deduction', base: `${grossSalary.toFixed(2)} €`, rate: '7.30%' },
        { label: 'Retraite sécurité sociale', amount: retirementBasic, type: 'deduction', base: `${grossSalary.toFixed(2)} €`, rate: '6.90%' },
        { label: 'Retraite complémentaire', amount: retirementComplementary, type: 'deduction', base: `${grossSalary.toFixed(2)} €`, rate: '2.40%' },
        { label: 'Assurance chômage', amount: unemploymentInsurance, type: 'deduction', base: `${grossSalary.toFixed(2)} €`, rate: '2.40%' },
        { label: 'Autres cotisations', amount: otherContributions, type: 'deduction', base: `${grossSalary.toFixed(2)} €`, rate: '2.95%' }
      );
    }
    
    // Create payslip object
    const payslip: PaySlip = {
      id: Math.random().toString(36).substring(7),
      employeeId: selectedEmployee?.id || '',
      employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
      period: values.period,
      details,
      grossSalary,
      totalDeductions,
      netSalary,
      date: values.paymentDate,
      status: 'Généré',
      hoursWorked: values.hoursWorked + values.overtimeHours,
      employerName: company?.name || 'Entreprise',
      employerAddress: company?.address ? 
        `${company.address.street || ''}, ${company.address.postalCode || ''} ${company.address.city || ''}` : 
        '',
      employerSiret: company?.siret || '',
      conges: congesPayes ? {
        acquired: congesPayes.total,
        taken: congesPayes.used,
        balance: congesPayes.remaining
      } : {
        acquired: 25,
        taken: 0,
        balance: 25
      },
      rtt: rtt ? {
        acquired: rtt.total,
        taken: rtt.used,
        balance: rtt.remaining
      } : {
        acquired: 12,
        taken: 0,
        balance: 12
      },
      employee: {
        firstName: selectedEmployee?.firstName || '',
        lastName: selectedEmployee?.lastName || '',
        employeeId: selectedEmployee?.id || '',
        role: selectedEmployee?.position || selectedEmployee?.role || '',
        socialSecurityNumber: selectedEmployee?.socialSecurityNumber || '',
        startDate: selectedEmployee?.startDate || '',
      },
      paymentMethod: 'Virement bancaire',
      paymentDate: values.paymentDate,
    };
    
    setCurrentPayslip(payslip);
    setShowPreview(true);
  };
  
  // Submit form and save payslip
  const onSubmit = async (values: FormValues) => {
    if (!currentPayslip) {
      generatePayslipPreview();
      return;
    }
    
    try {
      // Save to Firestore
      await addDocument(COLLECTIONS.HR.PAYSLIPS, currentPayslip);
      toast.success("Fiche de paie créée avec succès");
      
      // Reset form and state
      form.reset();
      setSelectedEmployee(null);
      setCurrentPayslip(null);
      setShowPreview(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la fiche de paie:", error);
      toast.error("Erreur lors de la création de la fiche de paie");
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Créer une fiche de paie</CardTitle>
          <CardDescription>
            Générez une nouvelle fiche de paie conforme au Code du travail français
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(showPreview ? onSubmit : generatePayslipPreview)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Employee selection */}
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employé</FormLabel>
                      <Select 
                        onValueChange={handleEmployeeSelect} 
                        value={field.value}
                      >
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
                
                {/* Company selection */}
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise</FormLabel>
                      <Select 
                        onValueChange={handleCompanySelect} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une entreprise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies?.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Salary information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="baseSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire brut mensuel (€)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hoursWorked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heures travaillées</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        151.67h est le standard mensuel en France (35h/semaine)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Overtime information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="overtimeHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heures supplémentaires</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="overtimeRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Majoration heures sup. (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        25% pour les 8 premières heures, 50% au-delà
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Period and payment information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Période de paie</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Ex: Mai 2025, Avril 2025, etc.
                      </FormDescription>
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
              </div>
              
              {/* Additional options */}
              <FormField
                control={form.control}
                name="includeDefaultDeductions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Inclure les cotisations sociales standard
                      </FormLabel>
                      <FormDescription>
                        Sécurité sociale, retraite, chômage, etc.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                {showPreview ? (
                  <>
                    <Button type="button" variant="outline" onClick={() => setShowPreview(false)}>
                      Modifier
                    </Button>
                    <Button type="submit">
                      Enregistrer la fiche de paie
                    </Button>
                  </>
                ) : (
                  <Button type="submit">
                    Générer l'aperçu
                  </Button>
                )}
              </div>
            </form>
          </Form>
          
          {/* Preview section */}
          {showPreview && currentPayslip && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-bold text-lg mb-4">Aperçu de la fiche de paie</h3>
              
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Employeur</h4>
                  <p>{currentPayslip.employerName}</p>
                  <p>{currentPayslip.employerAddress}</p>
                  <p>SIRET: {currentPayslip.employerSiret}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Employé</h4>
                  <p>{currentPayslip.employeeName}</p>
                  <p>Poste: {currentPayslip.employee?.role}</p>
                  <p>N° SS: {currentPayslip.employee?.socialSecurityNumber}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Période et paiement</h4>
                <p>Période: {currentPayslip.period}</p>
                <p>Date de paiement: {new Date(currentPayslip.paymentDate || '').toLocaleDateString('fr-FR')}</p>
                <p>Méthode: {currentPayslip.paymentMethod}</p>
              </div>
              
              <SalaryCalculationCard 
                details={currentPayslip.details}
                grossSalary={currentPayslip.grossSalary}
                totalDeductions={currentPayslip.totalDeductions}
                netSalary={currentPayslip.netSalary}
              />
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Solde de congés payés</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>Acquis: {currentPayslip.conges?.acquired || 0} jours</div>
                    <div>Pris: {currentPayslip.conges?.taken || 0} jours</div>
                    <div>Solde: {currentPayslip.conges?.balance || 0} jours</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Solde RTT</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>Acquis: {currentPayslip.rtt?.acquired || 0} jours</div>
                    <div>Pris: {currentPayslip.rtt?.taken || 0} jours</div>
                    <div>Solde: {currentPayslip.rtt?.balance || 0} jours</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
