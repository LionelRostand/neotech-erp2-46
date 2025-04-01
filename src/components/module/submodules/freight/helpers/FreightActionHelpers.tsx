
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Download, Printer, Archive, FileUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import DocumentViewDialog from '../DocumentViewDialog';

/**
 * Fonctions d'action pour les documents
 */
export const viewDocument = (document: any, { toast }: { toast: any }) => {
  // Ouvrir le dialogue de visualisation du document
  return document;
};

export const downloadDocument = (document: any, { toast }: { toast: any }) => {
  toast({
    title: "Téléchargement lancé",
    description: `Le document "${document.name}" est en cours de téléchargement.`,
  });
  
  // Simuler un téléchargement après un court délai
  setTimeout(() => {
    toast({
      title: "Téléchargement terminé",
      description: `Le document "${document.name}" a été téléchargé avec succès.`,
    });
  }, 1500);
};

export const printDocument = (document: any, { toast }: { toast: any }) => {
  toast({
    title: "Impression en cours",
    description: `Le document "${document.name}" est en cours de préparation pour impression.`,
  });
  
  // Simuler une impression après un court délai
  setTimeout(() => {
    toast({
      title: "Document prêt à imprimer",
      description: `Le document "${document.name}" est prêt pour l'impression.`,
    });
    // Dans une application réelle, ouvrir la boîte de dialogue d'impression
    window.print();
  }, 1500);
};

export const exportDocuments = ({ toast }: { toast: any }) => {
  toast({
    title: "Export en cours",
    description: "Les documents sont en cours d'export, veuillez patienter...",
  });
  
  // Simuler un export après un court délai
  setTimeout(() => {
    toast({
      title: "Export terminé",
      description: "Les documents ont été exportés avec succès.",
    });
  }, 2000);
};

export const viewArchives = ({ toast }: { toast: any }) => {
  toast({
    title: "Archives",
    description: "Chargement des archives de documents...",
  });
};

/**
 * Boutons d'action pour les documents dans le tableau
 */
export const ActionButtons: React.FC<{
  type: 'document' | 'template';
  onView?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onUse?: () => void;
}> = ({ type, onView, onEdit, onDownload, onPrint, onUse }) => {
  return (
    <div className="flex space-x-1">
      {onView && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onView}
          title="Visualiser"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      
      {onEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
          title="Modifier"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {onDownload && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDownload}
          title="Télécharger"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
      
      {onPrint && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPrint}
          title="Imprimer"
        >
          <Printer className="h-4 w-4" />
        </Button>
      )}
      
      {onUse && type === 'template' && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onUse}
          title="Utiliser ce modèle"
        >
          <FileUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

/**
 * Dialogue pour créer/modifier un document
 */
export const DocumentDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: any) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [document, setDocument] = useState({
    name: '',
    type: 'invoice',
    content: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDocument(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(document);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau document</DialogTitle>
          <DialogDescription>
            Créez un nouveau document en remplissant le formulaire ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du document</Label>
              <Input
                id="name"
                name="name"
                value={document.name}
                onChange={handleChange}
                placeholder="Facture EXP-1234"
              />
            </div>
            
            {/* Autres champs du formulaire */}
            
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Input 
                id="content"
                name="content"
                value={document.content}
                onChange={handleChange}
                placeholder="Contenu du document"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
