
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export interface LeaveFilters {
  status: string;
  type: string;
  department: string;
  startDate?: Date;
  endDate?: Date;
}

interface LeaveFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: LeaveFilters) => void;
  currentFilters: LeaveFilters;
}

export const LeaveFilterDialog: React.FC<LeaveFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const { departments } = useHrModuleData();
  const [filters, setFilters] = useState<LeaveFilters>(currentFilters);

  const handleReset = () => {
    setFilters({
      status: 'all',
      type: 'all',
      department: 'all',
      startDate: undefined,
      endDate: undefined
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  // Mettre à jour les filtres
  const updateFilter = (key: keyof LeaveFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrer les demandes de congés</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => updateFilter('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Approuvé">Approuvé</SelectItem>
                  <SelectItem value="Refusé">Refusé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Type de congé</Label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => updateFilter('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Congés payés">Congés payés</SelectItem>
                  <SelectItem value="RTT">RTT</SelectItem>
                  <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                  <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                  <SelectItem value="Congé familial">Congé familial</SelectItem>
                  <SelectItem value="Congé maternité">Congé maternité</SelectItem>
                  <SelectItem value="Congé paternité">Congé paternité</SelectItem>
                  <SelectItem value="Congé exceptionnel">Congé exceptionnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Département</Label>
            <Select 
              value={filters.department} 
              onValueChange={(value) => updateFilter('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments?.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <DatePicker 
                date={filters.startDate} 
                onSelect={(date) => updateFilter('startDate', date)}
                placeholder="À partir de"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <DatePicker 
                date={filters.endDate} 
                onSelect={(date) => updateFilter('endDate', date)}
                placeholder="Jusqu'à"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
          <Button onClick={handleApply}>Appliquer les filtres</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
