
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { addDocument } from '@/hooks/firestore/add-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';
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
  const [importPreview, setImportPreview] = useState<any[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseExcelFile(selectedFile);
    }
  };
  
  const parseExcelFile = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 1) {
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          const preview = rows.slice(0, 5).map(row => {
            const rowData: any = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index];
            });
            return rowData;
          });
          
          setImportPreview(preview);
        } else {
          toast.error('Le fichier est vide ou ne contient pas de données valides');
          setImportPreview([]);
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error("Erreur lors de l'analyse du fichier");
        setImportPreview([]);
      }
    };
    
    reader.readAsBinaryString(file);
  };
  
  const importEmployees = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    
    try {
      setIsImporting(true);
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            toast.error('Le fichier ne contient pas de données');
            setIsImporting(false);
            return;
          }
          
          let importedCount = 0;
          const now = new Date().toISOString();
          
          for (const row of jsonData) {
            // Cast row to any to safely access properties
            const excelRow = row as Record<string, any>;
            
            const employeeData = {
              firstName: excelRow.firstName || excelRow.FirstName || '',
              lastName: excelRow.lastName || excelRow.LastName || '',
              email: excelRow.email || excelRow.Email || '',
              phone: excelRow.phone || excelRow.Phone || '',
              position: excelRow.position || excelRow.Position || '',
              department: excelRow.department || excelRow.Department || '',
              status: excelRow.status || excelRow.Status || 'active',
              address: '',
              createdAt: now,
              updatedAt: now,
            };
            
            await addDocument(COLLECTIONS.HR.EMPLOYEES, employeeData);
            importedCount++;
          }
          
          toast.success(`${importedCount} employés importés avec succès`);
          onImported(importedCount);
          onOpenChange(false);
        } catch (error) {
          console.error('Error importing employees:', error);
          toast.error("Erreur lors de l'importation");
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error("Erreur lors de la lecture du fichier");
      setIsImporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importer des employés</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Fichier Excel</Label>
            <Input 
              id="file-upload" 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileChange} 
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Formats acceptés: .xlsx, .xls. 
              Le fichier doit contenir les colonnes: firstName, lastName, email, phone, position, department, status
            </p>
          </div>
          
          {importPreview.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Aperçu des données (5 premières lignes):</h3>
              <div className="border rounded-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(importPreview[0]).map((header) => (
                        <th 
                          key={header}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importPreview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, i) => (
                          <td key={i} className="px-3 py-2 text-xs">
                            {value?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isImporting}
            >
              Annuler
            </Button>
            <Button 
              onClick={importEmployees} 
              disabled={isImporting || !file}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importation...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportEmployeesDialog;
