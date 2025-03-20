
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ClientFormProps {
  formData: {
    name: string;
    sector: string;
    revenue: string;
    status: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  sectors: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  formData,
  sectors,
  handleInputChange,
  handleSelectChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom de l'entreprise</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nom de l'entreprise"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Secteur d'activité</label>
        <Select
          value={formData.sector}
          onValueChange={(value) => handleSelectChange('sector', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un secteur" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map(sector => (
              <SelectItem key={sector} value={sector}>{sector}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Chiffre d'affaires (€)</label>
        <Input
          name="revenue"
          value={formData.revenue}
          onChange={handleInputChange}
          placeholder="0"
          type="number"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Statut</label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom du contact</label>
        <Input
          name="contactName"
          value={formData.contactName}
          onChange={handleInputChange}
          placeholder="Nom du contact principal"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email du contact</label>
        <Input
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleInputChange}
          placeholder="email@exemple.com"
          type="email"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Téléphone</label>
        <Input
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleInputChange}
          placeholder="+33612345678"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Adresse</label>
        <Input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Adresse"
        />
      </div>
    </div>
  );
};

export default ClientForm;
