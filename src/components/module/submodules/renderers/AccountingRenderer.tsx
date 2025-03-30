
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import AccountingDashboard from '../accounting/AccountingDashboard';
import InvoicesPage from '../accounting/InvoicesPage';
import PaymentsPage from '../accounting/PaymentsPage';
import TaxesPage from '../accounting/TaxesPage';
import AccountingReportsPage from '../accounting/ReportsPage';
import AccountingSettingsPage from '../accounting/SettingsPage';
import { SubModule } from '@/data/types/modules';

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
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};
