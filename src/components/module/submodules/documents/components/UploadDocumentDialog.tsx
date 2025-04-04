
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
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du document *</Label>
            <Input
              id="title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Ex: Contrat de travail"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type de document *</Label>
            <Select value={documentType} onValueChange={setDocumentType} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contrat">Contrat</SelectItem>
                <SelectItem value="attestation">Attestation</SelectItem>
                <SelectItem value="formulaire">Formulaire</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employee">Employé (optionnel)</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Associer à un employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Non assigné</SelectItem>
                <SelectItem value="emp1">Jean Dupont</SelectItem>
                <SelectItem value="emp2">Marie Martin</SelectItem>
                <SelectItem value="emp3">Lucas Bernard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Fichier *</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <FileUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <div className="text-sm mb-2">
                {file ? (
                  <span className="text-green-500 font-medium">{file.name}</span>
                ) : (
                  "Glissez-déposez ou cliquez pour sélectionner"
                )}
              </div>
              <Input 
                id="file" 
                type="file" 
                className="hidden"
                onChange={handleFileChange}
              />
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('file')?.click()}
              >
                Parcourir
              </Button>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading}
            >
              {isUploading ? 'Téléversement...' : 'Téléverser'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
