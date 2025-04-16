
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { Loader2, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportEmployeesDialogProps {
  onImport: (employees: Partial<Employee>[]) => void;
}

const ImportEmployeesDialog: React.FC<ImportEmployeesDialogProps> = ({ onImport }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedEmployees, setParsedEmployees] = useState<Partial<Employee>[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };
  
  const parseFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const employees = jsonData.map((row: any) => {
        // Safely access properties with type checking
        const employee: Partial<Employee> = {
          firstName: row.firstName || row.FirstName || '',
          lastName: row.lastName || row.LastName || '',
          email: row.email || row.Email || '',
          phone: row.phone || row.Phone || '',
          position: row.position || row.Position || '',
          department: row.department || row.Department || '',
          status: row.status || row.Status || 'active',
        };
        return employee;
      });
      
      setParsedEmployees(employees);
      toast.success(`${employees.length} employés trouvés dans le fichier`);
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error("Erreur lors de l'analyse du fichier");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleImport = () => {
    if (parsedEmployees.length > 0) {
      onImport(parsedEmployees);
    } else {
      toast.error('Aucun employé à importer');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="p-4 border-2 border-dashed rounded-lg text-center">
        {isUploading ? (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Traitement du fichier en cours...</p>
          </div>
        ) : file ? (
          <div className="py-8">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{parsedEmployees.length} employés trouvés</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setFile(null);
                setParsedEmployees([]);
              }}
            >
              Changer de fichier
            </Button>
          </div>
        ) : (
          <>
            <div className="py-8">
              <div className="flex justify-center mb-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Déposer un fichier Excel (.xlsx) ou
              </p>
              <Button variant="outline" asChild>
                <label>
                  Parcourir
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </label>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Formats supportés: Excel (.xlsx, .xls)
            </p>
          </>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setFile(null);
            setParsedEmployees([]);
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleImport}
          disabled={parsedEmployees.length === 0 || isUploading}
        >
          Importer {parsedEmployees.length} employés
        </Button>
      </div>
    </div>
  );
};

export default ImportEmployeesDialog;
