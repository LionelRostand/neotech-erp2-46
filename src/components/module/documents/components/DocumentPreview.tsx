
import React, { useState } from 'react';
import { DocumentFile } from '../types/document-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Download, 
  Users, 
  History, 
  Tag, 
  Pencil, 
  Link, 
  Archive, 
  Trash2, 
  FileText,
  FileImage,
  ExternalLink,
  LockKeyhole
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatFileSize } from '../utils/formatUtils';

interface DocumentPreviewProps {
  document: DocumentFile;
  onPermissionsClick?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  document,
  onPermissionsClick
}) => {
  const [currentTab, setCurrentTab] = useState('details');
  
  // Determine if preview is available
  const isPreviewAvailable = ['pdf', 'jpg', 'jpeg', 'png'].includes(document.format.toLowerCase());
  
  // Render placeholder for missing preview
  const renderPlaceholder = () => {
    if (document.format.toLowerCase() === 'pdf') {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-md h-56">
          <FileText className="h-16 w-16 text-red-500 mb-3" />
          <h3 className="text-base font-medium">Aperçu PDF</h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            L'aperçu PDF n'est pas disponible dans cette démo
          </p>
        </div>
      );
    }
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(document.format.toLowerCase())) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-md h-56">
          <FileImage className="h-16 w-16 text-blue-500 mb-3" />
          <h3 className="text-base font-medium">Aperçu Image</h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            L'aperçu d'image n'est pas disponible dans cette démo
          </p>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-md h-56">
        <FileText className="h-16 w-16 text-gray-500 mb-3" />
        <h3 className="text-base font-medium">Aucun aperçu disponible</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Ce type de fichier ne peut pas être prévisualisé
        </p>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Preview area */}
      {isPreviewAvailable ? (
        renderPlaceholder()
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-md h-56">
          <FileText className="h-16 w-16 text-gray-500 mb-3" />
          <h3 className="text-base font-medium">Aperçu non disponible</h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Ce type de fichier ne peut pas être prévisualisé
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>
      )}
      
      {/* Document details tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">
            Détails
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex-1">
            Versions
          </TabsTrigger>
          <TabsTrigger value="sharing" className="flex-1">
            Partage
          </TabsTrigger>
        </TabsList>
        
        {/* Details tab */}
        <TabsContent value="details" className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Taille:</div>
            <div>{formatFileSize(document.size)}</div>
            
            <div className="text-muted-foreground">Format:</div>
            <div>{document.format.toUpperCase()}</div>
            
            <div className="text-muted-foreground">Créé le:</div>
            <div>{format(new Date(document.createdAt), 'PPp', { locale: fr })}</div>
            
            <div className="text-muted-foreground">Modifié le:</div>
            <div>{format(new Date(document.updatedAt), 'PPp', { locale: fr })}</div>
            
            {document.isEncrypted && (
              <>
                <div className="text-muted-foreground">Sécurité:</div>
                <div className="flex items-center">
                  <LockKeyhole className="h-3 w-3 mr-1 text-green-600" />
                  <span>Chiffré (AES-256)</span>
                </div>
              </>
            )}
          </div>
          
          {document.description && (
            <div className="space-y-1 border-t pt-2 mt-2">
              <div className="text-sm text-muted-foreground">Description:</div>
              <p className="text-sm">{document.description}</p>
            </div>
          )}
          
          {document.tags.length > 0 && (
            <div className="space-y-1 border-t pt-2 mt-2">
              <div className="text-sm text-muted-foreground">Tags:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {document.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Versions tab */}
        <TabsContent value="versions" className="pt-2">
          {document.versions.length === 0 ? (
            <div className="text-sm text-center text-muted-foreground py-4">
              <History className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>Aucune version précédente</p>
              <p className="text-xs mt-1">Ce document n'a pas été modifié</p>
            </div>
          ) : (
            <div className="space-y-2">
              {document.versions.map((version, index) => (
                <div key={index} className="border rounded-md p-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{version.id}</span>
                    <Badge variant="outline">{formatFileSize(version.size)}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(version.createdAt), 'PPp', { locale: fr })}
                  </div>
                  {version.notes && (
                    <div className="mt-1 text-xs border-t pt-1">
                      {version.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-3 pt-2 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <Pencil className="h-3 w-3 mr-2" />
              Créer une nouvelle version
            </Button>
          </div>
        </TabsContent>
        
        {/* Sharing tab */}
        <TabsContent value="sharing" className="pt-2">
          <div className="space-y-3">
            {document.permissions.length === 0 ? (
              <div className="text-sm text-center text-muted-foreground py-4">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>Aucun partage</p>
                <p className="text-xs mt-1">Ce document n'est pas partagé</p>
              </div>
            ) : (
              <div className="space-y-2">
                {document.permissions.map((perm, index) => (
                  <div key={index} className="border rounded-md p-2 text-sm flex justify-between items-center">
                    <div>
                      <div className="font-medium">{perm.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        Accordé le {format(new Date(perm.grantedAt), 'PP', { locale: fr })}
                      </div>
                    </div>
                    <Badge>
                      {perm.accessLevel === 'view' ? 'Lecture' : 
                       perm.accessLevel === 'edit' ? 'Édition' : 
                       'Contrôle total'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-3 space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={onPermissionsClick}
              >
                <Users className="h-3 w-3 mr-2" />
                Gérer les permissions
              </Button>
              
              <Button variant="outline" size="sm" className="w-full">
                <Link className="h-3 w-3 mr-2" />
                Créer un lien de partage
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Action buttons */}
      <div className="flex gap-2 pt-2 mt-2 border-t">
        <Button variant="outline" size="sm" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ouvrir
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Archive className="h-4 w-4 mr-2" />
          Archiver
        </Button>
        <Button variant="destructive" size="sm" className="flex-1">
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>
    </div>
  );
};
