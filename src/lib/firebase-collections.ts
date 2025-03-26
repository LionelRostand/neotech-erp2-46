
// Définition des collections Firebase
export const COLLECTIONS = {
  // Employee collections
  EMPLOYEES: 'employees',
  LEAVES: 'employees-leaves',
  ATTENDANCE: 'employees-attendance',
  DEPARTMENTS: 'employees-departments',
  BADGES: 'employees-badges',
  CONTRACTS: 'employees-contracts',
  DOCUMENTS: 'employees-documents',
  EVALUATIONS: 'employees-evaluations',
  TRAININGS: 'employees-trainings',
  SALARIES: 'employees-salaries',
  RECRUITMENT: 'employees-recruitment',
  ALERTS: 'employees-alerts',
  SETTINGS: 'employees-settings',
  
  // User collections
  USERS: 'users',
  USER_PERMISSIONS: 'user-permissions',
  
  // Messages collections
  MESSAGES: {
    INBOX: 'messages-inbox',
    SENT: 'messages-sent',
    DRAFTS: 'messages-drafts', 
    ARCHIVED: 'messages-archived',
    SCHEDULED: 'messages-scheduled',
    TEMPLATES: 'messages-templates',
    METRICS: 'messages-metrics' // Added missing METRICS collection
  },
  CONTACTS: 'contacts',
  
  // Accounting collections
  ACCOUNTING: {
    INVOICES: 'accounting-invoices',
    PAYMENTS: 'accounting-payments',
    EXPENSES: 'accounting-expenses',
    BUDGETS: 'accounting-budgets',
    PERMISSIONS: 'accounting-permissions',
    TRANSACTIONS: 'accounting-transactions' // Added missing TRANSACTIONS collection
  },
  
  // Companies collections
  COMPANIES: 'companies',
  
  // CRM collections
  CRM: {
    PROSPECTS: 'crm-prospects',
    OPPORTUNITIES: 'crm-opportunities',
    LEADS: 'crm-leads',
    DEALS: 'crm-deals'
  },
  
  // Freight collections
  FREIGHT: {
    SHIPMENTS: 'freight-shipments',
    TRACKING: 'freight-tracking',
    TRACKING_EVENTS: 'freight-tracking-events',
    CONTAINERS: 'freight-containers',
    VEHICLES: 'freight-vehicles',
    DRIVERS: 'freight-drivers',
    CARRIERS: 'freight-carriers', // Added missing CARRIERS collection
    PACKAGES: 'freight-packages', // Added missing PACKAGES collection
    ROUTES: 'freight-routes', // Added missing ROUTES collection
    PACKAGE_TYPES: 'freight-package-types' // Added missing PACKAGE_TYPES collection
  },
  
  // Health collections
  HEALTH_CONSULTATIONS: 'health-consultations',
  HEALTH_PATIENTS: 'health-patients',
  HEALTH_STAFF: 'health-staff',
  HEALTH_INSURANCE: 'health-insurance',
  HEALTH_BILLING: 'health-billing',
  HEALTH: 'health', // Added general HEALTH collection
  
  // Library collections
  LIBRARY: {
    BOOKS: 'library-books',
    MEMBERS: 'library-members',
    LOANS: 'library-loans',
    RESERVATIONS: 'library-reservations',
    STATS: 'library-stats' // Added missing STATS collection
  },
  
  // Projects collections
  PROJECTS: {
    PROJECTS: 'projects-list',
    TASKS: 'projects-tasks',
    TEAMS: 'projects-teams',
    COMMENTS: 'projects-comments',
    NOTIFICATIONS: 'projects-notifications'
  },
  
  // Transport collections
  TRANSPORT: {
    RESERVATIONS: 'transport-reservations',
    CLIENTS: 'transport-clients',
    VEHICLES: 'transport-vehicles',
    DRIVERS: 'transport-drivers',
    ROUTES: 'transport-routes'
  }
};

// Export the transport collections separately
export const TRANSPORT_COLLECTIONS = COLLECTIONS.TRANSPORT;

// Export individual collections for easier imports
export const LIBRARY_MEMBERS = COLLECTIONS.LIBRARY.MEMBERS;
export const LIBRARY_LOANS = COLLECTIONS.LIBRARY.LOANS;
