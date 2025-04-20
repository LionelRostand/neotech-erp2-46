
/**
 * Constantes pour les chemins des collections Firestore
 * Utilisé pour centraliser les noms des collections et éviter les erreurs de typo
 */
export const COLLECTIONS = {
  // Collections principales
  USERS: 'users',
  USER_PERMISSIONS: 'user_permissions',
  COMPANIES: 'companies',

  // Collections Accounting
  ACCOUNTING: {
    CLIENTS: 'accounting_clients',
    EXPENSES: 'accounting_expenses',
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    PERMISSIONS: 'accounting_permissions',
    REPORTS: 'accounting_reports',
    SETTINGS: 'accounting_settings',
    SUPPLIERS: 'accounting_suppliers',
    TAXES: 'accounting_taxes',
    TRANSACTIONS: 'accounting_transactions'
  },

  // Collections CRM
  CRM: {
    ACTIVITIES: 'crm_activities',
    CAMPAIGNS: 'crm_campaigns',
    CLIENTS: 'crm_clients',
    CONTACTS: 'crm_contacts',
    DEALS: 'crm_deals',
    LEADS: 'crm_leads',
    OPPORTUNITIES: 'crm_opportunities',
    PROSPECTS: 'crm_prospects',
    REMINDERS: 'crm_reminders',
    SETTINGS: 'crm_settings',
    TASKS: 'crm_tasks'
  },

  // Collections Documents
  DOCUMENTS: {
    MAIN: 'documents',
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates'
  },

  // Collections Freight
  FREIGHT: {
    BILLING: 'freight_billing',
    CARRIERS: 'freight_carriers',
    CLIENTS: 'freight_clients',
    CONTAINERS: 'freight_containers',
    CUSTOMERS: 'freight_customers',
    DOCUMENTS: 'freight_documents',
    PACKAGE_TYPES: 'freight_package_types',
    PACKAGES: 'freight_packages',
    PRICING: 'freight_pricing',
    QUOTES: 'freight_quotes',
    ROUTES: 'freight_routes',
    SETTINGS: 'freight_settings',
    SHIPMENTS: 'freight_shipments',
    TRACKING: 'freight_tracking',
    TRACKING_EVENTS: 'freight_tracking_events',
    USERS: 'freight_users'
  },

  // Collections Health
  HEALTH: {
    APPOINTMENTS: 'health_appointments',
    BILLING: 'health_billing',
    CONSULTATIONS: 'health_consultations',
    DOCTORS: 'health_doctors',
    INSURANCE: 'health_insurance',
    INVENTORY: 'health_inventory',
    LABORATORY: 'health_laboratory',
    MEDICAL_RECORDS: 'health_medical_records',
    PATIENTS: 'health_patients',
    PERMISSIONS: 'health_permissions',
    PRESCRIPTIONS: 'health_prescriptions',
    SETTINGS: 'health_settings',
    STAFF: 'health_staff'
  },

  // Collections HR
  HR: {
    ABSENCE_REQUESTS: 'hr_absence_requests',
    ALERTS: 'hr_alerts',
    ATTENDANCE: 'hr_attendance',
    BADGES: 'hr_badges',
    CONTRACTS: 'hr_contracts',
    DEPARTMENTS: 'hr_departments',
    DOCUMENTS: 'hr_documents',
    EMPLOYEES: 'hr_employees',
    EVALUATIONS: 'hr_evaluations',
    LEAVE_REQUESTS: 'hr_leave_requests',
    LEAVES: 'hr_leaves',
    MANAGERS: 'hr_managers',
    PAYSLIPS: 'hr_payslips',
    PERMISSIONS: 'hr_permissions',
    RECRUITMENT: 'hr_recruitment',
    SALARIES: 'hr_salaries',
    SETTINGS: 'hr_settings',
    TIMESHEET: 'hr_timesheet',
    TRAININGS: 'hr_trainings'
  },

  // Collections Library
  LIBRARY: {
    AUTHORS: 'library_authors',
    BOOKS: 'library_books',
    CATEGORIES: 'library_categories',
    LOANS: 'library_loans',
    MEMBERS: 'library_members',
    PUBLISHERS: 'library_publishers',
    RETURNS: 'library_returns',
    SETTINGS: 'library_settings',
    STATS: 'library_stats'
  },

  // Collections Messages
  MESSAGES: {
    ARCHIVE: 'messages_archive',
    INBOX: 'messages_inbox',
    METRICS: 'messages_metrics',
    SCHEDULED: 'messages_scheduled'
  },

  // Collections Transport
  TRANSPORT: {
    CLIENTS: 'transport_clients',
    DRIVERS: 'transport_drivers',
    RESERVATIONS: 'transport_reservations',
    ROUTES: 'transport_routes',
    SETTINGS: 'transport_settings',
    VEHICLES: 'transport_vehicles'
  },

  // Autres collections
  ANALYTICS: {
    STATS: 'analyticsStats',
    MONTHLY: 'monthlyAnalytics',
    PERFORMANCE: 'performanceStats',
    MONTHLY_PERFORMANCE: 'monthlyPerformance'
  },

  PROJECTS: {
    MAIN: 'projects',
    NOTIFICATIONS: 'project_notifications',
    TASKS: 'tasks',
    TEAMS: 'teams'
  },

  SMTP: 'smtp_config'
};

