
import React, { useState } from 'react';
import { 
  Eye, Download, Printer, Edit, Trash2, Plus, CheckCircle,
  Upload, ArrowRight, FilePlus, FileCheck, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Dialog for adding or editing a promotion
export const PromotionDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  promotion?: any;
  onSave: (promotion: any) => void;
}> = ({ isOpen, onClose, promotion, onSave }) => {
  const { toast } = useToast();
  const isEditing = !!promotion;
  
  const handleSave = () => {
    toast({
      title: `Promotion ${isEditing ? 'modifiée' : 'ajoutée'} avec succès`,
      description: `La promotion a été ${isEditing ? 'mise à jour' : 'créée'}.`,
    });
    onSave(promotion || {});
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier' : 'Nouvelle'} promotion</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les détails de la promotion existante.' : 'Créez une nouvelle promotion pour vos expéditions.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input id="name" className="col-span-3" defaultValue={promotion?.name || ''} />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">Code</Label>
            <Input id="code" className="col-span-3" defaultValue={promotion?.code || ''} />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">Réduction (%)</Label>
            <Input 
              id="discount" 
              type="number" 
              min="0" 
              max="100" 
              className="col-span-3" 
              defaultValue={promotion?.discount || '10'} 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-date" className="text-right">Date début</Label>
            <Input 
              id="start-date" 
              type="date" 
              className="col-span-3" 
              defaultValue={promotion?.startDate || ''} 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-date" className="text-right">Date fin</Label>
            <Input 
              id="end-date" 
              type="date" 
              className="col-span-3" 
              defaultValue={promotion?.endDate || ''} 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Statut</Label>
            <Select defaultValue={promotion?.status || 'active'}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="scheduled">Planifié</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea 
              id="description" 
              className="col-span-3" 
              defaultValue={promotion?.description || ''} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog for adding or editing a pricing model
export const PricingDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pricing?: any;
  onSave: (pricing: any) => void;
}> = ({ isOpen, onClose, pricing, onSave }) => {
  const { toast } = useToast();
  const isEditing = !!pricing;
  
  const handleSave = () => {
    toast({
      title: `Tarif ${isEditing ? 'modifié' : 'ajouté'} avec succès`,
      description: `Le modèle de tarification a été ${isEditing ? 'mis à jour' : 'créé'}.`,
    });
    onSave(pricing || {});
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier' : 'Nouveau'} modèle de tarification</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les détails du modèle de tarification.' : 'Créez un nouveau modèle de tarification pour vos expéditions.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input id="name" className="col-span-3" defaultValue={pricing?.name || ''} />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="base-price" className="text-right">Prix de base</Label>
            <Input 
              id="base-price" 
              type="number" 
              min="0" 
              className="col-span-3" 
              defaultValue={pricing?.basePrice || '10'} 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight-factor" className="text-right">Facteur poids (€/kg)</Label>
            <Input 
              id="weight-factor" 
              type="number" 
              min="0" 
              step="0.01" 
              className="col-span-3" 
              defaultValue={pricing?.weightFactor || '1.5'} 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="distance-factor" className="text-right">Facteur distance (€/km)</Label>
            <Input 
              id="distance-factor" 
              type="number" 
              min="0" 
              step="0.01" 
              className="col-span-3" 
              defaultValue={pricing?.distanceFactor || '0.5'} 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="volume-factor" className="text-right">Facteur volume (€/m³)</Label>
            <Input 
              id="volume-factor" 
              type="number" 
              min="0" 
              step="0.01" 
              className="col-span-3" 
              defaultValue={pricing?.volumeFactor || '5'} 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type d'expédition</Label>
            <Select defaultValue={pricing?.type || 'standard'}>
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="economy">Économique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea 
              id="description" 
              className="col-span-3" 
              defaultValue={pricing?.description || ''} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog for adding or editing a document
export const DocumentDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  document?: any;
  onSave: (document: any) => void;
}> = ({ isOpen, onClose, document, onSave }) => {
  const { toast } = useToast();
  const isEditing = !!document;
  
  const handleSave = () => {
    toast({
      title: `Document ${isEditing ? 'modifié' : 'ajouté'} avec succès`,
      description: `Le document a été ${isEditing ? 'mis à jour' : 'créé'}.`,
    });
    onSave(document || {});
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier' : 'Nouveau'} document</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les détails du document.' : 'Ajoutez un nouveau document à l\'expédition.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nom</Label>
            <Input id="name" className="col-span-3" defaultValue={document?.name || ''} />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select defaultValue={document?.type || 'invoice'}>
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Facture</SelectItem>
                <SelectItem value="bol">Connaissement</SelectItem>
                <SelectItem value="customs">Document douanier</SelectItem>
                <SelectItem value="certificate">Certificat</SelectItem>
                <SelectItem value="contract">Contrat</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shipment" className="text-right">Expédition</Label>
            <Select defaultValue={document?.shipment || ''}>
              <SelectTrigger id="shipment" className="col-span-3">
                <SelectValue placeholder="Associer à une expédition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXP-1030">EXP-1030</SelectItem>
                <SelectItem value="EXP-1029">EXP-1029</SelectItem>
                <SelectItem value="EXP-1028">EXP-1028</SelectItem>
                <SelectItem value="none">Aucune</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">Fichier</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input id="file" type="file" />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">Tags</Label>
            <Input id="tags" className="col-span-3" defaultValue={document?.tags || ''} placeholder="Séparés par des virgules" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea 
              id="description" 
              className="col-span-3" 
              defaultValue={document?.description || ''} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Dialog for client invitation
export const ClientInviteDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInvite: (clientData: any) => void;
}> = ({ isOpen, onClose, onInvite }) => {
  const { toast } = useToast();
  
  const handleInvite = () => {
    toast({
      title: "Invitation envoyée",
      description: "Un email d'invitation a été envoyé au client.",
    });
    onInvite({});
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inviter un client</DialogTitle>
          <DialogDescription>
            Invitez un client à accéder au portail de suivi des expéditions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client-name" className="text-right">Nom</Label>
            <Input id="client-name" className="col-span-3" placeholder="Nom du client" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client-email" className="text-right">Email</Label>
            <Input id="client-email" type="email" className="col-span-3" placeholder="email@example.com" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">Société</Label>
            <Input id="company" className="col-span-3" placeholder="Nom de la société" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">Rôle</Label>
            <Select defaultValue="client">
              <SelectTrigger id="role" className="col-span-3">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="client">Client standard</SelectItem>
                <SelectItem value="readonly">Lecture seule</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiration" className="text-right">Expiration</Label>
            <Select defaultValue="never">
              <SelectTrigger id="expiration" className="col-span-3">
                <SelectValue placeholder="Durée de l'accès" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">30 jours</SelectItem>
                <SelectItem value="90days">90 jours</SelectItem>
                <SelectItem value="1year">1 an</SelectItem>
                <SelectItem value="never">Jamais</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">Message</Label>
            <Textarea 
              id="message" 
              className="col-span-3" 
              placeholder="Message personnalisé pour l'invitation (optionnel)" 
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button onClick={handleInvite}>Envoyer l'invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Component for action buttons
export const ActionButtons: React.FC<{
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onUse?: () => void;
  type?: 'standard' | 'document' | 'template' | 'promotion';
}> = ({ 
  onEdit, 
  onDelete, 
  onView, 
  onDownload, 
  onPrint, 
  onUse,
  type = 'standard' 
}) => {
  const { toast } = useToast();
  
  const handleAction = (action: string) => {
    toast({
      title: `Action ${action}`,
      description: `L'action ${action} a été exécutée avec succès.`,
    });
  };
  
  return (
    <div className="flex space-x-1">
      {onView && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onView();
            handleAction('visualiser');
          }}
          title="Visualiser"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      
      {onDownload && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onDownload();
            handleAction('télécharger');
          }}
          title="Télécharger"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
      
      {onPrint && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onPrint();
            handleAction('imprimer');
          }}
          title="Imprimer"
        >
          <Printer className="h-4 w-4" />
        </Button>
      )}
      
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onEdit();
            handleAction('modifier');
          }}
          title="Modifier"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {onUse && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onUse();
            handleAction('utiliser');
          }}
          title="Utiliser"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            onDelete();
            handleAction('supprimer');
          }}
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Calculator component
export const PriceCalculator: React.FC = () => {
  const { toast } = useToast();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  
  const handleCalculate = () => {
    // Simple calculation for demonstration
    const basePrice = parseFloat((document.getElementById('base-price') as HTMLInputElement)?.value || '0');
    const weight = parseFloat((document.getElementById('weight') as HTMLInputElement)?.value || '0');
    const distance = parseFloat((document.getElementById('distance') as HTMLInputElement)?.value || '0');
    const volume = parseFloat((document.getElementById('volume') as HTMLInputElement)?.value || '0');
    
    const weightFactor = 1.5; // €/kg
    const distanceFactor = 0.5; // €/km
    const volumeFactor = 5; // €/m³
    
    const price = basePrice + (weight * weightFactor) + (distance * distanceFactor) + (volume * volumeFactor);
    setCalculatedPrice(price);
    
    toast({
      title: "Prix calculé",
      description: `Le prix a été calculé avec succès: ${price.toFixed(2)} €`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pricing-model">Modèle de tarification</Label>
            <Select defaultValue="standard">
              <SelectTrigger id="pricing-model">
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="economy">Économique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="base-price">Prix de base (€)</Label>
            <Input id="base-price" type="number" defaultValue="10" min="0" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input id="weight" type="number" defaultValue="0" min="0" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="volume">Volume (m³)</Label>
            <Input id="volume" type="number" defaultValue="0" min="0" step="0.01" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input id="distance" type="number" defaultValue="0" min="0" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="promo-code">Code promo</Label>
            <Input id="promo-code" placeholder="Entrez un code promo" />
          </div>
          
          <Button onClick={handleCalculate} className="w-full">Calculer le tarif</Button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Résumé du tarif</h3>
          
          {calculatedPrice !== null ? (
            <div className="space-y-4">
              <div className="flex justify-between pb-2 border-b">
                <span>Tarif de base:</span>
                <span className="font-medium">10.00 €</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span>Coût du poids:</span>
                <span className="font-medium">{((calculatedPrice - 10) * 0.3).toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span>Coût du volume:</span>
                <span className="font-medium">{((calculatedPrice - 10) * 0.5).toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span>Coût de la distance:</span>
                <span className="font-medium">{((calculatedPrice - 10) * 0.2).toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span>Sous-total:</span>
                <span className="font-medium">{calculatedPrice.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between pb-2 border-b">
                <span>Remise:</span>
                <span className="font-medium text-green-600">0.00 €</span>
              </div>
              
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">{calculatedPrice.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="mr-2">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <ArrowRight className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">
                Entrez les détails de l'expédition et cliquez sur "Calculer le tarif" pour voir le résumé.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Function to handle document viewing in a dialog
export const viewDocument = (document: any, { toast }: { toast: any }) => {
  // In a real application, this would show a preview of the document
  toast({
    title: "Document visualisé",
    description: `Le document "${document.name}" a été ouvert pour visualisation.`,
  });
};

// Function to handle document downloading
export const downloadDocument = (document: any, { toast }: { toast: any }) => {
  // In a real application, this would trigger a download
  toast({
    title: "Téléchargement démarré",
    description: `Le document "${document.name}" va être téléchargé.`,
  });
};

// Function to handle document printing
export const printDocument = (document: any, { toast }: { toast: any }) => {
  // In a real application, this would trigger printing
  toast({
    title: "Impression lancée",
    description: `Le document "${document.name}" va être imprimé.`,
  });
};

// Function to handle document export
export const exportDocuments = ({ toast }: { toast: any }) => {
  toast({
    title: "Export démarré",
    description: "Les documents sélectionnés vont être exportés.",
  });
};

// Function to handle navigating to archives
export const viewArchives = ({ toast }: { toast: any }) => {
  toast({
    title: "Archives ouvertes",
    description: "Navigation vers les archives de documents.",
  });
};
