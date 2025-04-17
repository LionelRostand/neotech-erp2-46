
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useCompaniesQuery } from './hooks/useCompaniesQuery';
import CompaniesTable from '../companies/CompaniesTable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EmployeesCompanies = () => {
  const { data: companies = [], isLoading, refetch } = useCompaniesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateCompany = () => {
    navigate('/modules/companies/create');
  };

  const handleViewCompany = (company: typeof companies[0]) => {
    // Implementation for viewing company details
    console.log('View company:', company);
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success('Liste des entreprises actualisée');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des entreprises</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleCreateCompany}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entreprise
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Entreprises</CardTitle>
            <div className="w-72">
              <Input
                type="search"
                placeholder="Rechercher une entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
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
