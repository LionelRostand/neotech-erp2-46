
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DepartmentHeaderProps {
  onAddDepartment: () => void;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({ onAddDepartment }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Départements</h2>
      <Button onClick={onAddDepartment}>
        <Plus className="h-4 w-4 mr-2" />
        Nouveau département
      </Button>
    </div>
  );
};

export default DepartmentHeader;
