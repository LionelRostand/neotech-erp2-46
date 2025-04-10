
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUp, Upload, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { addEmployeeDocument, getDocumentTypes } from '../../services/documentService';

// Définition du schéma de validation
const formSchema = z.object({
  name: z.string().min(1, 'Nom du document requis'),
  type: z.string().min(1, 'Type de document requis'),
  file: z.instanceof(File, { message: 'Fichier requis' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employeeId?: string;
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
  const [isUploading, setIsUploading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<string[]>([
    'Contrat', 'Avenant', 'Attestation', 'Diplôme', 'CV', 'Pièce d\'identité', 'Autre'
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Vérification de l'ID employé dès l'ouverture
  useEffect(() => {
    if (open) {
      console.log("UploadDocumentDialog: Ouvert avec ID employé:", employeeId);
      if (!employeeId) {
        console.error("UploadDocumentDialog: Ouvert sans ID employé");
        toast.error("Impossible de téléverser un document: employé non spécifié");
        onOpenChange(false);
      }
    }
  }, [open, employeeId, onOpenChange]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: defaultType || '',
    },
  });

  // Chargement des types de documents depuis Firestore
  React.useEffect(() => {
    const loadDocumentTypes = async () => {
      const types = await getDocumentTypes();
      if (types.length > 0) {
        setDocumentTypes(types);
      }
    };
    
    loadDocumentTypes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-populate name field with filename (without extension)
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      form.setValue('name', fileName);
    }
  };

  const resetForm = () => {
    form.reset();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    
    if (!employeeId) {
      toast.error('ID de l\'employé manquant');
      console.error('Upload document error: No employee ID provided', { employeeId });
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log('Téléversement de document pour employé ID:', employeeId);
      
      // Dans un environnement réel, on téléverserait le fichier sur un stockage (Firebase Storage)
      // et on récupérerait l'URL du fichier
      const fileUrl = URL.createObjectURL(file);
      
      // Créer le document dans Firestore
      const documentData = {
        name: values.name,
        type: values.type,
        date: format(new Date(), 'yyyy-MM-dd'),
        fileUrl: fileUrl,
        id: `doc_${Date.now()}`,
        size: file.size,
        employeeId: employeeId // Ajouter explicitement l'ID de l'employé
      };
      
      console.log("Document à ajouter pour employé ID:", employeeId, documentData);
      
      const success = await addEmployeeDocument(employeeId, documentData);
      
      if (success) {
        resetForm();
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur lors du téléversement:', error);
      toast.error('Erreur lors du téléversement du document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  // Si pas d'ID employé, ne pas rendre le composant
  if (!employeeId && open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Téléverser un document</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${file ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileUp className="h-6 w-6 text-green-500 mr-2" />
                    <div className="text-sm text-left">
                      <p className="font-medium truncate" style={{ maxWidth: '180px' }}>{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {file.size < 1024 * 1024 
                          ? `${(file.size / 1024).toFixed(1)} KB` 
                          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Cliquez pour sélectionner un fichier</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, Images</p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du document</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du document" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de document</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Téléversement...' : 'Téléverser'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
