
/**
 * Constantes pour les chemins des collections Firestore
 */
export const COLLECTIONS = {
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    PAYSLIPS: 'hr_payslips',
    LEAVE_REQUESTS: 'hr_leave_requests',
    ATTENDANCE: 'hr_attendance',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    DOCUMENTS: 'hr_documents',
    TIMESHEET: 'hr_timesheet',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts',
    BADGES: 'hr_badges',
    RECRUITMENT: 'hr_recruitment'  // Ajout de la collection RECRUITMENT
  },
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts',
    ACTIVITIES: 'crm_activities',
    REMINDERS: 'crm_reminders',
    SETTINGS: 'crm_settings'
  },
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    TAX_RATES: 'accounting_tax_rates',
    TAX_DECLARATIONS: 'accounting_tax_declarations',
    EXPENSES: 'accounting_expenses',
    SETTINGS: 'accounting_settings'
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CARRIERS: 'freight_carriers',
    CLIENTS: 'freight_clients',
    ROUTES: 'freight_routes',
    BILLING: 'freight_billing',
    CONTAINERS: 'freight_containers',
    PACKAGES: 'freight_packages',
    TRANSPORTS: 'freight_transports',
    SETTINGS: 'freight_settings',
    DOCUMENTS: 'freight_documents',
    PACKAGE_TYPES: 'freight_package_types',
    PRICING: 'freight_pricing',
    QUOTES: 'freight_quotes',
    TRACKING: 'freight_tracking',
    TRACKING_EVENTS: 'freight_tracking_events',
    USERS: 'freight_users'
  },
  GARAGE: {
    VEHICLES: 'garage_vehicles',
    CLIENTS: 'garage_clients',
    APPOINTMENTS: 'garage_appointments',
    REPAIRS: 'garage_repairs',
    MECHANICS: 'garage_mechanics',
    INVENTORY: 'garage_inventory',
    INVOICES: 'garage_invoices',
    SETTINGS: 'garage_settings'
  },
  MESSAGES: {
    INBOX: 'messages_inbox',
    OUTBOX: 'messages_outbox',
    DRAFTS: 'messages_drafts',
    TEMPLATES: 'messages_templates',
    CONTACTS: 'messages_contacts',
    SETTINGS: 'messages_settings',
    ARCHIVE: 'messages_archive',
    SCHEDULED: 'messages_scheduled'
  },
  DOCUMENTS: {
    FILES: 'documents_files',
    FOLDERS: 'documents_folders',
    SHARES: 'documents_shares',
    PERMISSIONS: 'documents_permissions',
    SETTINGS: 'documents_settings',
    CATEGORIES: 'documents_categories',
    TAGS: 'documents_tags',
    TEMPLATES: 'documents_templates',
    SIGNATURES: 'documents_signatures'
  },
  USERS: 'users',
  COMPANIES: 'companies'  // Ajout de la collection companies
};

// Add document collections for the document module
export const DOCUMENT_COLLECTIONS = {
  DOCUMENTS: COLLECTIONS.DOCUMENTS.FILES,
  FILES: COLLECTIONS.DOCUMENTS.FILES,
  FOLDERS: COLLECTIONS.DOCUMENTS.FOLDERS,
  SHARES: COLLECTIONS.DOCUMENTS.SHARES,
  PERMISSIONS: COLLECTIONS.DOCUMENTS.PERMISSIONS,
  SETTINGS: COLLECTIONS.DOCUMENTS.SETTINGS,
  CATEGORIES: COLLECTIONS.DOCUMENTS.CATEGORIES,
  TAGS: COLLECTIONS.DOCUMENTS.TAGS,
  TEMPLATES: COLLECTIONS.DOCUMENTS.TEMPLATES,
  SIGNATURES: COLLECTIONS.DOCUMENTS.SIGNATURES
};

// Application metadata
export const APP_METADATA = {
  appName: "NEOTECH-ERP",
  version: "1.0.0",
  environment: "development",
  timestamp: "2025-04-30T06:45:59.496Z"
};
