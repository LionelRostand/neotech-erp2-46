
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DepartmentHeaderProps {
  onAddDepartment: () => void;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({ onAddDepartment }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold">Départements</h1>
      <Button onClick={onAddDepartment} className="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700">
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un département
      </Button>
    </div>
  );
};

export default DepartmentHeader;
