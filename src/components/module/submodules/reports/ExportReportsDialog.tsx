
import React, { useState } from 'react';
import { 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';

interface ExportReportsDialogProps {
  data: any[];
  onOpenChange: (open: boolean) => void;
}

const ExportReportsDialog: React.FC<ExportReportsDialogProps> = ({ 
  data, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<string>("PDF");
  const [includeAll, setIncludeAll] = useState<boolean>(true);
  
  const handleExport = () => {
    if (data.length === 0) {
      toast({
        title: "Aucune donnée à exporter",
        description: "Il n'y a pas de rapports à exporter.",
        variant: "destructive"
      });
      return;
    }
    
    let success = false;
    
    if (exportFormat === "Excel") {
      success = exportToExcel(data, "Rapports", "rapports_rh");
    } else {
      success = exportToPdf(data, "Liste des rapports RH", "rapports_rh");
    }
    
    if (success) {
      toast({
        title: "Export réussi",
        description: `Les données ont été exportées au format ${exportFormat}.`
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Erreur lors de l'export",
        description: "Une erreur s'est produite pendant l'export des données.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Exporter les rapports</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="export-format">Format d'export</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Button
              type="button"
              variant={exportFormat === "PDF" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => setExportFormat("PDF")}
            >
              <FileText className="h-10 w-10" />
              <span>PDF</span>
            </Button>
            
            <Button
              type="button"
              variant={exportFormat === "Excel" ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => setExportFormat("Excel")}
            >
              <FileSpreadsheet className="h-10 w-10" />
              <span>Excel</span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 pt-2">
          <Label>Options</Label>
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox 
              id="include-all" 
              checked={includeAll}
              onCheckedChange={(checked) => setIncludeAll(!!checked)}
            />
            <label
              htmlFor="include-all"
              className="text-sm leading-none cursor-pointer"
            >
              Inclure toutes les colonnes
            </label>
          </div>
        </div>
        
        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            {data.length} rapport(s) seront exporté(s).
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button onClick={handleExport}>
          Exporter
        </Button>
      </DialogFooter>
    </>
  );
};

export default ExportReportsDialog;
