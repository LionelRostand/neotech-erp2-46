
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from '@/components/module/submodules/companies/types';

interface CompanySelectProps {
  companies: Company[] | undefined;
  value: string;
  onSelect: (value: string) => void;
}

export const CompanySelect: React.FC<CompanySelectProps> = ({ companies, value, onSelect }) => {
  return (
    <div>
      <Label htmlFor="companyName">Nom de l'entreprise</Label>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner une entreprise" />
        </SelectTrigger>
        <SelectContent>
          {companies?.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
