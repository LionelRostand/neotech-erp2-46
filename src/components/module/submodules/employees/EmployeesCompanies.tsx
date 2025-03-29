
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanyService } from '../companies/services/companyService';
import CompaniesTable from '../companies/CompaniesTable';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const EmployeesCompanies: React.FC = () => {
  const { getCompanies } = useCompanyService();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { companies: fetchedCompanies } = await getCompanies();
      setCompanies(fetchedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entreprises",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewCompany = (company) => {
    toast({
      title: "Information",
      description: `Vous avez sélectionné : ${company.name}`,
    });
  };

  const handleCreateCompany = () => {
    navigate('/modules/companies/create');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Entreprises liées</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchCompanies}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button 
              size="sm"
              onClick={handleCreateCompany}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle entreprise
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CompaniesTable 
            companies={companies} 
            loading={loading} 
            onView={handleViewCompany} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesCompanies;
