
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';

export interface PayslipFiltersOptions {
  status?: string;
  month?: string;
  year?: number;
  employeeId?: string;
  department?: string;
}

interface PayslipFiltersProps {
  employees: Employee[];
  onApplyFilters: (filters: PayslipFiltersOptions) => void;
  currentFilters: PayslipFiltersOptions;
}

const PayslipFilters: React.FC<PayslipFiltersProps> = ({
  employees,
  onApplyFilters,
  currentFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<PayslipFiltersOptions>(currentFilters || {});
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'Généré', label: 'Généré' },
    { value: 'Envoyé', label: 'Envoyé' },
    { value: 'Validé', label: 'Validé' }
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i);
  
  // Create a unique list of departments
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  
  const handleFilterChange = (key: keyof PayslipFiltersOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const applyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };
  
  const resetFilters = () => {
    setFilters({});
    onApplyFilters({});
    setIsOpen(false);
  };
  
  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(Boolean).length;
  };
  
  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
            {getActiveFiltersCount() > 0 && (
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant="secondary">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4">
          <div className="space-y-4">
            <h3 className="font-medium">Filtres</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select 
                value={filters.status || 'all'} 
                onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mois</label>
              <Select 
                value={filters.month || ''} 
                onValueChange={(value) => handleFilterChange('month', value || undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les mois</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Année</label>
              <Select 
                value={filters.year?.toString() || ''} 
                onValueChange={(value) => handleFilterChange('year', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les années</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Employé</label>
              <Select 
                value={filters.employeeId || ''} 
                onValueChange={(value) => handleFilterChange('employeeId', value || undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les employés</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Département</label>
              <Select 
                value={filters.department || ''} 
                onValueChange={(value) => handleFilterChange('department', value || undefined)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les départements</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department || ''}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser
              </Button>
              <Button onClick={applyFilters}>
                Appliquer
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.status && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Status: {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  handleFilterChange('status', undefined);
                  onApplyFilters({...filters, status: undefined});
                }}
              />
            </Badge>
          )}
          
          {filters.month && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Mois: {filters.month}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  handleFilterChange('month', undefined);
                  onApplyFilters({...filters, month: undefined});
                }}
              />
            </Badge>
          )}
          
          {filters.year && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Année: {filters.year}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  handleFilterChange('year', undefined);
                  onApplyFilters({...filters, year: undefined});
                }}
              />
            </Badge>
          )}
          
          {filters.employeeId && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Employé: {employees.find(e => e.id === filters.employeeId)?.firstName} {employees.find(e => e.id === filters.employeeId)?.lastName}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  handleFilterChange('employeeId', undefined);
                  onApplyFilters({...filters, employeeId: undefined});
                }}
              />
            </Badge>
          )}
          
          {filters.department && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Département: {filters.department}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  handleFilterChange('department', undefined);
                  onApplyFilters({...filters, department: undefined});
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PayslipFilters;
