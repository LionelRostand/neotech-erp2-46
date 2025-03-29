
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import CompaniesDashboard from '../companies/CompaniesDashboard';
import CompaniesContacts from '../companies/CompaniesContacts';
import CompaniesList from '../companies/CompaniesList';
import CompanyCreateForm from '../companies/CompanyCreateForm';
import CompaniesDocuments from '../companies/CompaniesDocuments';
import CompaniesReports from '../companies/CompaniesReports';
import CompaniesSettings from '../companies/CompaniesSettings';
import { SubModule } from '@/data/types/modules';

export const renderCompaniesSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering companies submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'companies-dashboard':
      return <CompaniesDashboard />;
    case 'companies-list':
      console.log('Rendering companies list component');
      return <CompaniesList />;
    case 'companies-create':
      return <CompanyCreateForm />;
    case 'companies-contacts':
      return <CompaniesContacts />;
    case 'companies-documents':
      return <CompaniesDocuments />;
    case 'companies-reports':
      return <CompaniesReports />;
    case 'companies-settings':
      return <CompaniesSettings />;
    default:
      console.warn('Unknown companies submodule:', submoduleId);
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
