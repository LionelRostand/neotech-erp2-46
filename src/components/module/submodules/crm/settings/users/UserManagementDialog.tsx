
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types/user";

interface UserManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  user?: User | null;
  title: string;
  description: string;
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
  title,
  description
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    permissions: {
      view: true,
      edit: false,
      delete: false,
      export: false
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // If user is provided, populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        permissions: {
          view: user.permissions?.crm?.read || true,
          edit: user.permissions?.crm?.update || false,
          delete: user.permissions?.crm?.delete || false,
          export: false // Assuming export permission isn't stored in the User object
        }
      });
    } else {
      // Reset form if no user
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        permissions: {
          view: true,
          edit: false,
          delete: false,
          export: false
        }
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };
  
  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      await onSave({
        ...formData,
        id: user?.id // Include the user ID if editing an existing user
      });
      
      onClose();
      toast.success(user ? 'Utilisateur mis à jour avec succès' : 'Utilisateur ajouté avec succès');
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Une erreur est survenue lors de l\'enregistrement');
      toast.error('Erreur lors de l\'enregistrement de l\'utilisateur');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">Utilisateur</SelectItem>
                <SelectItem value="readonly">Lecture seule</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="viewPermission"
                  checked={formData.permissions.view}
                  onCheckedChange={(checked) => handlePermissionChange('view', checked as boolean)}
                />
                <Label htmlFor="viewPermission" className="text-sm">Visualiser</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editPermission"
                  checked={formData.permissions.edit}
                  onCheckedChange={(checked) => handlePermissionChange('edit', checked as boolean)}
                />
                <Label htmlFor="editPermission" className="text-sm">Éditer</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deletePermission"
                  checked={formData.permissions.delete}
                  onCheckedChange={(checked) => handlePermissionChange('delete', checked as boolean)}
                />
                <Label htmlFor="deletePermission" className="text-sm">Supprimer</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exportPermission"
                  checked={formData.permissions.export}
                  onCheckedChange={(checked) => handlePermissionChange('export', checked as boolean)}
                />
                <Label htmlFor="exportPermission" className="text-sm">Exporter</Label>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-2 text-sm">
              {error}
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
