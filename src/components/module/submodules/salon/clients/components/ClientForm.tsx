
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientFormData, ClientFormErrors } from '../hooks/useClientForm';

interface ClientFormProps {
  formData: ClientFormData;
  formErrors: ClientFormErrors;
  onChange: (field: string, value: string) => void;
  isEdit?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  formData,
  formErrors,
  onChange,
  isEdit = false
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
          />
          {formErrors.firstName && (
            <p className="text-sm text-destructive">{formErrors.firstName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
          />
          {formErrors.lastName && (
            <p className="text-sm text-destructive">{formErrors.lastName}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@exemple.com"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
          {formErrors.email && (
            <p className="text-sm text-destructive">{formErrors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            placeholder="06 12 34 56 78"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
          {formErrors.phone && (
            <p className="text-sm text-destructive">{formErrors.phone}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => onChange('birthDate', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="preferredStylist">Coiffeur préféré</Label>
          <Select 
            value={formData.preferredStylist || "no-preference"} 
            onValueChange={(value) => onChange('preferredStylist', value === "no-preference" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un coiffeur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-preference">Aucune préférence</SelectItem>
              <SelectItem value="alexandra">Alexandra</SelectItem>
              <SelectItem value="nicolas">Nicolas</SelectItem>
              <SelectItem value="sophie">Sophie</SelectItem>
              <SelectItem value="thomas">Thomas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          placeholder="Adresse complète"
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="preferences">Préférences capillaires</Label>
        <Textarea
          id="preferences"
          placeholder="Préférences, sensibilités, allergies..."
          rows={3}
          value={formData.preferences}
          onChange={(e) => onChange('preferences', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Notes diverses sur le client..."
          rows={3}
          value={formData.notes}
          onChange={(e) => onChange('notes', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClientForm;
