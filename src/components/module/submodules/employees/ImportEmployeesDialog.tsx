
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/add-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';

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
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.csv')) {
      toast.error('Format de fichier non pris en charge. Veuillez utiliser un fichier JSON ou CSV');
      return;
    }

    setIsImporting(true);

    try {
      // For demo purposes, let's simulate importing employees
      // In a real application, you would parse the file and import the data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock imported employees count
      const importedCount = 5;
      
      toast.success(`${importedCount} employés importés avec succès`);
      onImported(importedCount);
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      console.error('Erreur lors de l\'import des employés:', error);
      toast.error('Une erreur est survenue lors de l\'import des employés');
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
        
        <div className="space-y-6 py-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-gray-500" />
              <h3 className="text-lg font-medium">Glissez-déposez votre fichier ici</h3>
              <p className="text-sm text-gray-500">ou</p>
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm"
              >
                <span>Parcourir</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".json,.csv"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Formats pris en charge: .json, .csv</p>
            </div>
          </div>
          
          {file && (
            <div className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm truncate max-w-[300px]">{file.name}</span>
              <button
                type="button"
                className="text-red-600 hover:text-red-800 text-xs"
                onClick={() => setFile(null)}
              >
                Supprimer
              </button>
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <p>Assurez-vous que votre fichier contient les colonnes suivantes:</p>
            <ul className="list-disc list-inside mt-2">
              <li>firstName - Prénom</li>
              <li>lastName - Nom</li>
              <li>email - Email</li>
              <li>department - Département</li>
              <li>position - Poste</li>
              <li>status - Statut</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handleImport} disabled={!file || isImporting}>
            {isImporting ? 'Importation en cours...' : 'Importer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportEmployeesDialog;
