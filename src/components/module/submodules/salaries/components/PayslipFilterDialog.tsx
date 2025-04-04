
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export interface PayslipFilters {
  employeeId?: string;
  month?: string;
  year?: string | number;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
}

interface PayslipFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: PayslipFilters) => void;
  employees: { id: string; name: string }[];
  currentFilters?: PayslipFilters;
}

const PayslipFilterDialog: React.FC<PayslipFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  employees,
  currentFilters = {}
}) => {
  const [filters, setFilters] = useState<PayslipFilters>(currentFilters);
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - 2 + i);
  
  const handleReset = () => {
    setFilters({});
  };
  
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrer les fiches de paie</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employé</Label>
            <Select
              value={filters.employeeId}
              onValueChange={(value) => setFilters({...filters, employeeId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les employés</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mois</Label>
              <Select
                value={filters.month}
                onValueChange={(value) => setFilters({...filters, month: value})}
              >
                <SelectTrigger>
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
              <Label htmlFor="year">Année</Label>
              <Select
                value={filters.year?.toString()}
                onValueChange={(value) => setFilters({...filters, year: value})}
              >
                <SelectTrigger>
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minAmount">Montant minimum (€)</Label>
              <Input
                id="minAmount"
                type="number"
                value={filters.minAmount || ''}
                onChange={(e) => setFilters({
                  ...filters, 
                  minAmount: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="Min"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Montant maximum (€)</Label>
              <Input
                id="maxAmount"
                type="number"
                value={filters.maxAmount || ''}
                onChange={(e) => setFilters({
                  ...filters, 
                  maxAmount: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="Max"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger>
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button onClick={handleApply}>
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayslipFilterDialog;
