
import React from 'react';
import { CompanyFilters } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompaniesFiltersProps {
  filters: CompanyFilters;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const CompaniesFilters: React.FC<CompaniesFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Statut</label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => onFilterChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date début</label>
        <Input
          type="date"
          value={filters.startDate ? filters.startDate.toISOString().slice(0, 10) : ''}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date fin</label>
        <Input
          type="date"
          value={filters.endDate ? filters.endDate.toISOString().slice(0, 10) : ''}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />
      </div>
      <div className="md:col-span-3 flex justify-end">
        <Button variant="outline" onClick={onResetFilters}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};

export default CompaniesFilters;
