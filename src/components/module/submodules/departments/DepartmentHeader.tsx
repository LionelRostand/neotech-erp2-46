
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface DepartmentHeaderProps {
  onAddDepartment: () => void;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({
  onAddDepartment
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Départements</h1>
        <p className="text-muted-foreground">
          Gérez les départements de votre entreprise
        </p>
      </div>
      <Button onClick={onAddDepartment}>
        <PlusCircle className="w-4 h-4 mr-2" />
        Ajouter un département
      </Button>
    </div>
  );
};

export default DepartmentHeader;
