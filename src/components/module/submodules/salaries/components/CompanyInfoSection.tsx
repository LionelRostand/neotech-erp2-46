
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/components/module/submodules/companies/types';

interface CompanyInfoSectionProps {
  companyName: string;
  setCompanyName: (name: string) => void;
  companyAddress: string;
  setCompanyAddress: (address: string) => void;
  companySiret: string;
  setCompanySiret: (siret: string) => void;
  companies: Company[];
  handleCompanySelect: (companyId: string) => void;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  companyName,
  setCompanyName,
  companyAddress,
  setCompanyAddress,
  companySiret,
  setCompanySiret,
  companies,
  handleCompanySelect
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="companySection">Informations de l'entreprise</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companySelect">Sélectionner une entreprise</Label>
          <Select onValueChange={handleCompanySelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une entreprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">Sélectionner une entreprise</SelectItem>
              {companies.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l'entreprise</Label>
          <Input 
            id="companyName" 
            placeholder="ACME France SAS"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Adresse</Label>
          <Input 
            id="companyAddress" 
            placeholder="15 Rue de la Paix, 75001 Paris"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companySiret">SIRET</Label>
          <Input 
            id="companySiret" 
            placeholder="123 456 789 00012"
            value={companySiret}
            onChange={(e) => setCompanySiret(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoSection;
