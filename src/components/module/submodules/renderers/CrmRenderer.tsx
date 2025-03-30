
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import CrmClients from '../crm/CrmClients';
import CrmProspects from '../crm/CrmProspects';
import CrmSettings from '../crm/CrmSettings';
import CrmDashboard from '../crm/CrmDashboard';
import CrmOpportunities from '../crm/CrmOpportunities';
import CrmAnalytics from '../crm/CrmAnalytics';
import { SubModule } from '@/data/types/modules';

export const renderCrmSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'crm-dashboard':
      return <CrmDashboard />;
    case 'crm-clients':
      return <CrmClients />;
    case 'crm-prospects':
      return <CrmProspects />;
    case 'crm-opportunities':
      return <CrmOpportunities />;
    case 'crm-analytics':
      return <CrmAnalytics />;
    case 'crm-settings':
      return <CrmSettings />;
    default:
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};
