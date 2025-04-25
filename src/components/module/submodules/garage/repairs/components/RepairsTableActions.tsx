
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Repair } from '../../../types/garage-types';

interface RepairsTableActionsProps {
  repair: Repair;
  onView: (repair: Repair) => void;
  onEdit: (repair: Repair) => void;
  onDelete: (repair: Repair) => void;
}

const RepairsTableActions = ({ repair, onView, onEdit, onDelete }: RepairsTableActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" onClick={() => onView(repair)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onEdit(repair)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(repair)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RepairsTableActions;
