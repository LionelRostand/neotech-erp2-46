
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface EvaluationsFilterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

const EvaluationsFilter: React.FC<EvaluationsFilterProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
}) => {
  const { departments } = useHrModuleData();
  const [filters, setFilters] = useState({
    employee: '',
    department: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    scoreMin: '',
    scoreMax: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setFilters({
      employee: '',
      department: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      scoreMin: '',
      scoreMax: '',
    });
    onApplyFilters({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrer les évaluations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="employee">Nom de l'employé</Label>
            <Input
              id="employee"
              name="employee"
              placeholder="Rechercher un employé"
              value={filters.employee}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select
                value={filters.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Planifiée">Planifiée</SelectItem>
                  <SelectItem value="Complétée">Complétée</SelectItem>
                  <SelectItem value="Annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date de début</Label>
              <Input
                id="dateFrom"
                name="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTo">Date de fin</Label>
              <Input
                id="dateTo"
                name="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scoreMin">Score minimum</Label>
              <Input
                id="scoreMin"
                name="scoreMin"
                type="number"
                placeholder="0"
                value={filters.scoreMin}
                onChange={handleChange}
                min={0}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scoreMax">Score maximum</Label>
              <Input
                id="scoreMax"
                name="scoreMax"
                type="number"
                placeholder="100"
                value={filters.scoreMax}
                onChange={handleChange}
                min={0}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleResetFilters}>
            Réinitialiser
          </Button>
          <Button type="button" onClick={handleApplyFilters}>
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationsFilter;
