
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ImportEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: (count: number) => void;
}

const ImportEmployeesDialog: React.FC<ImportEmployeesDialogProps> = ({
  open,
  onOpenChange,
  onImported
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
        setFile(selectedFile);
        setImportStatus('idle');
      } else {
        toast.error('Format de fichier non supporté. Veuillez utiliser CSV ou Excel (.xlsx, .xls).');
        e.target.value = '';
      }
    }
  };

  const simulateImportProgress = () => {
    setUploading(true);
    setImportStatus('uploading');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImportStatus('processing');
          
          // Simulate processing delay
          setTimeout(() => {
            const randomCount = Math.floor(Math.random() * 20) + 5; // Random between 5 and 25
            setImportedCount(randomCount);
            setImportStatus('success');
            setUploading(false);
            onImported(randomCount);
          }, 1500);
          
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleImport = () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier à importer');
      return;
    }
    
    simulateImportProgress();
  };

  const handleClose = () => {
    if (uploading) return;
    
    setFile(null);
    setProgress(0);
    setImportStatus('idle');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importer des employés</DialogTitle>
          <DialogDescription>
            Importez plusieurs employés à partir d'un fichier CSV ou Excel.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {importStatus === 'success' ? (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold">Import réussi!</h3>
              <p className="text-gray-500 mt-2">
                {importedCount} employés ont été importés avec succès.
              </p>
            </div>
          ) : importStatus === 'error' ? (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold">Erreur d'importation</h3>
              <p className="text-gray-500 mt-2">
                Une erreur s'est produite lors de l'importation. Veuillez réessayer.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <Label htmlFor="file-upload">Fichier à importer</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="flex-1"
                  />
                  {file && (
                    <Button variant="outline" size="icon" disabled={uploading}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Formats acceptés: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              
              {(importStatus === 'uploading' || importStatus === 'processing') && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>
                      {importStatus === 'uploading' ? 'Chargement...' : 'Traitement...'}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
              
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <h4 className="font-medium mb-2">Format attendu</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Votre fichier doit contenir les colonnes suivantes:
                </p>
                <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                  <li>Prénom (obligatoire)</li>
                  <li>Nom (obligatoire)</li>
                  <li>Email (obligatoire)</li>
                  <li>Poste/Position</li>
                  <li>Département</li>
                  <li>Date d'embauche</li>
                  <li>Statut</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {importStatus === 'success' ? (
            <Button onClick={handleClose}>Fermer</Button>
          ) : importStatus === 'error' ? (
            <>
              <Button variant="outline" onClick={handleClose}>Annuler</Button>
              <Button onClick={() => setImportStatus('idle')}>Réessayer</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={uploading}>
                Annuler
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!file || uploading}
              >
                {uploading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span>
                    {importStatus === 'uploading' ? 'Chargement...' : 'Traitement...'}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </span>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportEmployeesDialog;
