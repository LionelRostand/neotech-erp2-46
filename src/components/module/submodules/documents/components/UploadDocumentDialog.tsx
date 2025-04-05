
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
      // In a real implementation, we would upload the file to storage
      // and create a document record in the database
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Document téléversé avec succès");
      if (onSuccess) onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors du téléversement:", error);
      toast.error("Erreur lors du téléversement du document");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setDocumentTitle('');
    setDocumentType('');
    setEmployeeId('');
    setFile(null);
  };

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
                <SelectItem value="contract">Contrat</SelectItem>
                <SelectItem value="payslip">Fiche de paie</SelectItem>
                <SelectItem value="ID">Pièce d'identité</SelectItem>
                <SelectItem value="certificate">Certificat</SelectItem>
                <SelectItem value="form">Formulaire</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
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
                PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (max 10MB)
              </p>
              <Input
                id="document-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
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
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
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
