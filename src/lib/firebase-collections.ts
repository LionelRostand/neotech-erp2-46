// Define Firestore collection paths here to ensure consistency
export const COLLECTIONS = {
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVE: 'messages_archive',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
  USERS: 'users',
  USER_PERMISSIONS: 'user_permissions',
  COMPANIES: 'companies', // This is the important line for company creation
  WAREHOUSES: 'warehouses',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  INVENTORY: 'inventory',
  EMPLOYEES: 'employees',
  SHIPMENTS: 'shipments',
  DRIVERS: 'drivers',
  VEHICLES: 'vehicles',
  CONTRACTS: 'contracts',
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'tasks',
    TEAMS: 'teams',
    NOTIFICATIONS: 'project_notifications'
  },
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates'
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
  },
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
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    LEAVES: 'hr_leaves',
    ATTENDANCE: 'hr_attendance',
    DOCUMENTS: 'hr_documents',
    TRAININGS: 'hr_trainings',
    PAYSLIPS: 'hr_payslips',
    EVALUATIONS: 'hr_evaluations',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    LEAVE_REQUESTS: 'hr_leave_requests',
    BADGES: 'hr_badges',
    MANAGERS: 'hr_managers',
    SALARIES: 'hr_salaries',
    POSITIONS: 'hr_positions',
    PERMISSIONS: 'hr_permissions',
    SETTINGS: 'hr_settings',
    ALERTS: 'hr_alerts',
    REPORTS: 'hr_reports',
    RECRUITMENT: 'hr_recruitment',
    TIMESHEET: 'hr_timesheet'
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
  HEALTH: {
    PATIENTS: 'health_patients',
    DOCTORS: 'health_doctors',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    PRESCRIPTIONS: 'health_prescriptions',
    MEDICAL_RECORDS: 'health_medical_records',
    STAFF: 'health_staff',
    NURSES: 'health_nurse',
    BILLING: 'health_billing',
    INSURANCE: 'health_insurance', 
    LABORATORY: 'health_laboratory',
    PHARMACY: 'health_pharmacy',
    ROOMS: 'health_rooms',
    HOSPITALIZATIONS: 'health_hospitalization',
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
  SMTP_CONFIG: 'smtp_config',
};
