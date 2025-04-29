
import React, { useEffect, useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Upload } from 'lucide-react';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface EmployeeFilterProps {
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: string) => void;
  onSearchChange: (search: string) => void;
  onImportClick: () => void;
}

const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  onDepartmentChange,
  onStatusChange,
  onSearchChange,
  onImportClick
}) => {
  const { departments } = useHrModuleData();
  const [searchValue, setSearchValue] = useState('');
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);

  // Extract unique departments from the departments collection
  useEffect(() => {
    if (departments && departments.length > 0) {
      const deptNames = departments
        .map(dept => dept.name || '')
        .filter(name => name.trim() !== ''); // Filter out empty department names
      
      const uniqueDepts = [...new Set(deptNames)];
      setUniqueDepartments(uniqueDepts);
    }
  }, [departments]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleDepartmentChange = (value: string) => {
    onDepartmentChange(value);
  };

  const handleStatusChange = (value: string) => {
    onStatusChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Rechercher un employé..."
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <Select onValueChange={handleDepartmentChange} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            {uniqueDepartments.map((dept, index) => (
              <SelectItem key={index} value={dept || `dept-${index}`}>{dept || "Département sans nom"}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={handleStatusChange} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="onLeave">En congé</SelectItem>
            <SelectItem value="Suspendu">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          Importer des employés
        </Button>
      </div>
    </div>
  );
};

export default EmployeeFilter;
