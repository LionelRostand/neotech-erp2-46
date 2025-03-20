
import React, { useState } from 'react';
import { useDocumentService } from '../services/documentService';
import { DocumentFile, DocumentPermission } from '../types/document-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Users, LockKeyhole, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentPermissionsDialogProps {
  document: DocumentFile;
  onClose: () => void;
  onUpdate: (document: DocumentFile) => void;
}

export const DocumentPermissionsDialog: React.FC<DocumentPermissionsDialogProps> = ({
  document,
  onClose,
  onUpdate
}) => {
  const { updateDocumentPermissions } = useDocumentService();
  
  const [permissions, setPermissions] = useState<DocumentPermission[]>(document.permissions);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newAccessLevel, setNewAccessLevel] = useState<'view' | 'edit' | 'full'>('view');
  
  // Filter permissions by search query
  const filteredPermissions = permissions.filter(
    perm => perm.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add new permission
  const handleAddPermission = () => {
    if (!newUserName.trim()) {
      toast.error('Veuillez saisir un nom d\'utilisateur');
      return;
    }
    
    // Check if user already has permission
    if (permissions.some(p => p.userName.toLowerCase() === newUserName.toLowerCase())) {
      toast.error('Cet utilisateur a déjà des permissions sur ce document');
      return;
    }
    
    const newPermission: DocumentPermission = {
      userId: `user-${Date.now()}`, // Generate fake user ID
      userName: newUserName.trim(),
      accessLevel: newAccessLevel,
      grantedAt: new Date(),
      grantedBy: 'current-user', // Would be actual user ID
    };
    
    setPermissions([...permissions, newPermission]);
    setNewUserName('');
    toast.success(`Permissions ajoutées pour ${newPermission.userName}`);
  };
  
  // Remove permission
  const handleRemovePermission = (userId: string) => {
    setPermissions(permissions.filter(p => p.userId !== userId));
    toast.success('Permissions supprimées');
  };
  
  // Update permission level
  const handleUpdatePermissionLevel = (userId: string, level: 'view' | 'edit' | 'full') => {
    setPermissions(permissions.map(p => 
      p.userId === userId ? { ...p, accessLevel: level } : p
    ));
  };
  
  // Save permissions
  const handleSavePermissions = async () => {
    setIsLoading(true);
    try {
      await updateDocumentPermissions(document.id, permissions);
      
      // Update the document with new permissions
      const updatedDocument = {
        ...document,
        permissions
      };
      
      onUpdate(updatedDocument);
      onClose();
      toast.success('Permissions mises à jour avec succès');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Gérer les permissions
          </DialogTitle>
          <DialogDescription>
            Définissez qui peut accéder à "{document.name}"
          </DialogDescription>
        </DialogHeader>
        
        {/* Warning for encrypted documents */}
        {document.isEncrypted && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Ce document est chiffré. Seuls les utilisateurs autorisés pourront y accéder.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {/* Owner info */}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <LockKeyhole className="h-4 w-4 text-primary mr-2" />
              <div>
                <div className="text-sm font-medium">Propriétaire</div>
                <div className="text-xs text-muted-foreground">
                  Accès complet • Créé le {new Date(document.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Badge>Vous</Badge>
          </div>
          
          {/* Add new user */}
          <div className="space-y-3 border-b pb-4">
            <Label>Ajouter un utilisateur</Label>
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Nom d'utilisateur ou email"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="flex-1"
              />
              <Select 
                value={newAccessLevel} 
                onValueChange={(value) => setNewAccessLevel(value as any)}
              >
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="Accès" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Lecture</SelectItem>
                  <SelectItem value="edit">Édition</SelectItem>
                  <SelectItem value="full">Complet</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddPermission}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
          
          {/* Permissions list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Utilisateurs avec accès</Label>
              {permissions.length > 0 && (
                <div className="relative">
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 pl-8 h-8 text-sm"
                  />
                  <Search className="h-3 w-3 absolute left-2.5 top-2.5 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {permissions.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                Ce document n'est partagé avec personne
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Niveau d'accès</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-sm text-muted-foreground">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPermissions.map((perm) => (
                        <TableRow key={perm.userId}>
                          <TableCell className="font-medium">{perm.userName}</TableCell>
                          <TableCell>
                            <Select 
                              value={perm.accessLevel} 
                              onValueChange={(value) => handleUpdatePermissionLevel(perm.userId, value as any)}
                            >
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="view">Lecture</SelectItem>
                                <SelectItem value="edit">Édition</SelectItem>
                                <SelectItem value="full">Complet</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => handleRemovePermission(perm.userId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center sm:justify-between mt-6">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSavePermissions} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
