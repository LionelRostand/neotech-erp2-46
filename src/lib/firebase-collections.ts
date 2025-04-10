
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
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    LEAVES: 'hr_leaves',
    CONTRACTS: 'hr_contracts',
    EVALUATIONS: 'hr_evaluations',
    SALARIES: 'hr_salaries',
    TIMESHEETS: 'hr_timesheets',
    RECRUITMENTS: 'hr_recruitments',
    BADGES: 'hr_badges',
    DOCUMENTS: 'hr_documents',
  },
  
  // Module Projects
  PROJECTS: {
    PROJECTS: 'projects_projects',
    TASKS: 'projects_tasks',
    TEAMS: 'projects_teams',
    NOTIFICATIONS: 'projects_notifications',
  },
  
  // Module Health
  HEALTH: {
    PATIENTS: 'health_patients',
    DOCTORS: 'health_doctors',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    INSURANCE: 'health_insurance',
    BILLING: 'health_billing',
    SETTINGS: 'health_settings',
    INTEGRATIONS: 'health_integrations',
    STAFF: 'health_staff',
  },
  
  // Module Freight
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    PACKAGES: 'freight_packages',
    CUSTOMERS: 'freight_customers',
    CARRIERS: 'freight_carriers',
    CONTAINERS: 'freight_containers',
    DOCUMENTS: 'freight_documents',
    ROUTES: 'freight_routes',
    VEHICLES: 'freight_vehicles',
    DRIVERS: 'freight_drivers',
    WAREHOUSES: 'freight_warehouses',
    TRACKING: 'freight_tracking',
  },
  
  // Module Library
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RETURNS: 'library_returns',
    CATEGORIES: 'library_categories',
    PUBLISHERS: 'library_publishers',
    AUTHORS: 'library_authors',
    STATS: 'library_stats',
  },
  
  // Module Transport
  TRANSPORT: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules',
  },
  
  // Module Messages
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    CONTACTS: 'messages_contacts',
    TEMPLATES: 'messages_templates',
    METRICS: 'messages_metrics',
  },
  
  // Module Documents
  DOCUMENTS: 'documents',
  
  // Contacts collection for general use
  CONTACTS: 'contacts',
  
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
