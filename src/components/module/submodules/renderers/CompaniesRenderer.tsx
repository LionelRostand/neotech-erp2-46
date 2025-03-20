
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
