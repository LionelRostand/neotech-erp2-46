
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUp, Loader2, AlertCircle, Info } from 'lucide-react';
import { uploadEmployeeDocument } from '../../services/documentService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employeeId: string;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  employeeId
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('contrat');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [corsError, setCorsError] = useState(false);

  // Limite de taille de fichier (15 Mo)
  const MAX_FILE_SIZE = 15 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setUploadError(null);
      setCorsError(false);
      
      // Vérifier la taille du fichier
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`Le fichier est trop volumineux (max 15 Mo). Taille actuelle: ${formatFileSize(file.size)}`);
      }
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    // Vérifier à nouveau la taille du fichier
    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError(`Le fichier est trop volumineux (max 15 Mo). Taille actuelle: ${formatFileSize(selectedFile.size)}`);
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      setCorsError(false);

      // Téléverser le document en mode binaire
      await uploadEmployeeDocument(
        selectedFile,
        employeeId,
        documentType,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Réinitialiser l'état et fermer le dialogue
      setSelectedFile(null);
      setDocumentType('contrat');
      setUploading(false);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erreur lors du téléversement:", error);
      
      // Vérifier si c'est une erreur CORS
      if (error.name === 'FirebaseError' && (error.code === 'storage/unauthorized' || error.message.includes('CORS'))) {
        setCorsError(true);
        setUploadError("Erreur d'accès au stockage. Le serveur a refusé la requête (CORS).");
      } else if (error.code === 'storage/retry-limit-exceeded') {
        setUploadError("Le délai de téléversement a expiré. Essayez avec un fichier plus petit ou vérifiez votre connexion.");
      } else if (error.code === 'storage/unknown') {
        setUploadError("Erreur inconnue lors du stockage. Contactez l'administrateur.");
      } else {
        setUploadError(error.message || "Erreur lors du téléversement");
      }
      
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">Type de document</Label>
            <Select 
              value={documentType}
              onValueChange={setDocumentType}
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contrat">Contrat de travail</SelectItem>
                <SelectItem value="avenant">Avenant</SelectItem>
                <SelectItem value="attestation">Attestation</SelectItem>
                <SelectItem value="formulaire">Formulaire</SelectItem>
                <SelectItem value="identite">Pièce d'identité</SelectItem>
                <SelectItem value="diplome">Diplôme</SelectItem>
                <SelectItem value="cv">CV</SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
                <SelectItem value="autre">Autre document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Fichier</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                className="flex-1"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Taille maximale: 15 Mo
            </p>
          </div>

          {selectedFile && (
            <div className="rounded-md border p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-1">
                <div className="flex-1 truncate text-sm font-medium">
                  {selectedFile.name}
                </div>
                <div className={`text-xs ${selectedFile.size > MAX_FILE_SIZE ? 'text-red-500 font-bold' : 'text-muted-foreground'} ml-2`}>
                  {formatFileSize(selectedFile.size)}
                </div>
              </div>
              
              {uploading && (
                <div className="space-y-1 mt-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Téléversement binaire en cours...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          {corsError && (
            <Alert className="mt-2 bg-amber-50 text-amber-800 border-amber-200">
              <Info className="h-4 w-4 mr-2" />
              <AlertDescription>
                <p className="font-medium">Problème d'accès CORS détecté</p>
                <p className="text-xs mt-1">
                  Vous devez configurer les règles CORS dans la console Firebase Storage. 
                  Cela peut être dû au fait que le domaine de l'application n'est pas autorisé à accéder au stockage.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || (selectedFile && selectedFile.size > MAX_FILE_SIZE)}
            className="relative"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Téléversement ({uploadProgress}%)
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Téléverser
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
