
// Firebase collection paths organized by module
export const COLLECTIONS = {
  // CRM Module
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    REMINDERS: 'crm_reminders',
    SETTINGS: 'crm_settings'
  },
  
  // HR Module
  HR: {
    EMPLOYEES: 'hr-employees',
    DEPARTMENTS: 'hr-departments',
    LEAVES: 'hr-leaves',
    CONTRACTS: 'hr-contracts',
    EVALUATIONS: 'hr-evaluations',
    TIMESHEETS: 'hr-timesheets'
  },
  
  // Accounting Module
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers'
  },
  
  // Projects Module
  PROJECTS: {
    PROJECTS: 'projects/projects',
    TASKS: 'projects/tasks',
    TEAMS: 'projects/teams'
  },
  
  // Health Module
  HEALTH: {
    PATIENTS: 'health-patients',
    DOCTORS: 'health-doctors',
    APPOINTMENTS: 'health-appointments',
    CONSULTATIONS: 'health-consultations'
  },
  
  // Freight Module
  FREIGHT: {
    SHIPMENTS: 'freight/shipments',
    PACKAGES: 'freight/packages',
    CUSTOMERS: 'freight/customers'
  },
  
  // Messages Module
  MESSAGES: {
    INBOX: 'messages/inbox',
    CONTACTS: 'messages/contacts'
  },
  
  // Documents Module
  DOCUMENTS: 'documents',
  
  // User Management
  USERS: 'users',
  USER_PERMISSIONS: 'userPermissions'
};
