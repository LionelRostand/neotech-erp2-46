import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Evaluation } from '@/hooks/useEvaluationsData';

export interface ExportEvaluationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluations?: Evaluation[];
}

const ExportEvaluationsDialog: React.FC<ExportEvaluationsDialogProps> = ({
  open,
  onOpenChange,
  evaluations = []
}) => {
  const handleExport = () => {
    // Export logic here
    console.log(`Exporting ${evaluations.length} evaluations`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Exporter les évaluations</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-muted-foreground">
            Vous êtes sur le point d'exporter {evaluations.length} évaluation(s).
          </p>
          {/* Export options would go here */}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport}>
            Exporter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportEvaluationsDialog;
