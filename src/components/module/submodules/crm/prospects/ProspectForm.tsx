
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ProspectFormData } from '../types/crm-types';

interface ProspectFormProps {
  formData: ProspectFormData;
  sourcesOptions: string[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const ProspectForm: React.FC<ProspectFormProps> = ({
  formData,
  sourcesOptions,
  handleInputChange,
  handleSelectChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nom</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nom du contact"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Entreprise</label>
        <Input
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Nom de l'entreprise"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email@exemple.com"
          type="email"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Téléphone</label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+33612345678"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Statut</label>
        <Select
          value={formData.status || "warm"}
          onValueChange={(value) => handleSelectChange('status', value as 'hot' | 'warm' | 'cold')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hot">Chaud</SelectItem>
            <SelectItem value="warm">Tiède</SelectItem>
            <SelectItem value="cold">Froid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Source</label>
        <Select
          value={formData.source || (sourcesOptions.length > 0 ? sourcesOptions[0] : "website")}
          onValueChange={(value) => handleSelectChange('source', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une source" />
          </SelectTrigger>
          <SelectContent>
            {sourcesOptions.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Date de dernier contact</label>
        <Input
          name="lastContact"
          value={formData.lastContact}
          onChange={handleInputChange}
          type="date"
        />
      </div>
      
      <div className="col-span-2 space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <Input
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Notes sur le prospect"
        />
      </div>
    </div>
  );
};

export default ProspectForm;
