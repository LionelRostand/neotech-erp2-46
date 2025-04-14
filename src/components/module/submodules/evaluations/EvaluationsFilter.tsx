
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterValues {
  status: string;
}

interface EvaluationsFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: FilterValues;
  onApplyFilters: (filters: FilterValues) => void;
}

const EvaluationsFilter: React.FC<EvaluationsFilterProps> = ({ 
  open, 
  onOpenChange, 
  currentFilters,
  onApplyFilters
}) => {
  const [status, setStatus] = useState(currentFilters.status || '');

  const handleApplyFilters = () => {
    onApplyFilters({ status });
    onOpenChange(false);
  };

  const handleReset = () => {
    setStatus('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrer les évaluations</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="Planifiée">Planifiée</SelectItem>
                <SelectItem value="Complétée">Complétée</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
          <Button onClick={handleApplyFilters}>
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationsFilter;
