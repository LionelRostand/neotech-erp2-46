
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Upload, File, X } from 'lucide-react';

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
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setIsImporting(true);

    try {
      // Simuler un import
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une application réelle, vous traiteriez le fichier ici
      // Par exemple, parsez un CSV ou un Excel
      
      toast.success('Fichier importé avec succès');
      onImported(5); // Simuler l'import de 5 employés
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast.error('Erreur lors de l\'import du fichier');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importer des employés</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            {!file ? (
              <>
                <div className="mb-4">
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Glissez-déposez un fichier CSV ou Excel ici, ou cliquez pour sélectionner
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileChange}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Sélectionner un fichier
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-amber-50 p-4 rounded text-sm">
            <p className="font-medium text-amber-800">Format requis:</p>
            <p className="text-amber-700">
              Le fichier doit contenir les colonnes: Prénom, Nom, Email, Poste, Département, Date d'embauche
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleImport}
              disabled={!file || isImporting}
            >
              {isImporting ? 'Importation...' : 'Importer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportEmployeesDialog;
