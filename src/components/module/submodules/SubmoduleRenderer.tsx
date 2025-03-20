
import React from 'react';
import DefaultSubmoduleContent from './DefaultSubmoduleContent';
import EmployeesAttendance from './EmployeesAttendance';
import EmployeesBadges from './EmployeesBadges';
import EmployeesDashboard from './EmployeesDashboard';
import EmployeesDepartments from './departments/EmployeesDepartments';
import EmployeesHierarchy from './EmployeesHierarchy';
import EmployeesProfiles from './EmployeesProfiles';
import EmployeesTimesheet from './EmployeesTimesheet';
import EmployeesReports from './EmployeesReports';
import EmployeesLeaves from './EmployeesLeaves';
import FreightDashboard from './FreightDashboard';
import FreightShipments from './FreightShipments';
import FreightPackages from './freight/FreightPackages';
import FreightTracking from './freight/FreightTracking';
import EmployeesAbsences from './EmployeesAbsences';
import EmployeesContracts from './EmployeesContracts';
import EmployeesDocuments from './EmployeesDocuments';
import EmployeesEvaluations from './EmployeesEvaluations';
import EmployeesTrainings from './EmployeesTrainings';
import EmployeesSalaries from './EmployeesSalaries';
import EmployeesRecruitment from './EmployeesRecruitment';
import EmployeesSettings from './EmployeesSettings';
import CompaniesDashboard from './companies/CompaniesDashboard';
import CompaniesContacts from './companies/CompaniesContacts';
import CompaniesList from './companies/CompaniesList';
import CompanyCreateForm from './companies/CompanyCreateForm';
import CompaniesDocuments from './companies/CompaniesDocuments';
import CompaniesReports from './companies/CompaniesReports';
import CompaniesSettings from './companies/CompaniesSettings';
import CrmClients from './crm/CrmClients';
import CrmProspects from './crm/CrmProspects';
import CrmSettings from './crm/CrmSettings';
import CrmDashboard from './crm/CrmDashboard';
import CrmOpportunities from './crm/CrmOpportunities';
import CrmAnalytics from './crm/CrmAnalytics';
import ProjectDashboard from './projects/ProjectDashboard';
import ProjectsList from './projects/ProjectsList';
import TasksPage from './projects/TasksPage';
import TeamsPage from './projects/TeamsPage';
import ReportsPage from './projects/ReportsPage';
import SettingsPage from './projects/SettingsPage';
import AccountingDashboard from './accounting/AccountingDashboard';
import InvoicesPage from './accounting/InvoicesPage';
import PaymentsPage from './accounting/PaymentsPage';
import TaxesPage from './accounting/TaxesPage';
import AccountingReportsPage from './accounting/ReportsPage';
import AccountingSettingsPage from './accounting/SettingsPage';
import MessagesDashboard from '../messages/dashboard/MessagesDashboard';
import ContactsPage from '../messages/contacts/ContactsPage';
import ComposePage from '../messages/compose/ComposePage';
import InboxPage from '../messages/inbox/InboxPage';
import ArchivePage from '../messages/archive/ArchivePage';
import ScheduledPage from '../messages/scheduled/ScheduledPage';
import MessagesSettingsPage from '../messages/settings/SettingsPage';
import ConsultationsPage from './health/ConsultationsPage';
import { SubModule } from '@/data/types/modules';

interface SubmoduleRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderSubmoduleContent = ({ submoduleId, submodule }: SubmoduleRendererProps) => {
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
    case 'crm-opportunities':
      return <CrmOpportunities />;
    case 'crm-analytics':
      return <CrmAnalytics />;
    case 'crm-settings':
      return <CrmSettings />;
    
    // Projects module
    case 'projects-list':
      return <ProjectsList />;
    case 'projects-dashboard':
      return <ProjectDashboard />;
    case 'projects-tasks':
      return <TasksPage />;
    case 'projects-teams':
      return <TeamsPage />;
    case 'projects-reports':
      return <ReportsPage />;
    case 'projects-settings':
      return <SettingsPage />;
    
    // Accounting module
    case 'accounting-dashboard':
      return <AccountingDashboard />;
    case 'accounting-invoices':
      return <InvoicesPage />;
    case 'accounting-payments':
      return <PaymentsPage />;
    case 'accounting-taxes':
      return <TaxesPage />;
    case 'accounting-reports':
      return <AccountingReportsPage />;
    case 'accounting-settings':
      return <AccountingSettingsPage />;
    
    // Messages module
    case 'messages-dashboard':
      return <MessagesDashboard />;
    case 'messages-contacts':
      return <ContactsPage />;
    case 'messages-compose':
      return <ComposePage />;
    case 'messages-inbox':
      return <InboxPage />;
    case 'messages-archive':
      return <ArchivePage />;
    case 'messages-scheduled':
      return <ScheduledPage />;
    case 'messages-settings':
      return <MessagesSettingsPage />;

    // Health module
    case 'health-consultations':
      return <ConsultationsPage />;
    
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
