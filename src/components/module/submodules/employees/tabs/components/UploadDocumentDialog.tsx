
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileText, Upload } from 'lucide-react';
import { uploadEmployeeDocument } from '../../services/documentService';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employeeId: string;
  defaultType?: string;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  employeeId,
  defaultType = ''
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState(defaultType);
  const [isUploading, setIsUploading] = useState(false);

  const documentTypes = [
    { value: 'contrat', label: 'Contrat de travail' },
    { value: 'avenant', label: 'Avenant' },
    { value: 'attestation', label: 'Attestation' },
    { value: 'formulaire', label: 'Formulaire' },
    { value: 'identite', label: 'Pièce d\'identité' },
    { value: 'diplome', label: 'Diplôme' },
    { value: 'cv', label: 'CV' },
    { value: 'formation', label: 'Formation' },
    { value: 'certification', label: 'Certification' },
    { value: 'autre', label: 'Autre document' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Si le nom du document est vide, utiliser le nom du fichier
      if (!documentName) {
        // Supprimer l'extension du fichier
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setDocumentName(fileName);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    if (!documentName.trim()) {
      toast.error("Veuillez donner un nom au document");
      return;
    }

    if (!documentType) {
      toast.error("Veuillez sélectionner un type de document");
      return;
    }

    setIsUploading(true);

    try {
      console.log(`Téléversement de document pour l'employé ID: ${employeeId}`);
      const result = await uploadEmployeeDocument(
        employeeId,
        file,
        documentName,
        documentType
      );

      if (result) {
        toast.success("Document ajouté avec succès");
        onSuccess();
        handleClose();
      } else {
        toast.error("Erreur lors du téléversement du document");
      }
    } catch (error) {
      console.error("Erreur lors du téléversement:", error);
      toast.error(`Erreur lors du téléversement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setDocumentName('');
    setDocumentType(defaultType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fichier</Label>
            <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                  >
                    Changer
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Cliquez pour sélectionner un fichier ou déposez-le ici</p>
                  <Input 
                    id="file" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('file')?.click()}
                    disabled={isUploading}
                  >
                    Sélectionner un fichier
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nom du document</Label>
            <Input 
              id="name" 
              value={documentName} 
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Exemple: Contrat de travail"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de document</Label>
            <Select 
              value={documentType} 
              onValueChange={setDocumentType}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs text-gray-500">
            ID Employé: {employeeId}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isUploading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!file || !documentName.trim() || !documentType || isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                Téléversement...
              </>
            ) : (
              'Téléverser'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
