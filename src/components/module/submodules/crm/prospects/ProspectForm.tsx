
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Prospect, ProspectFormData } from '../types/crm-types';

export interface ProspectFormProps {
  initialData?: Prospect;
  onSubmit: (data: ProspectFormData) => void;
  formData: ProspectFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  sourceOptions: { value: string; label: string; }[];
  statusOptions: { value: string; label: string; }[];
  buttonText: string;
}

const ProspectForm: React.FC<ProspectFormProps> = ({
  onSubmit,
  formData,
  handleInputChange,
  handleSelectChange,
  sourceOptions,
  statusOptions,
  buttonText
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nom du prospect"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Entreprise</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Nom de l'entreprise"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactName">Nom du contact</Label>
          <Input
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            placeholder="Nom du contact principal"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email du contact</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="email@exemple.com"
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
            placeholder="01 23 45 67 89"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email de l'entreprise</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="contact@entreprise.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone de l'entreprise</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="01 98 76 54 32"
          />
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
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Secteur d'activité</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder="Secteur d'activité"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="www.exemple.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Adresse complète"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
          <Input
            id="estimatedValue"
            name="estimatedValue"
            type="number"
            value={formData.estimatedValue || ''}
            onChange={handleInputChange}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Notes additionnelles sur ce prospect..."
          rows={4}
        />
      </div>
      
      <Button type="submit" className="w-full">
        {buttonText}
      </Button>
    </form>
  );
};

export default ProspectForm;
