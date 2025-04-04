
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: string;
  sector: string;
  size: string;
  status: 'active' | 'inactive';
  description: string;
  createdAt: string;
}

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Partial<Company>) => void;
  company?: Company;
  isEditing?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  isOpen,
  onClose,
  onSave,
  company,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<Company>>(
    company || {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      phone: '',
      email: '',
      website: '',
      contactPerson: '',
      sector: '',
      size: 'small',
      status: 'active',
      description: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Modifier l'entreprise ${company?.name}` : 'Ajouter une nouvelle entreprise'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'entreprise *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Secteur d'activité</Label>
              <Input
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                placeholder="Secteur d'activité"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ville"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Code postal"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange('country', value)}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Belgique">Belgique</SelectItem>
                  <SelectItem value="Suisse">Suisse</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Téléphone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Personne de contact</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Nom et prénom"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Taille de l'entreprise</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => handleSelectChange('size', value)}
              >
                <SelectTrigger id="size">
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro (1-9 employés)</SelectItem>
                  <SelectItem value="small">Petite (10-49 employés)</SelectItem>
                  <SelectItem value="medium">Moyenne (50-249 employés)</SelectItem>
                  <SelectItem value="large">Grande (250+ employés)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status as string}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description de l'entreprise..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditing ? 'Mettre à jour' : 'Ajouter l'entreprise'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyForm;
