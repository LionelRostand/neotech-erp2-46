
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ClientFormData } from '../types/crm-types';

interface ClientFormProps {
  formData: ClientFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  sectorOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  formData, 
  handleInputChange, 
  handleSelectChange,
  sectorOptions,
  statusOptions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      {/* Nom du client */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom du client</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
          placeholder="Nom de l'entreprise"
          required
        />
      </div>

      {/* Secteur d'activité */}
      <div className="space-y-2">
        <Label htmlFor="sector">Secteur d'activité</Label>
        <Select 
          value={formData.sector || "default-sector"} 
          onValueChange={(value) => handleSelectChange('sector', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Secteur" />
          </SelectTrigger>
          <SelectContent>
            {sectorOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chiffre d'affaires */}
      <div className="space-y-2">
        <Label htmlFor="revenue">Chiffre d'affaires</Label>
        <Select 
          value={formData.revenue || "<1M"} 
          onValueChange={(value) => handleSelectChange('revenue', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chiffre d'affaires" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="<1M">Moins de 1M€</SelectItem>
            <SelectItem value="1-10M">1M€ - 10M€</SelectItem>
            <SelectItem value="10-50M">10M€ - 50M€</SelectItem>
            <SelectItem value="50-100M">50M€ - 100M€</SelectItem>
            <SelectItem value=">100M">Plus de 100M€</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statut */}
      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status || "prospect"}
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
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

      {/* Contact - Nom */}
      <div className="space-y-2">
        <Label htmlFor="contactName">Nom du contact</Label>
        <Input 
          id="contactName" 
          name="contactName" 
          value={formData.contactName} 
          onChange={handleInputChange} 
          placeholder="Nom du contact principal"
        />
      </div>

      {/* Contact - Email */}
      <div className="space-y-2">
        <Label htmlFor="contactEmail">Email du contact</Label>
        <Input 
          id="contactEmail" 
          name="contactEmail" 
          type="email"
          value={formData.contactEmail} 
          onChange={handleInputChange} 
          placeholder="email@exemple.com"
        />
      </div>

      {/* Contact - Téléphone */}
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Téléphone du contact</Label>
        <Input 
          id="contactPhone" 
          name="contactPhone" 
          value={formData.contactPhone} 
          onChange={handleInputChange} 
          placeholder="+33 1 23 45 67 89"
        />
      </div>

      {/* Site web */}
      <div className="space-y-2">
        <Label htmlFor="website">Site web</Label>
        <Input 
          id="website" 
          name="website" 
          value={formData.website || ''} 
          onChange={handleInputChange} 
          placeholder="https://exemple.com"
        />
      </div>

      {/* Adresse */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Adresse</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address || ''} 
          onChange={handleInputChange} 
          placeholder="Adresse complète"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          value={formData.notes || ''} 
          onChange={handleInputChange} 
          placeholder="Notes additionnelles sur ce client"
          rows={4}
        />
      </div>
    </div>
  );
};

export default ClientForm;
