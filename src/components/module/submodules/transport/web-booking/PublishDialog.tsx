
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Globe, CheckCircle2, Loader2, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (domain?: string) => void;
  publishedUrl: string;
  isPublished: boolean;
}

const PublishDialog: React.FC<PublishDialogProps> = ({
  isOpen,
  onClose,
  onPublish,
  publishedUrl,
  isPublished
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [isEditingDomain, setIsEditingDomain] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    
    // Simuler un délai de publication
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
      
      // Appeler la fonction onPublish après un délai pour montrer le succès
      setTimeout(() => {
        onPublish(customDomain || undefined);
        setShowSuccess(false);
      }, 1500);
    }, 2000);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publier le site de réservation</DialogTitle>
          <DialogDescription>
            Publiez votre site de réservation pour le rendre accessible à vos clients.
          </DialogDescription>
        </DialogHeader>
        
        {isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 py-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Site publié avec succès</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">URL publique de votre site :</p>
              <div className="flex gap-2">
                {isEditingDomain ? (
                  <div className="flex-1 flex gap-2">
                    <Input 
                      value={customDomain || publishedUrl} 
                      onChange={handleDomainChange}
                      placeholder="Entrez un domaine personnalisé"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsEditingDomain(false);
                        onPublish(customDomain);
                      }}
                    >
                      Sauvegarder
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input value={publishedUrl} readOnly className="flex-1" />
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(publishedUrl)}>
                      Copier
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingDomain(true)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Partagez cette URL avec vos clients pour qu'ils puissent accéder à votre système de réservation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">
              En publiant votre site, il sera accessible à toute personne disposant du lien.
              Vous pourrez toujours modifier votre site après publication.
            </p>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Domaine personnalisé (optionnel) :</p>
              <Input
                placeholder="example.booking-demo.com"
                value={customDomain}
                onChange={handleDomainChange}
              />
              <p className="text-xs text-muted-foreground">
                Laissez vide pour utiliser un domaine automatique.
              </p>
            </div>
            
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 mb-2" />
                <p className="font-medium">Publication réussie !</p>
              </div>
            ) : null}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {isPublished ? 'Fermer' : 'Annuler'}
          </Button>
          
          {!isPublished && !showSuccess && (
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Publier maintenant
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
