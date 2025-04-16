
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export interface PayslipFiltersOptions {
  employeeId?: string;
  year?: number | null;
  month?: string;
  startDate?: string;
  endDate?: string;
}

interface FormattedEmployee {
  id: string;
  name: string;
}

interface PayslipFiltersProps {
  employees?: FormattedEmployee[];
  onApplyFilters: (filters: PayslipFiltersOptions) => void;
  currentFilters: PayslipFiltersOptions;
}

const PayslipFilters: React.FC<PayslipFiltersProps> = ({
  employees = [],
  onApplyFilters,
  currentFilters
}) => {
  const { employees: empData, isLoading } = useHrModuleData();
  
  // Generate formatted employee list from useHrModuleData if none provided
  const employeesToUse = employees.length > 0 ? employees : empData.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`
  }));

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const clearFilter = (filterName: keyof PayslipFiltersOptions) => {
    const newFilters = { ...currentFilters };
    if (filterName in newFilters) {
      delete newFilters[filterName];
      onApplyFilters(newFilters);
    }
  };

  const getEmployeeName = (id: string) => {
    const employee = employeesToUse.find(emp => emp.id === id);
    return employee ? employee.name : 'Employé inconnu';
  };

  // Show active filters
  const hasActiveFilters = Object.keys(currentFilters).some(key => {
    const value = currentFilters[key as keyof PayslipFiltersOptions];
    return value !== undefined && value !== null && value !== '';
  });

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {currentFilters.employeeId && (
        <Badge variant="outline" className="flex items-center gap-1">
          Employé: {getEmployeeName(currentFilters.employeeId)}
          <button
            type="button"
            onClick={() => clearFilter('employeeId')}
            className="ml-1 rounded-full hover:bg-gray-200 p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {currentFilters.year && (
        <Badge variant="outline" className="flex items-center gap-1">
          Année: {currentFilters.year}
          <button
            type="button"
            onClick={() => clearFilter('year')}
            className="ml-1 rounded-full hover:bg-gray-200 p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {currentFilters.month && (
        <Badge variant="outline" className="flex items-center gap-1">
          Mois: {currentFilters.month}
          <button
            type="button"
            onClick={() => clearFilter('month')}
            className="ml-1 rounded-full hover:bg-gray-200 p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {(currentFilters.startDate || currentFilters.endDate) && (
        <Badge variant="outline" className="flex items-center gap-1">
          Période: {currentFilters.startDate && currentFilters.startDate}
          {currentFilters.startDate && currentFilters.endDate && ' - '}
          {currentFilters.endDate && currentFilters.endDate}
          <button
            type="button"
            onClick={() => {
              clearFilter('startDate');
              clearFilter('endDate');
            }}
            className="ml-1 rounded-full hover:bg-gray-200 p-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onApplyFilters({})}
          className="text-xs"
        >
          Effacer tous les filtres
        </Button>
      )}
    </div>
  );
};

export default PayslipFilters;
