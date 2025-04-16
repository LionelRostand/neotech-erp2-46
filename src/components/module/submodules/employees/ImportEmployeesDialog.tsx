
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileWarning, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Employee } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument } from '@/hooks/firestore/create-operations';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<any[] | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setImportedData(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      setErrorMessage("Format de fichier non pris en charge. Veuillez importer un fichier JSON ou CSV.");
      return;
    }
    
    setSelectedFile(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Veuillez sélectionner un fichier à importer.");
      return;
    }
    
    setIsUploading(true);
    setErrorMessage(null);
    
    try {
      const fileContent = await readFileAsText(selectedFile);
      
      let parsedData;
      if (selectedFile.name.endsWith('.json')) {
        parsedData = JSON.parse(fileContent);
      } else if (selectedFile.name.endsWith('.csv')) {
        parsedData = parseCSV(fileContent);
      }
      
      if (!Array.isArray(parsedData)) {
        setErrorMessage("Le format du fichier est invalide. Veuillez vous assurer qu'il contient un tableau d'employés.");
        return;
      }
      
      setImportedData(parsedData);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error);
      setErrorMessage("Une erreur s'est produite lors de la lecture du fichier. Veuillez vérifier son format.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleImport = async () => {
    if (!importedData || importedData.length === 0) return;
    
    setIsImporting(true);
    try {
      let importCount = 0;
      
      for (const employeeData of importedData) {
        // Format employee data
        const employeeToAdd: Partial<Employee> = {
          ...employeeData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Add to Firestore
        await addDocument(COLLECTIONS.HR.EMPLOYEES, employeeToAdd);
        importCount++;
      }
      
      onImported(importCount);
      onOpenChange(false);
      
      // Reset form
      setSelectedFile(null);
      setImportedData(null);
    } catch (error) {
      console.error("Erreur lors de l'importation des employés:", error);
      setErrorMessage("Une erreur s'est produite lors de l'importation des employés.");
    } finally {
      setIsImporting(false);
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  const parseCSV = (csvContent: string): any[] => {
    // Simple CSV parser (for more complex needs, consider using a library)
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',').map(value => value.trim());
      const employee: any = {};
      
      headers.forEach((header, index) => {
        employee[header] = values[index] || '';
      });
      
      return employee;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importer des employés</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="importFile">Fichier d'importation (JSON ou CSV)</Label>
            <div className="flex gap-2">
              <Input
                id="importFile"
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                disabled={isUploading || isImporting}
              />
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading || isImporting}
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                Lire
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Formats acceptés: JSON, CSV
            </p>
          </div>
          
          {importedData && (
            <div className="space-y-2">
              <div className="bg-muted p-3 rounded-md">
                <p><span className="font-medium">Employés détectés:</span> {importedData.length}</p>
                <p className="text-sm">Les données seront importées dans la base de données.</p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isImporting}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  {isImporting ? 'Importation...' : 'Importer les employés'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportEmployeesDialog;
