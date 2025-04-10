
// Constantes pour les noms de collections Firestore
export const COLLECTIONS = {
  // Collections principales
  USERS: 'users',
  COMPANIES: 'companies',
  EMPLOYEES: 'hr-employees',
  DEPARTMENTS: 'hr-departments',
  USER_PERMISSIONS: 'userPermissions',
  DOCUMENTS: 'documents',
  
  // Collections RH
  HR: {
    EMPLOYEES: 'hr-employees',
    DEPARTMENTS: 'hr-departments',
    CONTRACTS: 'hr-contracts',
    EVALUATIONS: 'hr-evaluations',
    LEAVES: 'hr-leaves',
    TIMESHEETS: 'hr-timesheets',
    ABSENCES: 'hr-absences'
  },
  
  // Collections CRM
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    REMINDERS: 'crm_reminders',
    SETTINGS: 'crm_settings'
  },
  
  // Collections Comptabilité
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers'
  },
  
  // Collections Projets
  PROJECTS: {
    PROJECTS: 'projects/projects',
    TASKS: 'projects/tasks',
    TEAMS: 'projects/teams'
  },
  
  // Collections Santé
  HEALTH: {
    PATIENTS: 'health-patients',
    DOCTORS: 'health-doctors',
    APPOINTMENTS: 'health-appointments',
    CONSULTATIONS: 'health-consultations'
  },
  
  // Collections Transport
  FREIGHT: {
    SHIPMENTS: 'freight/shipments',
    PACKAGES: 'freight/packages',
    CUSTOMERS: 'freight/customers'
  },
  
  // Collections Messages
  MESSAGES: {
    INBOX: 'messages/inbox',
    CONTACTS: 'messages/contacts'
  }
};
