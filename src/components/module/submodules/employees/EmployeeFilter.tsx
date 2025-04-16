
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

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
  const { userData } = useAuth();
  const isAdmin = userData?.email === 'admin@neotech-consulting.com' || userData?.role === 'admin';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">Rechercher</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un employé..."
            className="pl-8"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="w-full md:w-48 space-y-1">
        <p className="text-sm font-medium">Département</p>
        <Select defaultValue="all" onValueChange={onDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les départements" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="RH">RH</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-48 space-y-1">
        <p className="text-sm font-medium">Statut</p>
        <Select defaultValue="all" onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="Actif">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="Inactif">Inactif</SelectItem>
            <SelectItem value="onLeave">En congé</SelectItem>
            <SelectItem value="En congé">En congé</SelectItem>
            <SelectItem value="Suspendu">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isAdmin && (
        <div className="flex-shrink-0">
          <Button variant="outline" onClick={onImportClick}>
            Importer
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeFilter;
