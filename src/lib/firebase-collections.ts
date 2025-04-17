
// Define Firestore collection paths here to ensure consistency
export const COLLECTIONS = {
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVE: 'messages_archive',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
  USERS: 'users',
  COMPANIES: 'companies',
  WAREHOUSES: 'warehouses',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  INVENTORY: 'inventory',
  EMPLOYEES: 'employees',
  SHIPMENTS: 'shipments',
  DRIVERS: 'drivers',
  VEHICLES: 'vehicles',
  CONTRACTS: 'contracts',
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates'
  },
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers',
    REPORTS: 'accounting_reports',
    TAXES: 'accounting_taxes',
    TRANSACTIONS: 'accounting_transactions',
    SETTINGS: 'accounting_settings',
    PERMISSIONS: 'accounting_permissions'
  },
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    ACTIVITIES: 'crm_activities',
    CONTACTS: 'crm_contacts'
  },
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    LEAVES: 'hr_leaves',
    ATTENDANCE: 'hr_attendance',
    DOCUMENTS: 'hr_documents',
    TRAININGS: 'hr_trainings',
    PAYSLIPS: 'hr_payslips',
    EVALUATIONS: 'hr_evaluations',
    ABSENCE_REQUESTS: 'hr_absence_requests'
  }
};
