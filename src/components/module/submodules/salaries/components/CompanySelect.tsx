
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/components/module/submodules/companies/types';
import { Loader2, Building2 } from 'lucide-react';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

interface CompanySelectProps {
  selectedCompanyId: string;
  onCompanySelect: (companyId: string) => void;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ 
  selectedCompanyId, 
  onCompanySelect 
}) => {
  const { companies, isLoading } = useFirebaseCompanies();
  
  const handleValueChange = (value: string) => {
    console.log("Entreprise sélectionnée:", value);
    onCompanySelect(value);
  };
  
  return (
    <div>
      <label htmlFor="company-select" className="block text-sm font-medium text-gray-700 mb-1">
        Entreprise
      </label>
      
      <Select value={selectedCompanyId} onValueChange={handleValueChange}>
        <SelectTrigger id="company-select" className="w-full">
          <SelectValue placeholder="Sélectionner une entreprise" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Chargement...</span>
            </div>
          ) : companies && companies.length > 0 ? (
            companies.map((company) => (
              <SelectItem key={company.id} value={company.id} className="flex items-center">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                  {company.name}
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-2 text-sm text-muted-foreground">
              Aucune entreprise disponible
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CompanySelect;
