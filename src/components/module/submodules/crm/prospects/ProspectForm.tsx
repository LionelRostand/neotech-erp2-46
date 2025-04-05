
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Prospect, ProspectFormData } from '../types/crm-types';

interface ProspectFormProps {
  initialData?: Prospect;
  onSubmit: (data: ProspectFormData) => void;
}

const ProspectForm: React.FC<ProspectFormProps> = ({
  initialData,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ProspectFormData>({
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    source: 'Site web',
    status: 'new',
    notes: '',
    industry: '',
    website: '',
    address: '',
    size: 'small',
    estimatedValue: 0,
    name: '',
    email: '',
    phone: '',
    lastContact: new Date().toISOString().split('T')[0]
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        contactName: initialData.contactName || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
        source: initialData.source || 'Site web',
        status: initialData.status || 'new',
        notes: initialData.notes || '',
        industry: initialData.industry || '',
        website: initialData.website || '',
        address: initialData.address || '',
        size: initialData.size || 'small',
        estimatedValue: initialData.estimatedValue || 0,
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        lastContact: initialData.lastContact || new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Information */}
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Secteur d'activité</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            type="url"
            placeholder="https://"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="size">Taille de l'entreprise</Label>
          <Select
            value={formData.size}
            onValueChange={(value) => handleSelectChange('size', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Petite (1-50)</SelectItem>
              <SelectItem value="medium">Moyenne (51-250)</SelectItem>
              <SelectItem value="large">Grande (251-1000)</SelectItem>
              <SelectItem value="enterprise">Très grande (1000+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-2">
          <Label htmlFor="contactName">Nom du contact</Label>
          <Input
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email du contact</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            type="email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Téléphone du contact</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Prospect Details */}
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select
            value={formData.source}
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Site web">Site web</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="Salon">Salon professionnel</SelectItem>
              <SelectItem value="Recommandation">Recommandation</SelectItem>
              <SelectItem value="Appel entrant">Appel entrant</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="contacted">Contacté</SelectItem>
              <SelectItem value="meeting">Rendez-vous</SelectItem>
              <SelectItem value="proposal">Proposition</SelectItem>
              <SelectItem value="negotiation">Négociation</SelectItem>
              <SelectItem value="converted">Converti</SelectItem>
              <SelectItem value="lost">Perdu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastContact">Dernier contact</Label>
          <Input
            id="lastContact"
            name="lastContact"
            value={formData.lastContact}
            onChange={handleInputChange}
            type="date"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
          <Input
            id="estimatedValue"
            name="estimatedValue"
            value={formData.estimatedValue.toString()}
            onChange={handleInputChange}
            type="number"
            min="0"
          />
        </div>
      </div>
      
      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
        />
      </div>
      
      <Button type="submit" className="w-full">
        {initialData ? 'Mettre à jour' : 'Ajouter'}
      </Button>
    </form>
  );
};

export default ProspectForm;
