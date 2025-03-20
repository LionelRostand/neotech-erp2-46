
import React from 'react';
import DefaultSubmoduleContent from './submodules/DefaultSubmoduleContent';
import SubmoduleHeader from './submodules/SubmoduleHeader';
import { modules } from '@/data/modules';
import EmployeesAttendance from './submodules/EmployeesAttendance';
import EmployeesBadges from './submodules/EmployeesBadges';
import EmployeesDashboard from './submodules/EmployeesDashboard';
import EmployeesDepartments from './submodules/departments/EmployeesDepartments';
import EmployeesHierarchy from './submodules/EmployeesHierarchy';
import EmployeesProfiles from './submodules/EmployeesProfiles';
import EmployeesTimesheet from './submodules/EmployeesTimesheet';
import EmployeesReports from './submodules/EmployeesReports';
import EmployeesLeaves from './submodules/EmployeesLeaves';
import FreightDashboard from './submodules/FreightDashboard';
import FreightShipments from './submodules/FreightShipments';
import FreightPackages from './submodules/freight/FreightPackages';
import FreightTracking from './submodules/freight/FreightTracking';
import EmployeesAbsences from './submodules/EmployeesAbsences';
import EmployeesContracts from './submodules/EmployeesContracts';
import EmployeesDocuments from './submodules/EmployeesDocuments';
import EmployeesEvaluations from './submodules/EmployeesEvaluations';
import EmployeesTrainings from './submodules/EmployeesTrainings';
import EmployeesSalaries from './submodules/EmployeesSalaries';
import EmployeesRecruitment from './submodules/EmployeesRecruitment';
import EmployeesSettings from './submodules/EmployeesSettings';
import CompaniesDashboard from './submodules/companies/CompaniesDashboard';
import CompaniesContacts from './submodules/companies/CompaniesContacts';
import CompaniesList from './submodules/companies/CompaniesList';
import CompanyCreateForm from './submodules/companies/CompanyCreateForm';
import CompaniesDocuments from './submodules/companies/CompaniesDocuments';
import CompaniesReports from './submodules/companies/CompaniesReports';
import CompaniesSettings from './submodules/companies/CompaniesSettings';
import CrmClients from './submodules/crm/CrmClients';
import CrmProspects from './submodules/crm/CrmProspects';
import CrmSettings from './submodules/crm/CrmSettings';
import CrmDashboard from './submodules/crm/CrmDashboard';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  // Find the module
  const module = modules.find(m => m.id === moduleId);
  if (!module) return <div>Module not found</div>;
  
  // Find the submodule
  const submodule = module.submodules.find(sm => sm.id === submoduleId);
  if (!submodule) return <div>Submodule not found</div>;
  
  // Render the appropriate component based on submoduleId
  const renderSubmoduleContent = () => {
    switch (submoduleId) {
      // Employees module
      case 'employees-dashboard':
        return <EmployeesDashboard />;
      case 'employees-profiles':
        return <EmployeesProfiles />;
      case 'employees-badges':
        return <EmployeesBadges />;
      case 'employees-departments':
        return <EmployeesDepartments />;
      case 'employees-hierarchy':
        return <EmployeesHierarchy />;
      case 'employees-attendance':
        return <EmployeesAttendance />;
      case 'employees-timesheet':
        return <EmployeesTimesheet />;
      case 'employees-leaves':
        return <EmployeesLeaves />;
      case 'employees-reports':
        return <EmployeesReports />;
      
      // New employee submodules
      case 'employees-absences':
        return <EmployeesAbsences />;
      case 'employees-contracts':
        return <EmployeesContracts />;
      case 'employees-documents':
        return <EmployeesDocuments />;
      case 'employees-evaluations':
        return <EmployeesEvaluations />;
      case 'employees-trainings':
        return <EmployeesTrainings />;
      case 'employees-salaries':
        return <EmployeesSalaries />;
      case 'employees-recruitment':
        return <EmployeesRecruitment />;
      case 'employees-settings':
        return <EmployeesSettings />;
      
      // Freight module
      case 'freight-dashboard':
        return <FreightDashboard />;
      case 'freight-shipments':
        return <FreightShipments />;
      case 'freight-packages':
        return <FreightPackages />;
      case 'freight-tracking':
        return <FreightTracking />;
      
      // Companies module
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
      
      // CRM module
      case 'crm-dashboard':
        return <CrmDashboard />;
      case 'crm-clients':
        return <CrmClients />;
      case 'crm-prospects':
        return <CrmProspects />;
      case 'crm-settings':
        return <CrmSettings />;
      
      // All other freight submodules will default to DefaultSubmoduleContent
      // until they are implemented specifically
      case 'freight-carriers':
      case 'freight-pricing':
      case 'freight-quotes':
      case 'freight-containers':
      case 'freight-orders':
      case 'freight-documents':
      case 'freight-routes':
      case 'freight-warehouses':
      case 'freight-inventory':
      case 'freight-invoicing':
      case 'freight-reports':
      case 'freight-client-portal':
      case 'freight-settings':
        return <DefaultSubmoduleContent submodule={submodule} />;
      
      // Default fallback
      default:
        return <DefaultSubmoduleContent submodule={submodule} />;
    }
  };

  return (
    <div className="space-y-6">
      <SubmoduleHeader 
        module={module}
        submodule={submodule}
      />
      {renderSubmoduleContent()}
    </div>
  );
};

export default SubmodulePage;
