
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, Search } from 'lucide-react';

interface EmployeeFilterProps {
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (term: string) => void;
  onImportClick?: () => void;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  onDepartmentChange,
  onStatusChange,
  onSearchChange,
  onImportClick
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un employé..."
              className="pl-8"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <select
            className="px-3 py-2 rounded-md border border-input bg-background"
            onChange={(e) => onDepartmentChange(e.target.value)}
            defaultValue="all"
          >
            <option value="all">Tous les départements</option>
            <option value="IT">IT</option>
            <option value="HR">Ressources Humaines</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Ventes</option>
            <option value="Operations">Opérations</option>
          </select>
          
          <select
            className="px-3 py-2 rounded-md border border-input bg-background"
            onChange={(e) => onStatusChange(e.target.value)}
            defaultValue="all"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="onLeave">En congé</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>
      
      {onImportClick && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onImportClick}>
            <FileUp className="h-4 w-4 mr-2" />
            Importer des employés
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeFilter;
