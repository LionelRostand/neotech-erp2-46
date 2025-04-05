
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prospect, ProspectFormData } from '../types/crm-types';

export interface ProspectFormProps {
  initialData?: Prospect;
  formData: ProspectFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  onSubmit: (data: ProspectFormData) => void;
  buttonText: string;
}

const ProspectForm: React.FC<ProspectFormProps> = ({
  initialData,
  formData,
  handleInputChange,
  handleSelectChange,
  onSubmit,
  buttonText = "Enregistrer"
}) => {
  // Set initial state from props or use defaults
  const [localFormData, setLocalFormData] = useState<ProspectFormData>(
    formData || {
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'new',
      source: 'Site web',
      notes: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    }
  );

  // If we're using local form data, we need our own handlers
  const handleLocalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocalSelectChange = (name: string, value: string) => {
    setLocalFormData(prev => ({ ...prev, [name]: value }));
  };

  // Use the right handlers based on whether formData was provided
  const inputChangeHandler = handleInputChange || handleLocalInputChange;
  const selectChangeHandler = handleSelectChange || handleLocalSelectChange;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData || localFormData);
  };

  const dataSource = formData || localFormData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            name="company"
            value={dataSource.company}
            onChange={inputChangeHandler}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactName">Nom du contact</Label>
          <Input
            id="contactName"
            name="contactName"
            value={dataSource.contactName}
            onChange={inputChangeHandler}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email du contact</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={dataSource.contactEmail}
            onChange={inputChangeHandler}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Téléphone du contact</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={dataSource.contactPhone}
            onChange={inputChangeHandler}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={dataSource.status}
            onValueChange={(value) => selectChangeHandler('status', value)}
          >
            <SelectTrigger id="status">
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
          <Label htmlFor="source">Source</Label>
          <Select
            value={dataSource.source}
            onValueChange={(value) => selectChangeHandler('source', value)}
          >
            <SelectTrigger id="source">
              <SelectValue placeholder="Sélectionner une source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Site web">Site web</SelectItem>
              <SelectItem value="Réseaux sociaux">Réseaux sociaux</SelectItem>
              <SelectItem value="Référence">Référence</SelectItem>
              <SelectItem value="Salon professionnel">Salon professionnel</SelectItem>
              <SelectItem value="Publicité">Publicité</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industrie</Label>
          <Input
            id="industry"
            name="industry"
            value={dataSource.industry || ''}
            onChange={inputChangeHandler}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            name="website"
            value={dataSource.website || ''}
            onChange={inputChangeHandler}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          value={dataSource.address || ''}
          onChange={inputChangeHandler}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          value={dataSource.notes || ''}
          onChange={inputChangeHandler}
        />
      </div>

      <Button type="submit" className="w-full">{buttonText}</Button>
    </form>
  );
};

export default ProspectForm;
