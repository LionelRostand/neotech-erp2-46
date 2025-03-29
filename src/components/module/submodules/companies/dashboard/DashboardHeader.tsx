
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();
  
  const navigateToCompanyCreate = () => {
    navigate('/modules/companies/create');
  };
  
  const navigateToCompaniesList = () => {
    navigate('/modules/companies/list');
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord des entreprises</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Vue d'ensemble et statistiques des entreprises partenaires
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={navigateToCompaniesList}>
          <Users className="mr-2 h-4 w-4" />
          Voir toutes les entreprises
        </Button>
        <Button onClick={navigateToCompanyCreate}>
          <Building2 className="mr-2 h-4 w-4" />
          Nouvelle entreprise
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
