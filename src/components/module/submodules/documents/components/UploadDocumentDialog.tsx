
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStorageUpload } from '@/hooks/storage/useStorageUpload';
import { toast } from 'sonner';
import { addEmployeeDocument, getDocumentTypes } from '@/components/module/submodules/employees/services/documentService';
import { Employee } from '@/types/employee';
import { Loader2 } from 'lucide-react';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  onDocumentAdded?: () => void;
  onSuccess?: () => void;
  defaultType?: string;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onDocumentAdded,
  onSuccess,
  defaultType = ''
}) => {
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState(defaultType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { uploadFile, isUploading, uploadProgress } = useStorageUpload();
  
  // Fetch document types on component mount
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      const types = await getDocumentTypes();
      setDocumentTypes(types);
    };
    
    if (open) {
      fetchDocumentTypes();
    }
  }, [open]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentName.trim()) {
      toast.error("Veuillez entrer un nom de document");
      return;
    }
    
    if (!documentType) {
      toast.error("Veuillez sélectionner un type de document");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    
    if (!employee) {
      toast.error("Aucun employé sélectionné");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Upload the file to Firebase Storage
      const uploadPath = `employees/${employee.id}/documents`;
      const result = await uploadFile(selectedFile, uploadPath);
      
      // Add document reference to employee record
      await addEmployeeDocument(employee.id, {
        name: documentName,
        type: documentType,
        date: new Date().toISOString(),
        fileUrl: result.fileUrl,
        fileData: result.fileData, // Stocker les données base64 du document
        id: `doc_${Date.now()}`
      });
      
      toast.success("Document ajouté avec succès");
      
      // Reset form and close dialog
      setDocumentName('');
      setDocumentType('');
      setSelectedFile(null);
      
      // Notify parent component
      if (onDocumentAdded) {
        onDocumentAdded();
      }
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Erreur lors de l'ajout du document");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document-name" className="text-right">
                Nom
              </Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document-type" className="text-right">
                Type
              </Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="document-type" className="col-span-3">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="document-file" className="text-right">
                Fichier
              </Label>
              <div className="col-span-3">
                <Input
                  id="document-file"
                  type="file"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isUploading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {(isLoading || isUploading) ? 'Téléversement...' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
        
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-center mt-1">{uploadProgress}%</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
