
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUp, File, Plus, X } from 'lucide-react';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface DocumentCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const documentTypes = [
  { value: 'invoice', label: 'Facture' },
  { value: 'bol', label: 'Connaissement' },
  { value: 'customs', label: 'Document douanier' },
  { value: 'certificate', label: 'Certificat' },
  { value: 'contract', label: 'Contrat' },
  { value: 'other', label: 'Autre' }
];

const documentFormats = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'Word' },
  { value: 'xlsx', label: 'Excel' },
  { value: 'jpg', label: 'Image JPG' },
  { value: 'png', label: 'Image PNG' },
  { value: 'txt', label: 'Texte' }
];

const DocumentCreateDialog: React.FC<DocumentCreateDialogProps> = ({ 
  isOpen, 
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentData, setDocumentData] = useState({
    name: '',
    type: '',
    description: '',
    shipment: '',
    format: '',
    tags: ''
  });
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocumentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setDocumentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      
      // Inférer le format du fichier si possible
      const fileName = e.target.files[0].name;
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      if (extension) {
        let format = '';
        if (['pdf'].includes(extension)) format = 'pdf';
        else if (['doc', 'docx'].includes(extension)) format = 'docx';
        else if (['xls', 'xlsx'].includes(extension)) format = 'xlsx';
        else if (['jpg', 'jpeg'].includes(extension)) format = 'jpg';
        else if (['png'].includes(extension)) format = 'png';
        else if (['txt'].includes(extension)) format = 'txt';
        
        if (format) {
          setDocumentData(prev => ({ ...prev, format }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentData.name.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom du document est requis",
        variant: "destructive"
      });
      return;
    }
    
    if (!documentData.type) {
      toast({
        title: "Erreur de validation",
        description: "Le type de document est requis",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedFile) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Dans un environnement réel, nous téléverserions le fichier vers un service de stockage
      // et nous obtiendrions une URL. Pour cette démo, nous simulons cela.
      const fileUrl = `https://example.com/files/${Date.now()}_${selectedFile.name}`;
      
      // Préparer les données du document
      const newDocument = {
        name: documentData.name,
        type: documentData.type,
        description: documentData.description,
        shipment: documentData.shipment,
        format: documentData.format,
        fileUrl: fileUrl,
        size: selectedFile.size,
        creator: 'Utilisateur actuel', // En production, utiliser l'ID de l'utilisateur connecté
        date: new Date().toISOString(),
        tags: documentData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'active'
      };
      
      // Enregistrer le document dans Firestore
      await addDocument(COLLECTIONS.FREIGHT.DOCUMENTS, newDocument);
      
      toast({
        title: "Document créé",
        description: "Le document a été ajouté avec succès",
      });
      
      // Réinitialiser le formulaire
      setDocumentData({
        name: '',
        type: '',
        description: '',
        shipment: '',
        format: '',
        tags: ''
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setIsSubmitting(false);
      
      // Fermer le dialogue et appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création du document:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le document. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau document d'expédition</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du document *</Label>
              <Input 
                id="name" 
                name="name" 
                value={documentData.name} 
                onChange={handleChange} 
                placeholder="Facture expédition #12345" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type de document *</Label>
              <Select 
                value={documentData.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
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
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipment">Référence d'expédition</Label>
              <Input 
                id="shipment" 
                name="shipment" 
                value={documentData.shipment} 
                onChange={handleChange} 
                placeholder="EXP-12345" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select 
                value={documentData.format} 
                onValueChange={(value) => handleSelectChange('format', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le format" />
                </SelectTrigger>
                <SelectContent>
                  {documentFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={documentData.description} 
              onChange={handleChange} 
              placeholder="Description du document..." 
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input 
              id="tags" 
              name="tags" 
              value={documentData.tags} 
              onChange={handleChange} 
              placeholder="urgent, confidentiel, client"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Fichier *</Label>
            <div className="border-2 border-dashed rounded-md p-6 relative">
              <input
                type="file"
                id="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              
              {!selectedFile ? (
                <div className="text-center">
                  <FileUp className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Glissez-déposez votre fichier ici ou cliquez pour parcourir
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Parcourir
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentCreateDialog;
