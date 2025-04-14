
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileSpreadsheet, FilePdf } from 'lucide-react';
import { toast } from 'sonner';

interface ExportEvaluationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluations: any[];
}

const ExportEvaluationsDialog: React.FC<ExportEvaluationsDialogProps> = ({
  open,
  onOpenChange,
  evaluations
}) => {
  const [exportFormat, setExportFormat] = useState('excel');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would generate the file here
      // For Excel: You could use xlsx library
      // For PDF: You could use jspdf and jspdf-autotable
      
      toast.success(`Exportation en ${exportFormat === 'excel' ? 'Excel' : 'PDF'} réussie`);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      toast.error('Erreur lors de l\'exportation');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exporter les évaluations</DialogTitle>
          <DialogDescription>
            Sélectionnez le format d'exportation souhaité.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="space-y-4">
            <div className="flex items-center space-x-2 rounded-md border p-4">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel" className="flex items-center gap-3 cursor-pointer">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Excel (.xlsx)</p>
                  <p className="text-sm text-muted-foreground">Fichier Excel compatible avec Microsoft Excel, Google Sheets, etc.</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-4">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf" className="flex items-center gap-3 cursor-pointer">
                <FilePdf className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">PDF (.pdf)</p>
                  <p className="text-sm text-muted-foreground">Document PDF pour l'impression ou le partage</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Exportation...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exporter {evaluations.length} évaluation{evaluations.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportEvaluationsDialog;
