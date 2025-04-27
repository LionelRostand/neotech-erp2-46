
// Define all Firestore collection paths here for consistency
export const COLLECTIONS = {
  // User collections
  USERS: 'users',
  USER_PREFERENCES: 'user_preferences',
  USER_SETTINGS: 'user_settings',
  USER_PERMISSIONS: 'user_permissions',
  
  // All the collection definitions you provided
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

  ANALYTICS: {
    STATS: 'analyticsStats',
    MONTHLY: 'monthlyAnalytics',
    PERFORMANCE: 'monthlyPerformance',
    PERFORMANCE_STATS: 'performanceStats'
  },

  COMPANIES: 'companies',

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

  DOCUMENTS: {
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates',
    DOCUMENTS: 'documents',
    FILES: 'documents_files',
    FOLDERS: 'documents_folders',
    SHARED: 'documents_shared',
    FAVORITES: 'documents_favorites',
    RECENTS: 'documents_recents',
    ARCHIVES: 'documents_archives',
    METADATA: 'documents_metadata',
  },

  DOCUMENT_COLLECTIONS: {
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates',
    DOCUMENTS: 'documents',
    FILES: 'documents_files',
    FOLDERS: 'documents_folders',
    SHARED: 'documents_shared',
    FAVORITES: 'documents_favorites',
    RECENTS: 'documents_recents',
    ARCHIVES: 'documents_archives',
    METADATA: 'documents_metadata',
  },

  FREIGHT: {
    BILLING: 'freight_billing',
    CARRIERS: 'freight_carriers',
    CLIENTS: 'freight_clients',
    CONTAINERS: 'freight_containers',
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

  GARAGE: {
    APPOINTMENTS: 'garage_appointments',
    CLIENTS: 'garage_clients',
    VEHICLES: 'garage_vehicles',
    MECHANICS: 'garage_mechanics',
    SERVICES: 'garage_services',
    REPAIRS: 'garage_repairs',
    MAINTENANCE: 'garage_maintenances',
    INVOICES: 'garage_invoices',
    PARTS: 'garage_parts',
    SUPPLIERS: 'garage_suppliers',
    INVENTORY: 'garage_inventory',
    LOYALTY: 'garage_loyalty',
    PERMISSIONS: 'garage_permissions'
  },

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

  ACADEMY: {
    STUDENTS: 'academy_students',
    STAFF: 'academy_staff',
    TEACHERS: 'academy_teachers',
    REGISTRATIONS: 'academy_registrations',
    COURSES: 'academy_courses',
    GRADES: 'academy_grades',
    EXAMS: 'academy_exams',
    SCHEDULE: 'academy_schedule',
    ATTENDANCE: 'academy_attendance',
    REPORTS: 'academy_reports',
    DOCUMENTS: 'academy_documents',
    GOVERNANCE: 'academy_governance',
    SETTINGS: 'academy_settings'
  },

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

  MESSAGES: {
    ARCHIVE: 'messages_archive',
    CONTACTS: 'messages_contacts',
    DRAFTS: 'messages_drafts',
    INBOX: 'messages_inbox',
    METRICS: 'messages_metrics',
    SCHEDULED: 'messages_scheduled',
    SENT: 'messages_sent',
    SETTINGS: 'messages_settings',
    TEMPLATES: 'messages_templates'
  },

  PROJECTS: {
    MAIN: 'projects',
    NOTIFICATIONS: 'project_notifications'
  },

  SMTP: {
    CONFIG: 'smtp_config'
  },

  TASKS: 'tasks',
  TEAMS: 'teams',

  TRANSPORT: {
    CLIENTS: 'transport_clients',
    DRIVERS: 'transport_drivers',
    RESERVATIONS: 'transport_reservations',
    ROUTES: 'transport_routes',
    SETTINGS: 'transport_settings',
    VEHICLES: 'transport_vehicles'
  }
};
