
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ExportEvaluationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any[];
}

const ExportEvaluationsDialog: React.FC<ExportEvaluationsDialogProps> = ({
  open,
  onOpenChange,
  data,
}) => {
  const [exportFormat, setExportFormat] = useState('excel');

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    let success = false;
    
    if (exportFormat === 'excel') {
      success = exportToExcel(data, 'Evaluations', 'evaluations_export');
      if (success) {
        toast.success("Export Excel généré avec succès");
      }
    } else if (exportFormat === 'pdf') {
      success = exportToPdf(data, 'Évaluations des Employés', 'evaluations_export');
      if (success) {
        toast.success("Export PDF généré avec succès");
      }
    }
    
    if (!success) {
      toast.error("Une erreur est survenue lors de l'export");
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exporter les évaluations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="exportFormat">Format d'exportation</Label>
            <Select
              value={exportFormat}
              onValueChange={setExportFormat}
            >
              <SelectTrigger id="exportFormat">
                <SelectValue placeholder="Choisir un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">
                  <div className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Excel (.xlsx)</span>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>PDF (.pdf)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handleExport}>
            Exporter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportEvaluationsDialog;
