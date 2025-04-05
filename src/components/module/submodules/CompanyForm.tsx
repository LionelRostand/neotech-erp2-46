import React, { useState } from 'react';
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
import { Company } from './companies/types';

interface CompanyFormProps {
  company?: Company;
  isEditing?: boolean;
  onClose: () => void;
  onSave: (company: Partial<Company>) => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  isEditing = false,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Company>>(
    company || {
      name: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      phone: '',
      email: '',
      website: '',
      industry: '',
      size: 'small',
      status: 'active',
      notes: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'street' || name === 'city' || name === 'postalCode' || name === 'country') {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address?.street || !formData.address?.city) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    onSave(formData);
  };

  return (
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
          <Label htmlFor="industry">Secteur d'activité</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Secteur d'activité"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="street">Adresse *</Label>
        <Input
          id="street"
          name="street"
          value={formData.address?.street}
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
            value={formData.address?.city}
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
            value={formData.address?.postalCode}
            onChange={handleChange}
            placeholder="Code postal"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Select
            value={formData.address?.country}
            onValueChange={(value) => {
              setFormData(prev => ({
                ...prev,
                address: {
                  ...prev.address,
                  country: value
                }
              }));
            }}
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
          <Label htmlFor="siret">SIRET</Label>
          <Input
            id="siret"
            name="siret"
            value={formData.siret}
            onChange={handleChange}
            placeholder="Numéro SIRET"
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
            onValueChange={(value) => handleSelectChange('status', value as 'active' | 'inactive' | 'pending')}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Description</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Description de l'entreprise..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {isEditing ? 'Mettre à jour' : 'Ajouter l\'entreprise'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
