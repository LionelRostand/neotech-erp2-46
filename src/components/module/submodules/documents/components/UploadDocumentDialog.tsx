
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { useFileService } from '../../documents/services/fileService';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  defaultType?: string;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  defaultType = ''
}) => {
  const { uploadDocument } = useFileService();
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState(defaultType);
  const [employeeId, setEmployeeId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const documentTypes = [
    { value: 'contrat', label: 'Contrat' },
    { value: 'attestation', label: 'Attestation' },
    { value: 'formulaire', label: 'Formulaire' },
    { value: 'identite', label: 'Pièce d\'identité' },
    { value: 'cv', label: 'CV' },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'salaire', label: 'Bulletin de salaire' },
    { value: 'autre', label: 'Autre' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill title from filename if empty
      if (!documentTitle) {
        // Remove extension from filename
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setDocumentTitle(fileName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentTitle || !documentType || !file) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Prepare document metadata
      const metadata = {
        title: documentTitle,
        type: documentType,
        employeeId: employeeId || undefined,
        uploadDate: new Date().toISOString(),
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileType: file.type,
      };
      
      // Upload document
      await uploadDocument(file, metadata);
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Document téléversé avec succès");
      if (onSuccess) onSuccess();
      
      // Close dialog after short delay
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du téléversement:", error);
      toast.error("Erreur lors du téléversement du document");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setDocumentTitle('');
    setDocumentType(defaultType);
    setEmployeeId('');
    setFile(null);
    setUploadProgress(0);
  };

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      resetForm();
    } else if (defaultType) {
      setDocumentType(defaultType);
    }
  }, [open, defaultType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Téléverser un document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="document-title">Titre du document</Label>
            <Input 
              id="document-title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Ex: Contrat de travail"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-type">Type de document</Label>
            <Select value={documentType || "default"} onValueChange={setDocumentType}>
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" disabled>Sélectionner un type</SelectItem>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employee-id">Associer à un employé (optionnel)</Label>
            <Select value={employeeId || "none"} onValueChange={setEmployeeId}>
              <SelectTrigger id="employee-id">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun employé</SelectItem>
                <SelectItem value="emp-1">Jean Dupont</SelectItem>
                <SelectItem value="emp-2">Marie Martin</SelectItem>
                <SelectItem value="emp-3">Pierre Durand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document-file">Fichier</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Cliquez pour sélectionner ou glissez un fichier ici
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {documentType === 'contrat' && "PDF, DOC, DOCX (max 10MB)"}
                {documentType === 'attestation' && "PDF, DOC, DOCX, JPG, PNG (max 5MB)"}
                {documentType === 'formulaire' && "PDF, DOC, DOCX, XLS, XLSX (max 5MB)"}
                {documentType === 'identite' && "JPG, PNG, PDF (max 2MB)"}
                {documentType === 'cv' && "PDF, DOC, DOCX (max 5MB)"}
                {documentType === 'diplome' && "PDF, JPG, PNG (max 5MB)"}
                {documentType === 'salaire' && "PDF (max 3MB)"}
                {(!documentType || documentType === 'autre' || documentType === 'default') && 
                  "PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max 10MB)"}
              </p>
              <Input
                id="document-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={
                  documentType === 'contrat' ? ".pdf,.doc,.docx" :
                  documentType === 'attestation' ? ".pdf,.doc,.docx,.jpg,.jpeg,.png" :
                  documentType === 'formulaire' ? ".pdf,.doc,.docx,.xls,.xlsx" :
                  documentType === 'identite' ? ".jpg,.jpeg,.png,.pdf" :
                  documentType === 'cv' ? ".pdf,.doc,.docx" :
                  documentType === 'diplome' ? ".pdf,.jpg,.jpeg,.png" :
                  documentType === 'salaire' ? ".pdf" :
                  ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                }
              />
              <Button 
                type="button"
                variant="outline" 
                className="mt-4"
                onClick={() => document.getElementById('document-file')?.click()}
              >
                Sélectionner un fichier
              </Button>
              {file && (
                <p className="mt-2 text-sm font-medium">
                  Fichier sélectionné: {file.name}
                </p>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Téléversement en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isUploading || !documentTitle || !documentType || !file}
            >
              {isUploading ? "Téléversement..." : "Téléverser"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
