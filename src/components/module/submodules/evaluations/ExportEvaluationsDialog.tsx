
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Evaluation } from '@/hooks/useEvaluationsData';
import { toast } from 'sonner';
import { FileDown } from 'lucide-react';

interface ExportEvaluationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluations: Evaluation[];
}

const ExportEvaluationsDialog: React.FC<ExportEvaluationsDialogProps> = ({ 
  open, 
  onOpenChange, 
  evaluations
}) => {
  const [includeComments, setIncludeComments] = useState(true);
  const [includeStrengths, setIncludeStrengths] = useState(true);
  const [includeImprovements, setIncludeImprovements] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (evaluations.length === 0) {
      toast.error('Aucune évaluation à exporter');
      return;
    }

    setIsExporting(true);
    
    try {
      // Create CSV content
      const headers = [
        'ID',
        'Employé',
        'Titre',
        'Date',
        'Évaluateur',
        'Note',
        'Statut',
        includeComments ? 'Commentaires' : null,
        includeStrengths ? 'Points forts' : null,
        includeImprovements ? 'Axes d\'amélioration' : null
      ].filter(Boolean);

      const rows = evaluations.map(evaluation => [
        evaluation.id,
        evaluation.employeeName,
        evaluation.title || 'Évaluation régulière',
        evaluation.date,
        evaluation.evaluatorName,
        evaluation.rating || evaluation.score || '',
        evaluation.status,
        includeComments ? evaluation.comments || '' : null,
        includeStrengths ? (evaluation.strengths?.join('\n') || '') : null,
        includeImprovements ? (evaluation.improvements?.join('\n') || '') : null
      ].filter((_, index) => headers[index] !== null));

      // Convert to CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evaluations_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export réalisé avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export');
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
            {evaluations.length} évaluation(s) seront exportées au format CSV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-3">
            <Label>Options d'export</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeComments" 
                checked={includeComments} 
                onCheckedChange={(checked) => setIncludeComments(!!checked)} 
              />
              <Label htmlFor="includeComments" className="cursor-pointer">
                Inclure les commentaires
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeStrengths" 
                checked={includeStrengths} 
                onCheckedChange={(checked) => setIncludeStrengths(!!checked)} 
              />
              <Label htmlFor="includeStrengths" className="cursor-pointer">
                Inclure les points forts
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeImprovements" 
                checked={includeImprovements} 
                onCheckedChange={(checked) => setIncludeImprovements(!!checked)} 
              />
              <Label htmlFor="includeImprovements" className="cursor-pointer">
                Inclure les axes d'amélioration
              </Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || evaluations.length === 0}
          >
            {isExporting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-opacity-50 border-t-transparent rounded-full"></span>
                Exportation...
              </span>
            ) : (
              <span className="flex items-center">
                <FileDown className="mr-2 h-4 w-4" />
                Exporter
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportEvaluationsDialog;
