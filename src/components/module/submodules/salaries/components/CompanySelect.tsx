
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface CompanySelectProps {
  selectedCompanyId: string;
  onCompanySelect: (companyId: string) => void;
  label?: string;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ 
  selectedCompanyId, 
  onCompanySelect,
  label = "Entreprise" 
}) => {
  const { companies } = useHrModuleData();

  const handleChange = (value: string) => {
    onCompanySelect(value);
  };

  return (
    <div>
      <label htmlFor="company-select" className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Select value={selectedCompanyId} onValueChange={handleChange}>
        <SelectTrigger id="company-select">
          <SelectValue placeholder="Sélectionner une entreprise" />
        </SelectTrigger>
        <SelectContent>
          {companies && companies.length > 0 ? (
            companies.map(company => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="default">Entreprise par défaut</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelect;
