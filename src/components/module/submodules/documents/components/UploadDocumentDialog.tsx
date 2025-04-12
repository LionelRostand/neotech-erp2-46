
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Upload, FileText, File } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useStorageUpload } from '@/hooks/storage/useStorageUpload';
import { getDocumentTypes, addEmployeeDocument } from '@/components/module/submodules/employees/services/documentService';
import { toast } from 'sonner';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultType?: string;
  employeeId?: string;
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  defaultType = '',
  employeeId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState(defaultType);
  const [date, setDate] = useState<Date>(new Date());
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploadProgress, isUploading } = useStorageUpload();

  // Charger les types de documents
  React.useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const types = await getDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error('Erreur lors du chargement des types de documents:', error);
        setDocumentTypes(["Contrat", "Avenant", "Formation", "Pièce d'identité", "Autre"]);
      }
    };
    
    if (open) {
      fetchDocumentTypes();
    }
  }, [open]);

  // Reset form when dialog is opened/closed
  React.useEffect(() => {
    if (!open) {
      setFile(null);
      setDocumentName('');
      setDocumentType(defaultType);
      setDate(new Date());
      setIsLoading(false);
    }
  }, [open, defaultType]);

  // Format file size
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Vérifier la taille du fichier (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 10MB');
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-set document name if empty
      if (!documentName) {
        setDocumentName(selectedFile.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    
    if (!documentName) {
      toast.error('Veuillez saisir un nom de document');
      return;
    }
    
    if (!documentType) {
      toast.error('Veuillez sélectionner un type de document');
      return;
    }
    
    if (!employeeId) {
      toast.error('ID employé manquant');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Charger le fichier dans Firebase Storage
      const uploadPath = `employees/${employeeId}/documents`;
      const result = await uploadFile(file, uploadPath);
      
      // Créer l'entrée du document dans Firestore
      const document = {
        name: documentName,
        type: documentType,
        date: format(date, 'yyyy-MM-dd'),
        fileUrl: result.fileUrl,
        id: `doc_${Date.now()}`,
        fileType: file.type,
        fileSize: file.size,
        filePath: result.filePath
      };
      
      // Ajouter le document à l'employé
      await addEmployeeDocument(employeeId, document);
      
      toast.success('Document téléversé avec succès');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors du téléversement:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      // Vérifier s'il s'agit d'une erreur CORS
      if (errorMessage.includes('CORS') || errorMessage.includes('blocked by CORS policy')) {
        toast.error('Erreur CORS: Vérifiez la configuration du serveur');
      } else {
        toast.error(`Erreur lors du téléversement: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Téléverser un document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!file ? (
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Cliquez pour sélectionner un fichier</p>
              <p className="text-xs text-gray-400 mt-1">ou glissez-déposez le fichier ici</p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start p-3 bg-gray-50 rounded-md">
                <File className="h-8 w-8 text-blue-500 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} · {file.type || 'Type inconnu'}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={triggerFileInput}
                  className="ml-2 flex-shrink-0"
                >
                  Changer
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du document</Label>
                  <Input
                    id="name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    placeholder="Nom du document"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type de document</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date du document</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'P', { locale: fr }) : <span>Sélectionnez une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="space-y-2">
              <Separator />
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Téléversement en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <React.Fragment>
                <span className="animate-spin">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Téléversement...
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Upload className="h-4 w-4" />
                Téléverser
              </React.Fragment>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
