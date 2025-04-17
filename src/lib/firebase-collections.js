
// Define Firestore collection paths here to ensure consistency
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'tasks',
    TEAMS: 'teams', 
    NOTIFICATIONS: 'project_notifications'
  },
  CLIENTS: 'clients',
  USER_PERMISSIONS: 'user_permissions',
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    LEAVES: 'hr_leaves',
    DOCUMENTS: 'hr_documents',
    ATTENDANCE: 'hr_attendance',
    ABSENCES: 'hr_absences',
    BADGES: 'hr_badges',
    PAYSLIPS: 'hr_payslips',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    ALERTS: 'hr_alerts',
    REPORTS: 'hr_reports',
    SETTINGS: 'hr_settings',
    MANAGERS: 'hr_managers',
    LEAVE_REQUESTS: 'hr_leave_requests',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    SALARIES: 'hr_salaries',
    POSITIONS: 'hr_positions',
    PERMISSIONS: 'hr_permissions',
    RECRUITMENT: 'hr_recruitment',
    TIMESHEET: 'hr_timesheet'
  },
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVE: 'messages_archive',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    ACTIVITIES: 'crm_activities',
    CONTACTS: 'crm_contacts',
    DEALS: 'crm_deals',
    SETTINGS: 'crm_settings',
    TASKS: 'crm_tasks',
    CAMPAIGNS: 'crm_campaigns',
    LEADS: 'crm_leads',
    REMINDERS: 'crm_reminders'
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CONTAINERS: 'freight_containers',
    CARRIERS: 'freight_carriers',
    ROUTES: 'freight_routes',
    TRACKING: 'freight_tracking',
    DOCUMENTS: 'freight_documents',
    PRICING: 'freight_pricing',
    CLIENTS: 'freight_clients',
    SETTINGS: 'freight_settings',
    USERS: 'freight_users',
    PACKAGES: 'freight_packages',
    TRACKING_EVENTS: 'freight_tracking_events',
    PACKAGE_TYPES: 'freight_package_types',
    BILLING: 'freight_billing',
    QUOTES: 'freight_quotes',
    CUSTOMERS: 'freight_customers'
  },
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates'
  },
  HEALTH: {
    PATIENTS: 'health_patients',
    DOCTORS: 'health_doctors',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    PRESCRIPTIONS: 'health_prescriptions',
    MEDICAL_RECORDS: 'health_medical_records',
    STAFF: 'health_staff',
    BILLING: 'health_billing',
    INSURANCE: 'health_insurance',
    LABORATORY: 'health_laboratory',
    INVENTORY: 'health_inventory',
    SETTINGS: 'health_settings',
    PERMISSIONS: 'health_permissions'
  },
  TRANSPORT: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients',
    ROUTES: 'transport_routes',
    SETTINGS: 'transport_settings'
  },
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RETURNS: 'library_returns',
    AUTHORS: 'library_authors',
    PUBLISHERS: 'library_publishers',
    CATEGORIES: 'library_categories',
    SETTINGS: 'library_settings',
    STATS: 'library_stats'
  },
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers',
    REPORTS: 'accounting_reports',
    TAXES: 'accounting_taxes',
    TRANSACTIONS: 'accounting_transactions',
    SETTINGS: 'accounting_settings',
    PERMISSIONS: 'accounting_permissions'
  }
};
