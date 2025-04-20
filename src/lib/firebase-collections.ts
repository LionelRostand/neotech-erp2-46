
export const COLLECTIONS = {
  TRANSPORT: {
    LOCATIONS: 'locations',
    VEHICLES: 'vehicles',
    RESERVATIONS: 'reservations',
    CLIENTS: 'clients',
    INVOICES: 'invoices'
  },
  HR: {
    TIMESHEET: 'timesheet',
    EMPLOYEES: 'employees',
    DEPARTMENTS: 'departments',
    CONTRACTS: 'contracts',
    ABSENCES: 'absences',
    LEAVE_REQUESTS: 'leave-requests',
    EVALUATIONS: 'evaluations',
    TRAININGS: 'trainings',
    ABSENCE_REQUESTS: 'absence-requests', // Added this missing collection
    MANAGERS: 'managers' // Added this missing collection
  },
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    FOLDERS: 'folders',
    PERMISSIONS: 'permissions',
    TEMPLATES: 'templates',
    ARCHIVE: 'archive',
    SETTINGS: 'settings'
  },
  MESSAGES: {
    INBOX: 'inbox',
    SENT: 'sent',
    DRAFTS: 'drafts',
    SCHEDULED: 'scheduled',
    ARCHIVED: 'archived',
    METRICS: 'metrics' // Added this missing collection
  },
  CONTACTS: {
    CONTACTS: 'contacts',
    GROUPS: 'groups'
  },
  ACCOUNTING: {
    INVOICES: 'invoices',
    PAYMENTS: 'payments',
    EXPENSES: 'expenses',
    TAX_RATES: 'tax-rates',
    TAX_DECLARATIONS: 'tax-declarations',
    CLIENTS: 'clients', // Adding missing collections for accounting
    SUPPLIERS: 'suppliers',
    REPORTS: 'reports',
    TAXES: 'taxes',
    TRANSACTIONS: 'transactions',
    SETTINGS: 'settings'
  },
  USERS: 'users' // Changed from object to string to fix the LoginForm error
};
