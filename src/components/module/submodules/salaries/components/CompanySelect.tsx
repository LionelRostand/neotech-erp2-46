
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/components/module/submodules/companies/types';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { Loader2 } from 'lucide-react';

interface CompanySelectProps {
  selectedCompanyId: string;
  onCompanySelect: (companyId: string, companies: Company[]) => void;
  companies?: Company[];
}

const CompanySelect: React.FC<CompanySelectProps> = ({ 
  selectedCompanyId, 
  onCompanySelect,
  companies: externalCompanies
}) => {
  // Si les entreprises sont fournies en props, on les utilise
  // Sinon, on les récupère depuis Firebase
  const { companies: firebaseCompanies, isLoading } = useFirebaseCompanies();
  
  const companies = externalCompanies || firebaseCompanies || [];
  
  const handleValueChange = (value: string) => {
    onCompanySelect(value, companies);
  };
  
  return (
    <div>
      <label htmlFor="company-select" className="text-sm font-medium">
        Entreprise
      </label>
      
      <Select value={selectedCompanyId} onValueChange={handleValueChange}>
        <SelectTrigger id="company-select" className="w-full mt-1">
          <SelectValue placeholder="Sélectionner une entreprise" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Chargement...</span>
            </div>
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
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
