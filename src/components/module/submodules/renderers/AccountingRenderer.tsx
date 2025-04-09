
import React from 'react';
import InvoicesPage from '../accounting/InvoicesPage';
import SettingsPage from '../accounting/SettingsPage';
import AccountingDashboard from '../accounting/AccountingDashboard';
import PaymentsPage from '../accounting/PaymentsPage';
import TaxesPage from '../accounting/TaxesPage';
import ReportsPage from '../accounting/ReportsPage';

export const renderAccountingSubmodule = (submoduleId: string) => {
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
      return <ReportsPage />;
    case 'accounting-settings':
      return <SettingsPage />;
    default:
      return <div>Submodule {submoduleId} not found</div>;
  }
};
