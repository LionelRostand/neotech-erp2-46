
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import CompaniesDashboard from '../companies/CompaniesDashboard';
import CompaniesList from '../companies/CompaniesList';
import CompaniesContacts from '../companies/CompaniesContacts';
import CompaniesDocuments from '../companies/CompaniesDocuments';
import CompaniesReports from '../companies/CompaniesReports';
import CompaniesSettings from '../companies/CompaniesSettings';
import CompanyCreateForm from '../companies/CompanyCreateForm';

export const renderCompaniesSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering companies submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'companies-dashboard':
      return <CompaniesDashboard />;
    case 'companies-list':
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
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
