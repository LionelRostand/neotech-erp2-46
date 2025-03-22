
import React from 'react';
import { SubModule } from "@/data/types/modules";
import DefaultSubmoduleContent from './DefaultSubmoduleContent';

// Employees
import EmployeesDashboard from './EmployeesDashboard';
import EmployeesProfiles from './EmployeesProfiles';
import EmployeesContracts from './EmployeesContracts';
import EmployeesBadges from './EmployeesBadges';
import EmployeesTimesheet from './EmployeesTimesheet';
import EmployeesLeaves from './EmployeesLeaves';
import EmployeesAttendance from './EmployeesAttendance';
import EmployeesDepartments from './EmployeesDepartments';
import EmployeesHierarchy from './EmployeesHierarchy';
import EmployeesRecruitment from './EmployeesRecruitment';
import EmployeesEvaluations from './EmployeesEvaluations';
import EmployeesTrainings from './EmployeesTrainings';
import EmployeesSalaries from './EmployeesSalaries';
import EmployeesDocuments from './EmployeesDocuments';
import EmployeesAbsences from './EmployeesAbsences';
import EmployeesReports from './EmployeesReports';
import EmployeesSettings from './EmployeesSettings';

// Freight
import FreightDashboard from './FreightDashboard';
import FreightShipments from './FreightShipments';
import FreightContainers from './freight/FreightContainers';
import FreightTracking from './freight/FreightTracking';
import FreightPricing from './freight/FreightPricing';
import FreightCarriers from './freight/FreightCarriers';
import FreightDocuments from './freight/FreightDocuments';
import FreightClientPortal from './freight/FreightClientPortal';
import FreightPackages from './freight/FreightPackages';
import FreightSettings from './freight/FreightSettings';

// Projects
import ProjectDashboard from './projects/ProjectDashboard';
import ProjectsList from './projects/ProjectsList';
import TasksPage from './projects/TasksPage';
import TeamsPage from './projects/TeamsPage';
import ReportsPage from './projects/ReportsPage';
import SettingsPage from './projects/SettingsPage';

// Accounting
import AccountingDashboard from './accounting/AccountingDashboard';
import InvoicesPage from './accounting/InvoicesPage';
import PaymentsPage from './accounting/PaymentsPage';
import TaxesPage from './accounting/TaxesPage';
import AccountingReportsPage from './accounting/ReportsPage';
import AccountingSettingsPage from './accounting/SettingsPage';

// Documents
import DocumentsFiles from './documents/DocumentsFiles';
import DocumentsArchive from './documents/DocumentsArchive';
import DocumentsSearch from './documents/DocumentsSearch';
import DocumentsSettings from './documents/DocumentsSettings';

// CRM
import CrmDashboard from './crm/CrmDashboard';
import CrmClients from './crm/CrmClients';
import CrmProspects from './crm/CrmProspects';
import CrmOpportunities from './crm/CrmOpportunities';
import CrmAnalytics from './crm/CrmAnalytics';
import CrmSettings from './crm/CrmSettings';

// Companies
import CompaniesDashboard from './companies/CompaniesDashboard';
import CompaniesList from './companies/CompaniesList';
import CompaniesContacts from './companies/CompaniesContacts';
import CompaniesDocuments from './companies/CompaniesDocuments';
import CompaniesReports from './companies/CompaniesReports';
import CompaniesSettings from './companies/CompaniesSettings';

// Health
import HealthDashboard from './health/DashboardPage';
import PatientsPage from './health/PatientsPage';
import AppointmentsPage from './health/AppointmentsPage';
import DoctorsPage from './health/DoctorsPage';
import NursesPage from './health/NursesPage';
import StaffPage from './health/StaffPage';
import ConsultationsPage from './health/ConsultationsPage';
import MedicalRecordsPage from './health/MedicalRecordsPage';
import PrescriptionsPage from './health/PrescriptionsPage';
import LaboratoryPage from './health/LaboratoryPage';
import PharmacyPage from './health/PharmacyPage';
import InsurancePage from './health/InsurancePage';
import BillingPage from './health/BillingPage';
import RoomsPage from './health/RoomsPage';
import AdmissionsPage from './health/AdmissionsPage';
import IntegrationsPage from './health/IntegrationsPage';
import HealthSettingsPage from './health/SettingsPage';
import StatsPage from './health/StatsPage';

// Vehicle Rentals
import RentalsDashboard from './vehicle-rentals/RentalsDashboard';
import VehiclesManagement from './vehicle-rentals/VehiclesManagement';
import ClientsManagement from './vehicle-rentals/ClientsManagement';
import ReservationsManagement from './vehicle-rentals/ReservationsManagement';

// Transport - Only importing components that actually exist
import TransportDashboard from './transport/TransportDashboard';
import TransportReservations from './transport/TransportReservations';
import TransportDrivers from './transport/TransportDrivers';
import TransportFleet from './transport/TransportFleet';
import TransportPlanning from './transport/TransportPlanning';
import TransportGeolocation from './transport/TransportGeolocation';
import TransportPayments from './transport/TransportPayments';
import TransportLoyalty from './transport/TransportLoyalty';
import TransportWebBooking from './transport/TransportWebBooking';
import TransportSettings from './transport/TransportSettings';

// Garage module import
import GarageDashboard from './garage/GarageDashboard';

// Import message components correctly - rename imported function to avoid conflict
import { renderMessagesSubmodule as messagesRenderer } from './renderers/MessagesRenderer';

// Salon import - using correct import syntax
import SalonDashboard from './salon/dashboard/SalonDashboard';
import SalonAppointments from './salon/appointments/SalonAppointments';

// Renderer functions for each module type
export const renderEmployeesSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'employees-dashboard':
      return <EmployeesDashboard />;
    case 'employees-profiles':
      return <EmployeesProfiles />;
    case 'employees-contracts':
      return <EmployeesContracts />;
    case 'employees-badges':
      return <EmployeesBadges />;
    case 'employees-timesheet':
      return <EmployeesTimesheet />;
    case 'employees-leaves':
      return <EmployeesLeaves />;
    case 'employees-attendance':
      return <EmployeesAttendance />;
    case 'employees-departments':
      return <EmployeesDepartments />;
    case 'employees-hierarchy':
      return <EmployeesHierarchy />;
    case 'employees-recruitment':
      return <EmployeesRecruitment />;
    case 'employees-evaluations':
      return <EmployeesEvaluations />;
    case 'employees-trainings':
      return <EmployeesTrainings />;
    case 'employees-salaries':
      return <EmployeesSalaries />;
    case 'employees-documents':
      return <EmployeesDocuments />;
    case 'employees-absences':
      return <EmployeesAbsences />;
    case 'employees-reports':
      return <EmployeesReports />;
    case 'employees-settings':
      return <EmployeesSettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

export const renderFreightSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipments />;
    case 'freight-containers':
      return <FreightContainers />;
    case 'freight-tracking':
      return <FreightTracking />;
    case 'freight-pricing':
      return <FreightPricing />;
    case 'freight-carriers':
      return <FreightCarriers />;
    case 'freight-documents':
      return <FreightDocuments />;
    case 'freight-client-portal':
      return <FreightClientPortal />;
    case 'freight-packages':
      return <FreightPackages />;
    case 'freight-settings':
      return <FreightSettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

export const renderProjectsSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'projects-dashboard':
      return <ProjectDashboard />;
    case 'projects-list':
      return <ProjectsList />;
    case 'projects-tasks':
      return <TasksPage />;
    case 'projects-teams':
      return <TeamsPage />;
    case 'projects-reports':
      return <ReportsPage />;
    case 'projects-settings':
      return <SettingsPage />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

export const renderAccountingSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
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
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

// Use imported messages renderer instead of creating a conflicting function
export const renderMessagesSubmodule = (submoduleId: string, submodule: SubModule) => {
  return messagesRenderer(submoduleId, submodule);
};

export const renderCompaniesSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'companies-dashboard':
      return <CompaniesDashboard />;
    case 'companies-list':
      return <CompaniesList />;
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
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

export const renderDocumentsSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'documents-files':
      return <DocumentsFiles />;
    case 'documents-archive':
      return <DocumentsArchive />;
    case 'documents-search':
      return <DocumentsSearch />;
    case 'documents-settings':
      return <DocumentsSettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

export const renderHealthSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'health-dashboard':
      return <HealthDashboard />;
    case 'health-patients':
      return <PatientsPage />;
    case 'health-appointments':
      return <AppointmentsPage />;
    case 'health-doctors':
      return <DoctorsPage />;
    case 'health-nurses':
      return <NursesPage />;
    case 'health-staff':
      return <StaffPage />;
    case 'health-consultations':
      return <ConsultationsPage />;
    case 'health-medical-records':
      return <MedicalRecordsPage />;
    case 'health-prescriptions':
      return <PrescriptionsPage />;
    case 'health-laboratory':
      return <LaboratoryPage />;
    case 'health-pharmacy':
      return <PharmacyPage />;
    case 'health-insurance':
      return <InsurancePage />;
    case 'health-billing':
      return <BillingPage />;
    case 'health-rooms':
      return <RoomsPage />;
    case 'health-admissions':
      return <AdmissionsPage />;
    case 'health-integrations':
      return <IntegrationsPage />;
    case 'health-settings':
      return <HealthSettingsPage />;
    case 'health-stats':
      return <StatsPage />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

export const renderVehicleRentalsSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'rentals-dashboard':
      return <RentalsDashboard />;
    case 'rentals-vehicles':
      return <VehiclesManagement />;
    case 'rentals-clients':
      return <ClientsManagement />;
    case 'rentals-reservations':
      return <ReservationsManagement />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

export const renderTransportSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering transport submodule:', submoduleId);
  switch (submoduleId) {
    case 'transport-dashboard':
      return <TransportDashboard />;
    case 'transport-reservations':
      return <TransportReservations />;
    case 'transport-planning':
      return <TransportPlanning />;
    case 'transport-fleet':
      return <TransportFleet />;
    case 'transport-drivers':
      return <TransportDrivers />;
    case 'transport-geolocation':
      return <TransportGeolocation />;
    case 'transport-payments':
      return <TransportPayments />;
    case 'transport-loyalty':
      return <TransportLoyalty />;
    case 'transport-web-booking':
      return <TransportWebBooking />;
    case 'transport-settings':
      return <TransportSettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

// Render Garage module
export const renderGarageSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'garage-dashboard':
      return <GarageDashboard />;
    // Add other garage submodules here as they are implemented
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};

// Salon module renderer as a component
export const SalonRenderer: React.FC<{ submoduleId: string, submodule: SubModule }> = ({ submoduleId, submodule }) => {
  switch (submoduleId) {
    case 'salon-dashboard':
      return <SalonDashboard />;
    case 'salon-appointments':
      return <SalonAppointments />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
