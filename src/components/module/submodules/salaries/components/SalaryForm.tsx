
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSalaryForm } from '../hooks/useSalaryForm';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/patched-select";

export const SalaryForm: React.FC = () => {
  const {
    companies: hookCompanies,
    isLoading: isLoadingCompanies,
    error: errorCompanies,
    selectedCompanyId,
    setSelectedCompanyId,
    employeeName,
    setEmployeeName,
    salaryAmount,
    setSalaryAmount,
    paymentDate,
    setPaymentDate,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    handleSubmit
  } = useSalaryForm();

  // Utiliser directement useFirebaseCompanies pour un accès plus fiable aux données
  const { companies: firebaseCompanies, isLoading: fbLoading, error: fbError } = useFirebaseCompanies();
  
  // Accéder aux données des employés
  const { employees, isLoading: employeesLoading, error: employeesError } = useEmployeeData();
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [brutSalary, setBrutSalary] = useState<string>('');
  const [netSalary, setNetSalary] = useState<string>('');
  const [hoursWorked, setHoursWorked] = useState<string>('151.67'); // Durée légale mensuelle en France
  const [payPeriod, setPayPeriod] = useState<string>('');
  const [socialContributions, setSocialContributions] = useState<string>('');
  const [taxWithholding, setTaxWithholding] = useState<string>('');
  
  // Combiner les deux sources de données, en préférant les données de Firebase
  const companies = firebaseCompanies.length > 0 ? firebaseCompanies : hookCompanies;
  const loadingState = isLoadingCompanies || fbLoading;
  const errorState = errorCompanies || fbError;
  
  console.log("SalaryForm - Companies available:", companies.length);
  console.log("SalaryForm - Employees available:", employees.length);
  
  // Calculer automatiquement les contributions sociales et le salaire net
  useEffect(() => {
    if (brutSalary) {
      const brutAmount = parseFloat(brutSalary);
      // En France, les cotisations sociales représentent environ 22% du salaire brut pour la part salariale
      const contributions = Math.round(brutAmount * 0.22 * 100) / 100;
      setSocialContributions(contributions.toString());
      
      // Le salaire net est le salaire brut moins les cotisations sociales
      const net = Math.round((brutAmount - contributions) * 100) / 100;
      setNetSalary(net.toString());
      
      // Prélèvement à la source (environ 11% en moyenne, mais cela varie selon le taux personnalisé)
      const tax = Math.round(brutAmount * 0.11 * 100) / 100;
      setTaxWithholding(tax.toString());
    }
  }, [brutSalary]);

  // Gérer la sélection d'un employé
  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    
    if (selectedEmployee) {
      setEmployeeName(`${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
      
      // Si l'employé a une entreprise associée, la sélectionner
      if (selectedEmployee.companyId) {
        setSelectedCompanyId(selectedEmployee.companyId);
      }
    }
  };
  
  // Définir la période de paie par défaut au mois en cours
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    setPayPeriod(`${month < 10 ? '0' + month : month}/${year}`);
  }, []);
  
  // Soumettre le formulaire avec les données adaptées à la législation française
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId || !selectedCompanyId || !brutSalary || !payPeriod) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    toast.success("Fiche de paie générée avec succès");
    
    // Appeler le handler de soumission du hook avec les données enrichies
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="employee-select" className="font-medium">Employé <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Select 
              value={selectedEmployeeId} 
              onValueChange={handleEmployeeChange}
            >
              <SelectTrigger id="employee-select" className="w-full bg-white">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md z-50 min-w-[200px]">
                {employeesLoading ? (
                  <div className="p-2 text-center text-gray-500">Chargement des employés...</div>
                ) : employeesError ? (
                  <div className="p-2 text-center text-red-500">Erreur de chargement des employés</div>
                ) : employees.length === 0 ? (
                  <div className="p-2 text-center text-amber-500">Aucun employé disponible</div>
                ) : (
                  employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id} className="cursor-pointer hover:bg-gray-100">
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="company-select" className="font-medium">Entreprise <span className="text-red-500">*</span></Label>
          <div className="relative">
            <Select 
              value={selectedCompanyId} 
              onValueChange={setSelectedCompanyId}
            >
              <SelectTrigger id="company-select" className="w-full bg-white">
                <SelectValue placeholder="Sélectionner une entreprise" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md z-50 min-w-[200px]">
                {loadingState ? (
                  <div className="p-2 text-center text-gray-500">Chargement des entreprises...</div>
                ) : errorState ? (
                  <div className="p-2 text-center text-red-500">Erreur de chargement des entreprises</div>
                ) : companies.length === 0 ? (
                  <div className="p-2 text-center text-amber-500">Aucune entreprise disponible</div>
                ) : (
                  companies.map((company) => (
                    <SelectItem key={company.id} value={company.id} className="cursor-pointer hover:bg-gray-100">
                      {company.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="my-4" />
      
      <h3 className="text-lg font-medium mb-4">Informations de rémunération</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor="pay-period" className="font-medium">Période de paie <span className="text-red-500">*</span></Label>
          <Input 
            id="pay-period"
            placeholder="MM/YYYY"
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="hours-worked" className="font-medium">Heures travaillées</Label>
          <Input 
            id="hours-worked"
            type="number"
            step="0.01"
            placeholder="151.67"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
          />
          <p className="text-xs text-gray-500">Durée légale mensuelle : 151,67h</p>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="payment-date" className="font-medium">Date de paiement</Label>
          <Input 
            id="payment-date" 
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor="brut-salary" className="font-medium">Salaire brut <span className="text-red-500">*</span></Label>
          <Input 
            id="brut-salary" 
            type="number"
            step="0.01"
            placeholder="Entrez le salaire brut"
            value={brutSalary}
            onChange={(e) => setBrutSalary(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="social-contributions" className="font-medium">Cotisations sociales</Label>
          <Input 
            id="social-contributions" 
            type="number"
            step="0.01"
            placeholder="Cotisations calculées automatiquement"
            value={socialContributions}
            readOnly
            className="bg-gray-50"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="tax-withholding" className="font-medium">Prélèvement à la source</Label>
          <Input 
            id="tax-withholding" 
            type="number"
            step="0.01"
            placeholder="Prélèvement à la source"
            value={taxWithholding}
            onChange={(e) => setTaxWithholding(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="net-salary" className="font-medium">Salaire net</Label>
          <Input 
            id="net-salary" 
            type="number"
            step="0.01"
            placeholder="Net calculé automatiquement"
            value={netSalary}
            readOnly
            className="bg-gray-50"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="payment-method" className="font-medium">Méthode de paiement</Label>
          <Select 
            value={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <SelectTrigger id="payment-method" className="w-full bg-white">
              <SelectValue placeholder="Sélectionner la méthode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="virement">Virement bancaire</SelectItem>
              <SelectItem value="cheque">Chèque</SelectItem>
              <SelectItem value="especes">Espèces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="notes" className="font-medium">Notes complémentaires</Label>
        <Input 
          id="notes" 
          placeholder="Informations supplémentaires"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto">Générer la fiche de paie</Button>
      </div>
    </form>
  );
};
