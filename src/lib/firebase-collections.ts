
/**
 * Definition of paths to Firestore collections used in the application
 * Centralizing these paths helps avoid typos and makes changes easier
 */
export const COLLECTIONS = {
  // Main collections
  USERS: 'users',
  COMPANIES: 'companies',
  USER_PERMISSIONS: 'user_permissions',
  EMPLOYEES: 'employees',
  
  // Messages module
  MESSAGES: {
    INBOX: 'messages_inbox',
    SENT: 'messages_sent',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    DRAFTS: 'messages_drafts',
    METRICS: 'messages_metrics',
    TEMPLATES: 'message_templates'
  },
  
  // Contacts collection
  CONTACTS: 'contacts',
  
  // HR (Human Resources) Module
  HR: {
    EMPLOYEES: 'employees',
    DEPARTMENTS: 'departments',
    POSITIONS: 'positions',
    LEAVES: 'leaves',
    ATTENDANCE: 'attendance',
    PAYROLL: 'payroll',
    RECRUITMENT: 'recruitment',
    CONTRACTS: 'contracts',
    EVALUATIONS: 'evaluations',
    PAYSLIPS: 'payslips',
    LEAVE_REQUESTS: 'leave_requests',
    DOCUMENTS: 'hr_documents',
    TIMESHEETS: 'timesheets',
    BADGES: 'badges',
    ABSENCE_REQUESTS: 'absence_requests',
    TRAININGS: 'trainings',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts'
  },
  
  // Finance Module
  FINANCE: {
    INVOICES: 'invoices',
    EXPENSES: 'expenses',
    ACCOUNTS: 'accounts',
    TRANSACTIONS: 'transactions'
  },
  
  // CRM Module
  CRM: {
    CLIENTS: 'clients',
    LEADS: 'leads',
    OPPORTUNITIES: 'opportunities',
    CONTACTS: 'contacts',
    PROSPECTS: 'prospects',
    DEALS: 'deals',
    SETTINGS: 'crm_settings',
    REMINDERS: 'reminders'
  },

  // Projects Module
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'tasks',
    MILESTONES: 'milestones',
    TIMESHEETS: 'project_timesheets',
    TEAMS: 'teams',
    NOTIFICATIONS: 'project_notifications'
  },
  
  // Documents Module
  DOCUMENTS: 'documents',
  
  // Accounting Module
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    TAXES: 'accounting_taxes',
    REPORTS: 'accounting_reports',
    SETTINGS: 'accounting_settings',
    PERMISSIONS: 'accounting_permissions',
    TRANSACTIONS: 'accounting_transactions'
  },

  // Health Module
  HEALTH: {
    PATIENTS: 'patients',
    CONSULTATIONS: 'consultations',
    STAFF: 'health_staff',
    APPOINTMENTS: 'appointments',
    INSURANCE: 'insurance',
    BILLING: 'health_billing',
    PRESCRIPTIONS: 'prescriptions',
    MEDICAL_RECORDS: 'medical_records',
    INVENTORY: 'medical_inventory',
    DOCTORS: 'doctors'
  },

  // Transport Module
  TRANSPORT: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients',
    ROUTES: 'transport_routes',
    MAINTENANCE: 'transport_maintenance'
  },

  // Freight Module
  FREIGHT: {
    SHIPMENTS: 'shipments',
    CONTAINERS: 'containers',
    CARRIERS: 'carriers',
    TRACKING: 'tracking_events',
    TRACKING_EVENTS: 'tracking_events',
    CUSTOMERS: 'freight_customers',
    DOCUMENTS: 'freight_documents',
    RATES: 'freight_rates',
    ROUTES: 'freight_routes',
    CUSTOMS: 'customs_declarations',
    PERMISSIONS: 'freight_permissions',
    SETTINGS: 'freight_settings',
    USERS: 'freight_users',
    PACKAGES: 'freight_packages',
    PACKAGE_TYPES: 'freight_package_types',
    PRICING: 'freight_pricing',
    BILLING: 'freight_billing',
    QUOTES: 'freight_quotes',
    VEHICLES: 'freight_vehicles',
    DRIVERS: 'freight_drivers'
  },

  // Library Module
  LIBRARY: {
    BOOKS: 'books',
    CATEGORIES: 'book_categories',
    MEMBERS: 'library_members',
    LOANS: 'book_loans',
    RESERVATIONS: 'book_reservations',
    STATS: 'library_stats',
    EVENTS: 'library_events'
  }
};
