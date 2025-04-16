
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { PayslipFiltersOptions } from './PayslipFilters';
import { Employee } from '@/types/employee';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface PayslipFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: PayslipFiltersOptions) => void;
  employees?: Employee[];
  currentFilters: PayslipFiltersOptions;
}

const PayslipFilterDrawer: React.FC<PayslipFilterDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  employees = [],
  currentFilters
}) => {
  const [localFilters, setLocalFilters] = useState<PayslipFiltersOptions>(currentFilters);
  const { employees: empData, isLoading } = useHrModuleData();
  
  // Use provided employees or fetch from hook
  const employeesToUse = employees.length > 0 ? employees : empData;

  // Reset local filters when drawer opens or current filters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [isOpen, currentFilters]);

  const handleFilterChange = (key: keyof PayslipFiltersOptions, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    setLocalFilters({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/25 flex justify-end">
      <div className="w-full max-w-sm bg-white h-full overflow-y-auto shadow-lg animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filtrer les fiches de paie</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Filtre par employé */}
          <div className="space-y-2">
            <Label htmlFor="employee-filter">Employé</Label>
            <select
              id="employee-filter"
              className="w-full p-2 border rounded"
              value={localFilters.employeeId || ''}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
            >
              <option value="">Tous les employés</option>
              {isLoading ? (
                <option disabled>Chargement des employés...</option>
              ) : (
                employeesToUse.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Filtre par année */}
          <div className="space-y-2">
            <Label htmlFor="year-filter">Année</Label>
            <select
              id="year-filter"
              className="w-full p-2 border rounded"
              value={localFilters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">Toutes les années</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par mois */}
          <div className="space-y-2">
            <Label htmlFor="month-filter">Mois</Label>
            <select
              id="month-filter"
              className="w-full p-2 border rounded"
              value={localFilters.month || ''}
              onChange={(e) => handleFilterChange('month', e.target.value)}
            >
              <option value="">Tous les mois</option>
              {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons d'action */}
          <div className="pt-4 flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleResetFilters}
            >
              Réinitialiser
            </Button>
            <Button 
              className="flex-1"
              onClick={handleApplyFilters}
            >
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipFilterDrawer;
