
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { format } from 'date-fns';

interface LeaveFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: LeaveFilters) => void;
  currentFilters: LeaveFilters;
}

export interface LeaveFilters {
  status: string;
  type: string;
  department: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const LeaveFilterDialog: React.FC<LeaveFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const { departments } = useHrModuleData();
  const [filters, setFilters] = useState<LeaveFilters>(currentFilters);
  
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };
  
  const handleReset = () => {
    const defaultFilters = {
      status: 'all',
      type: 'all',
      department: 'all',
      startDate: undefined,
      endDate: undefined
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtres</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters({...filters, status: value})}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Refusé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type de congé</Label>
            <Select 
              value={filters.type} 
              onValueChange={(value) => setFilters({...filters, type: value})}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Congés payés">Congés payés</SelectItem>
                <SelectItem value="RTT">RTT</SelectItem>
                <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                <SelectItem value="Congé exceptionnel">Congé exceptionnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select 
              value={filters.department} 
              onValueChange={(value) => setFilters({...filters, department: value})}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments?.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <DatePicker 
              date={filters.startDate} 
              onSelect={(date) => setFilters({...filters, startDate: date})} 
              placeholder="Sélectionner une date"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <DatePicker 
              date={filters.endDate} 
              onSelect={(date) => setFilters({...filters, endDate: date})} 
              placeholder="Sélectionner une date"
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleApply}>
              Appliquer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
