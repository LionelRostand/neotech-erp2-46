
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSalaryForm } from '@/components/module/submodules/salaries/hooks/useSalaryForm';
import { Employee } from '@/types/employee';

export const SalaryForm: React.FC = () => {
  const {
    companies,
    employees,
    isLoading,
    error,
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
    handleSubmit,
    resetForm
  } = useSalaryForm();

  // State pour gérer l'employé sélectionné
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [workedHours, setWorkedHours] = useState<string>("151.67"); // 35h/semaine × 52 semaines / 12 mois
  const [grossSalary, setGrossSalary] = useState<string>("");
  const [netSalary, setNetSalary] = useState<string>("");
  const [socialContributions, setSocialContributions] = useState<string>("");
  const [payPeriod, setPayPeriod] = useState<string>(`${new Date().getMonth() + 1}/${new Date().getFullYear()}`);

  // Effet pour filtrer les employés par entreprise sélectionnée
  useEffect(() => {
    if (selectedCompanyId && employees && employees.length > 0) {
      // Filtrer les employés appartenant à l'entreprise sélectionnée
      const filtered = employees.filter(emp => {
        // Vérifier si l'employé a une entreprise assignée
        if (typeof emp.company === 'string') {
          return emp.company === selectedCompanyId;
        } else if (emp.company && typeof emp.company === 'object') {
          return emp.company.id === selectedCompanyId;
        }
        return false;
      });
      setFilteredEmployees(filtered);
      console.log(`Filtered employees for company ${selectedCompanyId}: ${filtered.length}`);
    } else {
      setFilteredEmployees(employees || []);
      console.log(`No company selected, showing all ${employees?.length || 0} employees`);
    }
  }, [selectedCompanyId, employees]);

  // Effet pour calculer les cotisations sociales et le salaire net
  useEffect(() => {
    if (grossSalary) {
      const grossAmount = parseFloat(grossSalary);
      if (!isNaN(grossAmount)) {
        // Calcul simplifié des cotisations sociales (environ 23% du brut)
        const contributions = grossAmount * 0.23;
        setSocialContributions(contributions.toFixed(2));
        
        // Calcul du salaire net (brut - cotisations)
        const net = grossAmount - contributions;
        setNetSalary(net.toFixed(2));
      }
    }
  }, [grossSalary]);

  // Gérer la sélection d'un employé
  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees?.find(emp => emp.id === employeeId) || null;
    setSelectedEmployee(employee);
    
    if (employee) {
      setEmployeeName(`${employee.firstName} ${employee.lastName}`);
      
      // Si l'entreprise n'est pas déjà sélectionnée, la définir automatiquement
      if (!selectedCompanyId && employee.company) {
        // Vérifier le type de la propriété company
        if (typeof employee.company === 'string') {
          setSelectedCompanyId(employee.company);
        } else if (employee.company && typeof employee.company === 'object' && 'id' in employee.company) {
          setSelectedCompanyId(employee.company.id);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sélection de l'entreprise */}
      <div>
        <Label htmlFor="company">Entreprise</Label>
        <Select 
          value={selectedCompanyId} 
          onValueChange={setSelectedCompanyId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une entreprise" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Chargement...</SelectItem>
            ) : error ? (
              <SelectItem value="error" disabled>Erreur de chargement</SelectItem>
            ) : companies && companies.length > 0 ? (
              companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>Aucune entreprise disponible</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Sélection de l'employé */}
      <div>
        <Label htmlFor="employee">Employé</Label>
        <Select onValueChange={handleEmployeeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un employé" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Chargement...</SelectItem>
            ) : filteredEmployees && filteredEmployees.length > 0 ? (
              filteredEmployees.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - {employee.position}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="empty" disabled>
                {selectedCompanyId 
                  ? "Aucun employé pour cette entreprise" 
                  : "Veuillez d'abord sélectionner une entreprise"}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Période de paie */}
      <div>
        <Label htmlFor="payPeriod">Période de paie</Label>
        <Input
          id="payPeriod"
          value={payPeriod}
          onChange={(e) => setPayPeriod(e.target.value)}
          placeholder="MM/YYYY"
        />
      </div>

      {/* Heures travaillées */}
      <div>
        <Label htmlFor="workedHours">Heures travaillées (mensuel)</Label>
        <Input
          id="workedHours"
          type="number"
          value={workedHours}
          onChange={(e) => setWorkedHours(e.target.value)}
          placeholder="151.67"
        />
        <p className="text-xs text-gray-500 mt-1">Base 35h/semaine: 151.67h/mois</p>
      </div>

      {/* Salaire brut */}
      <div>
        <Label htmlFor="grossSalary">Salaire brut (€)</Label>
        <Input
          id="grossSalary"
          value={grossSalary}
          onChange={(e) => setGrossSalary(e.target.value)}
          type="number"
          placeholder="Montant brut"
        />
      </div>

      {/* Cotisations sociales (calculées automatiquement) */}
      <div>
        <Label htmlFor="socialContributions">Cotisations sociales (€)</Label>
        <Input
          id="socialContributions"
          value={socialContributions}
          readOnly
          type="text"
          className="bg-gray-50"
        />
        <p className="text-xs text-gray-500 mt-1">Calculé automatiquement (23% du brut)</p>
      </div>

      {/* Salaire net (calculé automatiquement) */}
      <div>
        <Label htmlFor="netSalary">Salaire net (€)</Label>
        <Input
          id="netSalary"
          value={netSalary}
          onChange={(e) => setNetSalary(e.target.value)}
          type="number"
          placeholder="Montant net"
        />
      </div>

      {/* Date de paiement */}
      <div>
        <Label htmlFor="paymentDate">Date de paiement</Label>
        <Input
          id="paymentDate"
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </div>

      {/* Méthode de paiement */}
      <div>
        <Label htmlFor="paymentMethod">Méthode de paiement</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une méthode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="virement">Virement bancaire</SelectItem>
            <SelectItem value="cheque">Chèque</SelectItem>
            <SelectItem value="especes">Espèces</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes supplémentaires..."
          className="min-h-[100px]"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={resetForm}>
          Réinitialiser
        </Button>
        <Button type="submit">
          Générer la fiche de paie
        </Button>
      </div>
    </form>
  );
};
