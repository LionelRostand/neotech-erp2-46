
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Upload } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmployeeFilterProps {
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onImportClick: () => void;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  onDepartmentChange,
  onStatusChange,
  onSearchChange,
  onImportClick
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé..."
          className="pl-8"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select defaultValue="all" onValueChange={onDepartmentChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Département" />
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
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="onLeave">En congé</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          Importer
        </Button>
      </div>
    </div>
  );
};

export default EmployeeFilter;
