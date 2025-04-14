
/**
 * Firebase collections paths
 */
export const COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  USER_PERMISSIONS: 'user_permissions', // Added this missing collection
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    POSITIONS: 'hr_positions',
    CONTRACTS: 'hr_contracts',
    PAYSLIPS: 'hr_payslips',
    TRAININGS: 'hr_trainings',
    LEAVE_REQUESTS: 'hr_leave_requests',
    ATTENDANCE: 'hr_attendance',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    DOCUMENTS: 'hr_documents',
    TIMESHEET: 'hr_timesheet',
    EVALUATIONS: 'hr_evaluations',
    REPORTS: 'hr_reports', 
    ALERTS: 'hr_alerts',
    BADGES: 'hr_badges',         // Added this missing collection
    MANAGERS: 'hr_managers',     // Added this missing collection
    LEAVES: 'hr_leaves',         // Added this missing collection
    RECRUITMENTS: 'hr_recruitments', // Added this missing collection
  },
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    TAXES: 'accounting_taxes',
    SETTINGS: 'accounting_settings',
    EXPENSES: 'accounting_expenses',       // Added missing collections
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers',
    REPORTS: 'accounting_reports',
    TRANSACTIONS: 'accounting_transactions',
    PERMISSIONS: 'accounting_permissions',
  },
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    ACTIVITIES: 'crm_activities',
    CONTACTS: 'crm_contacts',    // Added missing collections
    LEADS: 'crm_leads',
    DEALS: 'crm_deals',
    SETTINGS: 'crm_settings',
    REMINDERS: 'crm_reminders'
  },
  PROJECTS: {
    PROJECTS: 'projects_projects',
    TASKS: 'projects_tasks',
    MILESTONES: 'projects_milestones',
    TIMESHEETS: 'projects_timesheets',
    TEAMS: 'projects_teams',      // Added missing collection
    NOTIFICATIONS: 'projects_notifications'
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    PACKAGES: 'freight_packages',
    TRACKING: 'freight_tracking',
    DOCUMENTS: 'freight_documents',
    CARRIERS: 'freight_carriers',   // Added missing collections
    CONTAINERS: 'freight_containers',
    TRACKING_EVENTS: 'freight_tracking_events',
    RATES: 'freight_rates',
    INVOICES: 'freight_invoices',
    CLIENTS: 'freight_clients',
    SETTINGS: 'freight_settings',
    USERS: 'freight_users',
    PACKAGE_TYPES: 'freight_package_types',
    ROUTES: 'freight_routes',
    PRICING: 'freight_pricing',
    BILLING: 'freight_billing',
    QUOTES: 'freight_quotes',
    CUSTOMERS: 'freight_customers'
  },
  DOCUMENTS: {
    DOCUMENTS: 'documents',
    FOLDERS: 'document_folders',
    TEMPLATES: 'document_templates',
    SIGNATURES: 'document_signatures',
  },
  MESSAGES: {
    MESSAGES: 'messages',
    CONTACTS: 'message_contacts',
    TEMPLATES: 'message_templates',
    SCHEDULED: 'message_scheduled',
    INBOX: 'message_inbox',      // Added missing collections
    ARCHIVE: 'message_archive',
    METRICS: 'message_metrics'
  },
  HEALTH: {    // Added missing Health module collections
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    PRESCRIPTIONS: 'health_prescriptions',
    STAFF: 'health_staff',
    BILLING: 'health_billing',
    INVENTORY: 'health_inventory'
  },
  TRANSPORT: { // Added missing Transport module collections
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules'
  },
  LIBRARY: {   // Added missing Library module collections
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RESERVATIONS: 'library_reservations',
    CATEGORIES: 'library_categories'
  }
};
