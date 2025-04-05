
import React, { useState } from 'react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
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
  employees = [],
  currentFilters = {}
}) => {
  const [filters, setFilters] = useState<PayslipFiltersOptions>(currentFilters);
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
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
    onClose();
  };
  
  const resetFilters = () => {
    setFilters({});
    onApplyFilters({});
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle>Filtrer les fiches de paie</DrawerTitle>
          <DrawerDescription>
            Appliquez des filtres pour affiner votre recherche
          </DrawerDescription>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-4 py-6 space-y-6 overflow-y-auto">
          <div className="space-y-4">
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
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Généré">Généré</SelectItem>
                  <SelectItem value="Envoyé">Envoyé</SelectItem>
                  <SelectItem value="Validé">Validé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mois</label>
              <Select 
                value={filters.month || 'all'} 
                onValueChange={(value) => handleFilterChange('month', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
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
                value={(filters.year?.toString()) || 'all'} 
                onValueChange={(value) => handleFilterChange('year', value === 'all' ? undefined : parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
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
                value={filters.employeeId || 'all'} 
                onValueChange={(value) => handleFilterChange('employeeId', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
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
                value={filters.department || 'all'} 
                onValueChange={(value) => handleFilterChange('department', value === 'all' ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department || 'default'} value={department || 'default'}>
                      {department || 'Non spécifié'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="border-t pt-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Button onClick={applyFilters}>
              Appliquer les filtres
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PayslipFilterDrawer;
