
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmployeeProfileActionsProps {
  isEditing: boolean;
  onExportPdf?: () => void;
  onEdit?: () => void;
  onFinishEditing: () => void;
}

const EmployeeProfileActions = ({ 
  isEditing,
  onExportPdf,
  onEdit,
  onFinishEditing
}: EmployeeProfileActionsProps) => {
  return (
    <div className="flex justify-end gap-3 mt-6">
      {onExportPdf && (
        <Button variant="outline" onClick={onExportPdf} className="mr-2">
          Exporter PDF
        </Button>
      )}
      <Button 
        variant={isEditing ? "default" : "outline"} 
        onClick={isEditing ? onFinishEditing : onEdit}
      >
        {isEditing ? "Terminer" : "Modifier"}
      </Button>
    </div>
  );
};

export default EmployeeProfileActions;
