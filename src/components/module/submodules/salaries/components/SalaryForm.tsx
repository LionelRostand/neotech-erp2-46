
import React from 'react';
import { useSalaryForm } from '../hooks/useSalaryForm';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import OvertimeSection from './OvertimeSection';

export const SalaryForm: React.FC = () => {
  const { employees, isLoading } = useHrModuleData();
  const {
    selectedEmployeeId,
    baseSalary,
    month,
    year,
    paymentMethod,
    notes,
    overtimeHours,
    overtimeRate,
    handleEmployeeSelect,
    setBaseSalary,
    setMonth,
    setYear,
    setPaymentMethod,
    setNotes,
    setOvertimeHours,
    setOvertimeRate,
    handleSubmit
  } = useSalaryForm();

  const months = [
    { value: 'Janvier', label: 'Janvier' },
    { value: 'Février', label: 'Février' },
    { value: 'Mars', label: 'Mars' },
    { value: 'Avril', label: 'Avril' },
    { value: 'Mai', label: 'Mai' },
    { value: 'Juin', label: 'Juin' },
    { value: 'Juillet', label: 'Juillet' },
    { value: 'Août', label: 'Août' },
    { value: 'Septembre', label: 'Septembre' },
    { value: 'Octobre', label: 'Octobre' },
    { value: 'Novembre', label: 'Novembre' },
    { value: 'Décembre', label: 'Décembre' }
  ];

  const paymentMethods = [
    { value: 'Virement', label: 'Virement bancaire' },
    { value: 'Chèque', label: 'Chèque' },
    { value: 'Espèces', label: 'Espèces' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center">Chargement des données...</div>
      ) : (
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sélection de l'employé */}
            <div className="space-y-2">
              <Label htmlFor="employee">Employé</Label>
              <select
                id="employee"
                className="w-full p-2 border rounded"
                value={selectedEmployeeId}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
              >
                <option value="">Sélectionnez un employé</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Salaire de base */}
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Salaire brut</Label>
              <Input
                id="baseSalary"
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(parseFloat(e.target.value))}
              />
              {baseSalary > 0 && (
                <p className="text-sm text-gray-500">
                  Net estimé: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(baseSalary * 0.78)}
                </p>
              )}
            </div>

            {/* Section des heures supplémentaires */}
            <OvertimeSection
              overtimeHours={overtimeHours}
              setOvertimeHours={setOvertimeHours}
              overtimeRate={overtimeRate}
              setOvertimeRate={setOvertimeRate}
            />

            {/* Mois */}
            <div className="space-y-2">
              <Label htmlFor="month">Mois</Label>
              <select
                id="month"
                className="w-full p-2 border rounded"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Sélectionnez un mois</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Année */}
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <select
                id="year"
                className="w-full p-2 border rounded"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Méthode de paiement */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Méthode de paiement</Label>
              <select
                id="paymentMethod"
                className="w-full p-2 border rounded"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Informations supplémentaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="button" 
              className="w-full md:w-auto" 
              onClick={handleSubmit}
            >
              Générer la fiche de paie
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
