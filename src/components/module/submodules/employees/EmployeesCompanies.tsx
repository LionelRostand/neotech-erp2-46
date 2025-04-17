
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import CompaniesTable from '@/components/module/submodules/companies/CompaniesTable';
import { FirebaseErrorAlert } from '@/components/ui/FirebaseErrorAlert';
import { Loader2, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Company } from '@/components/module/submodules/companies/types';
import { useNavigate } from 'react-router-dom';

const EmployeesCompanies: React.FC = () => {
  const { companies, isLoading, error, isOffline, refetch } = useFirebaseCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast.success("Données actualisées");
  };

  const handleViewCompany = (company: Company) => {
    // Naviguer vers la vue détaillée de l'entreprise
    navigate(`/modules/companies/view/${company.id}`);
  };

  const handleCreateCompany = () => {
    // Naviguer vers le formulaire de création d'entreprise
    navigate('/modules/companies/create');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Entreprises</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Actualiser
          </Button>
          <Button size="sm" onClick={handleCreateCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entreprise
          </Button>
        </div>
      </div>

      {isOffline && (
        <div className="rounded-md bg-amber-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Mode hors-ligne actif</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Les données affichées peuvent ne pas être à jour. Certaines fonctionnalités peuvent être limitées.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <FirebaseErrorAlert 
          error={error} 
          onRetry={refetch} 
          className="mb-4" 
        />
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Liste des entreprises</CardTitle>
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <CompaniesTable 
            companies={filteredCompanies} 
            isLoading={isLoading} 
            onView={handleViewCompany}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesCompanies;
