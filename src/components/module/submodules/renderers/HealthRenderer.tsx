
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import ConsultationsPage from '../health/ConsultationsPage';
import DashboardPage from '../health/DashboardPage';
import PatientsPage from '../health/PatientsPage';
import AppointmentsPage from '../health/AppointmentsPage';
import DoctorsPage from '../health/DoctorsPage';
import NursesPage from '../health/NursesPage';
import StaffPage from '../health/StaffPage';
import MedicalRecordsPage from '../health/MedicalRecordsPage';
import LaboratoryPage from '../health/LaboratoryPage';
import PrescriptionsPage from '../health/PrescriptionsPage';
import PharmacyPage from '../health/PharmacyPage';
import AdmissionsPage from '../health/AdmissionsPage';
import RoomsPage from '../health/RoomsPage';
import BillingPage from '../health/BillingPage';
import InsurancePage from '../health/InsurancePage';
import StatsPage from '../health/StatsPage';
import IntegrationsPage from '../health/IntegrationsPage';
import SettingsPage from '../health/SettingsPage';
import { SubModule } from '@/data/types/modules';

export const renderHealthSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'health-dashboard':
      return <DashboardPage />;
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
    case 'health-laboratory':
      return <LaboratoryPage />;
    case 'health-prescriptions':
      return <PrescriptionsPage />;
    case 'health-pharmacy':
      return <PharmacyPage />;
    case 'health-admissions':
      return <AdmissionsPage />;
    case 'health-rooms':
      return <RoomsPage />;
    case 'health-billing':
      return <BillingPage />;
    case 'health-insurance':
      return <InsurancePage />;
    case 'health-stats':
      return <StatsPage />;
    case 'health-integrations':
      return <IntegrationsPage />;
    case 'health-settings':
      return <SettingsPage />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
