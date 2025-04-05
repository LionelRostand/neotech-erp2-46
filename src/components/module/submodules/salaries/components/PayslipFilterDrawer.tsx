
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Employee } from '@/types/employee';
import { PayslipFiltersOptions } from './PayslipFilters';

interface PayslipFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: PayslipFiltersOptions) => void;
  employees: Employee[];
  currentFilters: PayslipFiltersOptions;
}

const PayslipFilterDrawer: React.FC<PayslipFilterDrawerProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  employees,
  currentFilters
}) => {
  const [filters, setFilters] = useState<PayslipFiltersOptions>(currentFilters);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentFilters.month && currentFilters.year 
      ? new Date(currentFilters.year, new Date(`${currentFilters.month} 1, ${currentFilters.year}`).getMonth(), 1)
      : undefined
  );

  useEffect(() => {
    setFilters(currentFilters);
    
    if (currentFilters.month && currentFilters.year) {
      setSelectedDate(new Date(currentFilters.year, new Date(`${currentFilters.month} 1, ${currentFilters.year}`).getMonth(), 1));
    } else {
      setSelectedDate(undefined);
    }
  }, [currentFilters]);

  const handleEmployeeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      employeeId: value === 'all' ? undefined : value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFilters(prev => ({
        ...prev,
        month: format(date, 'MMMM', { locale: fr }),
        year: date.getFullYear()
      }));
    } else {
      const { month, year, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleStatusChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      status: value === 'all' ? undefined : value
    }));
  };

  const handleDepartmentChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      department: value === 'all' ? undefined : value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {};
    setFilters(resetFilters);
    setSelectedDate(undefined);
  };

  // Extraire les départements uniques des employés
  const departments = Array.from(new Set(employees.map(emp => emp.department)))
    .filter(Boolean)
    .sort();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Employé</label>
            <Select 
              value={filters.employeeId || 'all'} 
              onValueChange={handleEmployeeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les employés</SelectItem>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {`${emp.firstName} ${emp.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              locale={fr}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Généré">Généré</SelectItem>
                <SelectItem value="Envoyé">Envoyé</SelectItem>
                <SelectItem value="Validé">Validé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Département</label>
            <Select 
              value={filters.department || 'all'} 
              onValueChange={handleDepartmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button onClick={handleApply}>
              Appliquer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PayslipFilterDrawer;
