
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
          <Select defaultValue="all" onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="HR">Ressources Humaines</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Ventes</SelectItem>
              <SelectItem value="Operations">Opérations</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all" onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="onLeave">En congé</SelectItem>
              <SelectItem value="suspended">Suspendu</SelectItem>
            </SelectContent>
          </Select>
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
