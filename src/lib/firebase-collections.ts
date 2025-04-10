
/**
 * Constants for Firestore collection names
 * Centralizes collection names to avoid typos and facilitate refactoring
 */
export const COLLECTIONS = {
  // Main collections
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  
  // Module CRM
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    REMINDERS: 'crm_reminders',
    SETTINGS: 'crm_settings',
    CONTACTS: 'crm_contacts',
    LEADS: 'crm_leads',
    DEALS: 'crm_deals'
  },
  
  // Module Accounting
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers',
    REPORTS: 'accounting_reports',
    TAXES: 'accounting_taxes',
    SETTINGS: 'accounting_settings',
    TRANSACTIONS: 'accounting_transactions',
    PERMISSIONS: 'accounting_permissions',
  },
  
  // Module HR / Employees
  HR: {
    EMPLOYEES: 'hr-employees',
    DEPARTMENTS: 'hr-departments',
    LEAVES: 'hr-leaves',
    CONTRACTS: 'hr-contracts',
    EVALUATIONS: 'hr-evaluations',
    SALARIES: 'hr-salaries',
    TIMESHEETS: 'hr-timesheets',
    RECRUITMENTS: 'hr-recruitments',
    BADGES: 'hr-badges',
    DOCUMENTS: 'hr-documents',
    PAYSLIPS: 'hr-payslips',
    LEAVE_REQUESTS: 'hr-leave-requests',
    ATTENDANCE: 'hr-attendance',
    ABSENCE_REQUESTS: 'hr-absence-requests',
    TRAININGS: 'hr-trainings',
    REPORTS: 'hr-reports',
    ALERTS: 'hr-alerts',
  },
  
  // Module Projects
  PROJECTS: {
    PROJECTS: 'projects/projects',
    TASKS: 'projects/tasks',
    TEAMS: 'projects/teams',
    NOTIFICATIONS: 'projects/notifications',
  },
  
  // Module Health
  HEALTH: {
    PATIENTS: 'health-patients',
    DOCTORS: 'health-doctors',
    APPOINTMENTS: 'health-appointments',
    CONSULTATIONS: 'health-consultations',
    INSURANCE: 'health-insurance',
    BILLING: 'health-billing',
    SETTINGS: 'health-settings',
    INTEGRATIONS: 'health-integrations',
    STAFF: 'health-staff',
  },
  
  // Module Freight
  FREIGHT: {
    SHIPMENTS: 'freight/shipments',
    PACKAGES: 'freight/packages',
    CUSTOMERS: 'freight/customers',
    CARRIERS: 'freight/carriers',
    CONTAINERS: 'freight/containers',
    DOCUMENTS: 'freight/documents',
    ROUTES: 'freight/routes',
    VEHICLES: 'freight/vehicles',
    DRIVERS: 'freight/drivers',
    WAREHOUSES: 'freight/warehouses',
    TRACKING: 'freight/tracking',
    TRACKING_EVENTS: 'freight/tracking_events',
    PACKAGE_TYPES: 'freight/package_types',
    PRICING: 'freight/pricing',
    BILLING: 'freight/billing',
    QUOTES: 'freight/quotes',
  },
  
  // Module Library
  LIBRARY: {
    BOOKS: 'library/books',
    MEMBERS: 'library/members',
    LOANS: 'library/loans',
    RETURNS: 'library/returns',
    CATEGORIES: 'library/categories',
    PUBLISHERS: 'library/publishers',
    AUTHORS: 'library/authors',
    STATS: 'library/stats',
  },
  
  // Module Transport
  TRANSPORT: {
    DRIVERS: 'transport/drivers',
    VEHICLES: 'transport/vehicles',
    ROUTES: 'transport/routes',
    SCHEDULES: 'transport/schedules',
    RESERVATIONS: 'transport/reservations',
    CLIENTS: 'transport/clients',
  },
  
  // Module Messages
  MESSAGES: {
    INBOX: 'messages/inbox',
    ARCHIVED: 'messages/archived',
    SCHEDULED: 'messages/scheduled',
    CONTACTS: 'messages/contacts',
    TEMPLATES: 'messages/templates',
    METRICS: 'messages/metrics',
  },
  
  // Module Documents
  DOCUMENTS: 'documents',
  
  // Permissions
  USER_PERMISSIONS: 'userPermissions'
};

// For backward compatibility with old code using flat references
export const FLAT_COLLECTIONS = {
  CRM_CLIENTS: COLLECTIONS.CRM.CLIENTS,
  CRM_PROSPECTS: COLLECTIONS.CRM.PROSPECTS,
  CRM_OPPORTUNITIES: COLLECTIONS.CRM.OPPORTUNITIES,
  CRM_REMINDERS: COLLECTIONS.CRM.REMINDERS,
  CRM_SETTINGS: COLLECTIONS.CRM.SETTINGS,
  
  INVOICES: COLLECTIONS.ACCOUNTING.INVOICES,
  PAYMENTS: COLLECTIONS.ACCOUNTING.PAYMENTS,
  EXPENSES: COLLECTIONS.ACCOUNTING.EXPENSES,
  ACCOUNTING_CLIENTS: COLLECTIONS.ACCOUNTING.CLIENTS,
  ACCOUNTING_SUPPLIERS: COLLECTIONS.ACCOUNTING.SUPPLIERS,
  
  EMPLOYEES: COLLECTIONS.HR.EMPLOYEES,
  DEPARTMENTS: COLLECTIONS.HR.DEPARTMENTS,
  LEAVES: COLLECTIONS.HR.LEAVES,
  CONTRACTS: COLLECTIONS.HR.CONTRACTS,
  EVALUATIONS: COLLECTIONS.HR.EVALUATIONS,
  
  // ... add more flat references as needed for backward compatibility
};
