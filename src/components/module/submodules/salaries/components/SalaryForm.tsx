
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSalaryForm } from '../hooks/useSalaryForm';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
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
    handleSubmit
  } = useSalaryForm();

  // Utiliser directement useFirebaseCompanies pour un accès plus fiable aux données
  const { companies: firebaseCompanies, isLoading: fbLoading, error: fbError } = useFirebaseCompanies();
  
  // Combiner les deux sources de données, en préférant les données de Firebase
  const companies = firebaseCompanies.length > 0 ? firebaseCompanies : hookCompanies;
  const loadingState = isLoading || fbLoading;
  const errorState = error || fbError;

  console.log("Companies available:", companies); // Ajout d'un log pour vérifier les données

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="company-select">Nom de l'entreprise</Label>
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
        
        <div className="space-y-3">
          <Label htmlFor="employee-name">Nom de l'employé</Label>
          <Input 
            id="employee-name" 
            placeholder="Entrez le nom de l'employé"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label htmlFor="salary-amount">Montant du salaire</Label>
          <Input 
            id="salary-amount" 
            type="number"
            placeholder="Entrez le montant du salaire"
            value={salaryAmount}
            onChange={(e) => setSalaryAmount(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="payment-date">Date de paiement</Label>
          <Input 
            id="payment-date" 
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="payment-method">Méthode de paiement</Label>
          <Input 
            id="payment-method" 
            placeholder="Entrez la méthode de paiement"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="notes">Notes</Label>
        <Input 
          id="notes" 
          placeholder="Entrez des notes supplémentaires"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};
