
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

export interface LeaveFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  type: 'all' | 'paid' | 'rtt' | 'sick' | 'other';
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
  const [filters, setFilters] = useState<LeaveFilters>(currentFilters);

  const handleFilterChange = (key: keyof LeaveFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filtrer les demandes de congés</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
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
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="paid">Congés payés</SelectItem>
                <SelectItem value="rtt">RTT</SelectItem>
                <SelectItem value="sick">Maladie</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select
              value={filters.department}
              onValueChange={(value) => handleFilterChange('department', value)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                <SelectItem value="rh">Ressources Humaines</SelectItem>
                <SelectItem value="tech">Technique</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Ventes</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de début</Label>
              <DatePicker
                date={filters.startDate}
                onSelect={(date) => handleFilterChange('startDate', date)}
                placeholder="Début de période"
              />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <DatePicker
                date={filters.endDate}
                onSelect={(date) => handleFilterChange('endDate', date)}
                placeholder="Fin de période"
              />
            </div>
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

export default LeaveFilterDialog;
