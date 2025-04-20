
export const COLLECTIONS = {
  TRANSPORT: {
    LOCATIONS: 'locations',
    VEHICLES: 'vehicles',
    RESERVATIONS: 'reservations'
  },
  HR: {
    TIMESHEET: 'timesheet',
    EMPLOYEES: 'employees',
    DEPARTMENTS: 'departments',
    CONTRACTS: 'contracts',
    ABSENCES: 'absences',
    LEAVE_REQUESTS: 'leave-requests',
    EVALUATIONS: 'evaluations',
    TRAININGS: 'trainings'
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
    ARCHIVED: 'archived'
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
    TAX_DECLARATIONS: 'tax-declarations'
  },
  USERS: {
    PROFILES: 'profiles',
    SETTINGS: 'settings',
    PERMISSIONS: 'permissions'
  }
} as const;
