
export const COLLECTIONS = {
  // Core collections
  USERS: 'users',
  COMPANIES: 'companies',
  EMPLOYEES: 'employees',
  CONTACTS: 'contacts',
  DOCUMENTS: 'documents',
  EVENTS: 'events',
  TASKS: 'tasks',
  USER_PERMISSIONS: 'user_permissions',

  // Projects module
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'project_tasks',
    TEAMS: 'project_teams',
    NOTIFICATIONS: 'project_notifications'
  },

  // Messages module
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },

  // Freight module
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    TRACKING: 'freight_tracking',
    TRACKING_EVENTS: 'freight_tracking_events',
    CARRIERS: 'freight_carriers',
    PACKAGES: 'freight_packages',
    ROUTES: 'freight_routes',
    PACKAGE_TYPES: 'freight_package_types'
  },

  // Accounting module
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    TAX_RATES: 'accounting_tax_rates',
    ACCOUNTS: 'accounting_accounts',
    LEDGER: 'accounting_ledger',
    JOURNAL: 'accounting_journal',
    TRANSACTIONS: 'accounting_transactions',
    PERMISSIONS: 'accounting_permissions'
  },

  // Health module
  HEALTH: {
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    STAFF: 'health_staff',
    MEDICAL_RECORDS: 'health_medical_records',
    CONSULTATIONS: 'health_consultations',
    BILLING: 'health_billing'
  },
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_INSURANCE: 'health_insurance',
  HEALTH_BILLING: 'health_billing',

  // Transport module
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules',
    SETTINGS: 'transport_settings',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients'
  },

  // Library module
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    CATEGORIES: 'library_categories',
    STATISTICS: 'library_statistics',
    STATS: 'library_stats'
  },

  // CRM module
  CRM: {
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    DEALS: 'crm_deals',
    ACTIVITIES: 'crm_activities',
    CONTACTS: 'crm_contacts'
  },

  // Generic collections
  SHIPMENTS: 'shipments'
};
