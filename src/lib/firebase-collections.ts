
// Define the structure of all available collections in Firestore
export const COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  DEPARTMENTS: 'departments',
  EMPLOYEES: 'employees',
  DOCUMENTS: 'documents',
  SETTINGS: 'settings',
  // CRM Collections
  CRM: {
    CLIENTS: 'crm/clients',
    PROSPECTS: 'crm/prospects',
    REMINDERS: 'crm/reminders',
    OPPORTUNITIES: 'crm/opportunities',
    LEADS: 'crm/leads',
    CONTACTS: 'crm/contacts',
    DEALS: 'crm/deals',
    SETTINGS: 'crm/settings'
  },
  // Accounting Collections
  ACCOUNTING: {
    INVOICES: 'accounting/invoices',
    EXPENSES: 'accounting/expenses',
    PAYMENTS: 'accounting/payments',
    TRANSACTIONS: 'accounting/transactions',
    PERMISSIONS: 'accounting/permissions'
  },
  // Freight Collections
  FREIGHT: {
    SHIPMENTS: 'freight/shipments',
    CARRIERS: 'freight/carriers',
    PACKAGES: 'freight/packages',
    ROUTES: 'freight/routes',
    TRACKING_EVENTS: 'freight/tracking_events',
    PACKAGE_TYPES: 'freight/package_types'
  }
};
