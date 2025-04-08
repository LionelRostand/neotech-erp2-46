
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { User } from '@/types/user';

interface UserManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => Promise<void>;
  title: string;
  description: string;
  user?: User | null;
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  user
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    permissions: {
      canViewClients: true,
      canEditClients: false,
      canDeleteClients: false,
      canViewProspects: true,
      canEditProspects: false,
      canDeleteProspects: false,
      canViewOpportunities: true,
      canEditOpportunities: false,
      canDeleteOpportunities: false,
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set form data when user is provided (for edit mode)
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'user',
        permissions: user.permissions || {
          canViewClients: true,
          canEditClients: false,
          canDeleteClients: false,
          canViewProspects: true,
          canEditProspects: false,
          canDeleteProspects: false,
          canViewOpportunities: true,
          canEditOpportunities: false,
          canDeleteOpportunities: false,
        }
      });
    } else {
      // Reset form for new user
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        permissions: {
          canViewClients: true,
          canEditClients: false,
          canDeleteClients: false,
          canViewProspects: true,
          canEditProspects: false,
          canDeleteProspects: false,
          canViewOpportunities: true,
          canEditOpportunities: false,
          canDeleteOpportunities: false,
        }
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: checked
      }
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving user:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-right">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-right">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
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
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="manager">Gestionnaire</SelectItem>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="readonly">Lecture seule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium mb-2">Clients</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canViewClients"
                      checked={formData.permissions.canViewClients}
                      onCheckedChange={(checked) => handlePermissionChange('canViewClients', checked as boolean)}
                    />
                    <label htmlFor="canViewClients" className="text-sm">Voir</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canEditClients"
                      checked={formData.permissions.canEditClients}
                      onCheckedChange={(checked) => handlePermissionChange('canEditClients', checked as boolean)}
                    />
                    <label htmlFor="canEditClients" className="text-sm">Modifier</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canDeleteClients"
                      checked={formData.permissions.canDeleteClients}
                      onCheckedChange={(checked) => handlePermissionChange('canDeleteClients', checked as boolean)}
                    />
                    <label htmlFor="canDeleteClients" className="text-sm">Supprimer</label>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium mb-2">Prospects</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canViewProspects"
                      checked={formData.permissions.canViewProspects}
                      onCheckedChange={(checked) => handlePermissionChange('canViewProspects', checked as boolean)}
                    />
                    <label htmlFor="canViewProspects" className="text-sm">Voir</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canEditProspects"
                      checked={formData.permissions.canEditProspects}
                      onCheckedChange={(checked) => handlePermissionChange('canEditProspects', checked as boolean)}
                    />
                    <label htmlFor="canEditProspects" className="text-sm">Modifier</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canDeleteProspects"
                      checked={formData.permissions.canDeleteProspects}
                      onCheckedChange={(checked) => handlePermissionChange('canDeleteProspects', checked as boolean)}
                    />
                    <label htmlFor="canDeleteProspects" className="text-sm">Supprimer</label>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium mb-2">Opportunités</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canViewOpportunities"
                      checked={formData.permissions.canViewOpportunities}
                      onCheckedChange={(checked) => handlePermissionChange('canViewOpportunities', checked as boolean)}
                    />
                    <label htmlFor="canViewOpportunities" className="text-sm">Voir</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canEditOpportunities"
                      checked={formData.permissions.canEditOpportunities}
                      onCheckedChange={(checked) => handlePermissionChange('canEditOpportunities', checked as boolean)}
                    />
                    <label htmlFor="canEditOpportunities" className="text-sm">Modifier</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="canDeleteOpportunities"
                      checked={formData.permissions.canDeleteOpportunities}
                      onCheckedChange={(checked) => handlePermissionChange('canDeleteOpportunities', checked as boolean)}
                    />
                    <label htmlFor="canDeleteOpportunities" className="text-sm">Supprimer</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
