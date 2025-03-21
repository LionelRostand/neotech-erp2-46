
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormLabel, FormMessage } from '@/components/ui/form';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
        <Input
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          placeholder="Prénom"
          className={formErrors.firstName ? "border-red-500" : ""}
        />
        {formErrors.firstName && <FormMessage>{formErrors.firstName}</FormMessage>}
      </div>
      
      <div className="space-y-2">
        <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
        <Input
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          placeholder="Nom"
          className={formErrors.lastName ? "border-red-500" : ""}
        />
        {formErrors.lastName && <FormMessage>{formErrors.lastName}</FormMessage>}
      </div>
      
      <div className="space-y-2">
        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
        <Input
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="email@exemple.com"
          type="email"
          className={formErrors.email ? "border-red-500" : ""}
        />
        {formErrors.email && <FormMessage>{formErrors.email}</FormMessage>}
      </div>
      
      <div className="space-y-2">
        <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
        <Input
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="06 12 34 56 78"
          className={formErrors.phone ? "border-red-500" : ""}
        />
        {formErrors.phone && <FormMessage>{formErrors.phone}</FormMessage>}
      </div>
      
      <div className="space-y-2">
        <FormLabel>Date de naissance</FormLabel>
        <Input
          value={formData.birthDate}
          onChange={(e) => onChange('birthDate', e.target.value)}
          type="date"
        />
      </div>
      
      <div className="space-y-2">
        <FormLabel>Coiffeur préféré</FormLabel>
        <Select 
          value={formData.preferredStylist} 
          onValueChange={(value) => onChange('preferredStylist', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un coiffeur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alexandra">Alexandra</SelectItem>
            <SelectItem value="thomas">Thomas</SelectItem>
            <SelectItem value="sophie">Sophie</SelectItem>
            <SelectItem value="nicolas">Nicolas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 col-span-2">
        <FormLabel>Adresse</FormLabel>
        <Input
          value={formData.address}
          onChange={(e) => onChange('address', e.target.value)}
          placeholder="Adresse"
        />
      </div>

      <div className="space-y-2 col-span-2">
        <FormLabel>Préférences / Allergies</FormLabel>
        <Textarea
          value={formData.preferences}
          onChange={(e) => onChange('preferences', e.target.value)}
          placeholder="Préférences de coiffure, soins, produits, allergies..."
          rows={3}
        />
      </div>

      {isEdit && (
        <div className="space-y-2 col-span-2">
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={formData.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Notes internes sur le client..."
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default ClientForm;
