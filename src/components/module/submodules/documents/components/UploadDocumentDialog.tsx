
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { addEmployeeDocument, getDocumentTypes } from '@/components/module/submodules/employees/services/documentService';
import { Employee, Document } from '@/types/employee';
import { Loader2, FileText } from 'lucide-react';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  onDocumentAdded?: (document: Document) => void;
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState<Document | null>(null);
  
  // Fetch document types on component mount
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      const types = await getDocumentTypes();
      setDocumentTypes(types);
    };
    
    if (open) {
      fetchDocumentTypes();
      // Reset form when dialog opens
      setDocumentName('');
      setDocumentType(defaultType);
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadedDocument(null);
    }
  }, [open, defaultType]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      
      // Auto-fill document name with file name if empty
      if (!documentName.trim()) {
        const fileName = e.target.files[0].name;
        // Remove extension from filename
        const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
        setDocumentName(nameWithoutExtension || fileName);
      }
    }
  };
  
  // Fonction pour convertir un fichier en base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // On extrait la partie base64 (après le préfixe data:xxx;base64,)
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]; // Prendre seulement la partie base64
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
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
      
      // Simuler le progrès de téléversement
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Convertir le fichier en base64
      const base64Data = await convertFileToBase64(selectedFile);
      
      // Préparer les données du document
      const newDocument: Document = {
        name: documentName,
        type: documentType,
        date: new Date().toISOString(),
        fileData: base64Data, // Stocker les données base64 du document
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        id: `doc_${Date.now()}`,
        employeeId: employee.id,
        storedInFirebase: false, // Pas stocké dans Firebase Storage
        storedInHrDocuments: true, // Sera stocké dans hr_documents
        storageFormat: 'base64'    // Indique que le stockage est en base64
      };
      
      // Mettre à jour le progrès à 100% avant d'ajouter le document
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Add document to hr_documents and reference in employee record
      const addedDocument = await addEmployeeDocument(employee.id, newDocument);
      
      // Stocker le document téléversé pour l'affichage immédiat
      setUploadedDocument(addedDocument);
      
      toast.success("Document ajouté avec succès");
      
      // Notify parent component with the added document
      if (onDocumentAdded) {
        onDocumentAdded(addedDocument);
      }
      
      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
      toast.error("Erreur lors de l'ajout du document");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset form state before closing
    setDocumentName('');
    setDocumentType('');
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadedDocument(null);
    
    // Close the dialog
    onOpenChange(false);
  };
  
  // Format file size for display
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        
        {!uploadedDocument ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
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
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Téléversement...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4">
            <div className="border rounded-md p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-blue-100 p-2 text-blue-700">
                  <FileText className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{uploadedDocument.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {uploadedDocument.type} • {formatFileSize(uploadedDocument.fileSize || 0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center py-2 text-green-600 font-medium">
              Document téléversé avec succès
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClose}>
                Fermer
              </Button>
              <Button onClick={handleClose}>
                Terminé
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {isLoading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-center mt-1">{Math.round(uploadProgress)}%</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
