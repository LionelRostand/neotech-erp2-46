
/**
 * Firebase collections paths
 * This file centralizes all collection paths used in the application
 */

export const COLLECTIONS = {
  USERS: 'users',
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    DOCUMENTS: 'hr_documents',
    LEAVES: 'hr_leaves',
    ABSENCES: 'hr_absences',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    BADGES: 'hr_badges',
    SALARIES: 'hr_salaries',
    ATTENDANCE: 'hr_attendance',
    TIMESHEET: 'hr_timesheet',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    LEAVE_REQUESTS: 'hr_leave_requests',
    MANAGERS: 'hr_managers',
    USER_PERMISSIONS: 'hr_user_permissions',
    RECRUITMENTS: 'hr_recruitments',
    PAYSLIPS: 'hr_payslips',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts'
  },
  COMPANIES: 'companies',
  DOCUMENTS: 'documents',
  SETTINGS: 'settings',
  
  // Messages module collections
  MESSAGES: {
    INBOX: 'messages_inbox',
    SENT: 'messages_sent',
    DRAFTS: 'messages_drafts',
    ARCHIVE: 'messages_archive',  // Note: not ARCHIVED
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics',
    SETTINGS: 'messages_settings',
    TEMPLATES: 'messages_templates'
  },
  
  // Contacts collection
  CONTACTS: 'contacts',
  
  // Accounting module collections
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
    PERMISSIONS: 'accounting_permissions'
  },
  
  // CRM module collections
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    LEADS: 'crm_leads',
    CONTACTS: 'crm_contacts',
    ACTIVITIES: 'crm_activities',
    SETTINGS: 'crm_settings',
    CAMPAIGNS: 'crm_campaigns',
    USER_PERMISSIONS: 'crm_user_permissions',
    DEALS: 'crm_deals',
    REMINDERS: 'crm_reminders'
  },
  
  // Projects module collections
  PROJECTS: {
    PROJECTS: 'projects_projects',
    TASKS: 'projects_tasks',
    TEAMS: 'projects_teams',
    REPORTS: 'projects_reports',
    COMMENTS: 'projects_comments',
    MILESTONES: 'projects_milestones',
    SETTINGS: 'projects_settings',
    NOTIFICATIONS: 'projects_notifications'
  },
  
  // Health module collections
  HEALTH: {
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    MEDICAL_RECORDS: 'health_medical_records',
    PRESCRIPTIONS: 'health_prescriptions',
    STAFF: 'health_staff',
    INVENTORY: 'health_inventory',
    BILLING: 'health_billing',
    INSURANCE: 'health_insurance',
    SETTINGS: 'health_settings',
    INTEGRATIONS: 'health_integrations',
    CONSULTATIONS: 'health_consultations',
    DOCTORS: 'health_doctors'
  },
  
  // Freight module collections
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CARRIERS: 'freight_carriers',
    CONTAINERS: 'freight_containers',
    TRACKING: 'freight_tracking',
    DOCUMENTS: 'freight_documents',
    RATES: 'freight_rates',
    INVOICES: 'freight_invoices',
    CLIENTS: 'freight_clients',
    SETTINGS: 'freight_settings',
    USERS: 'freight_users',
    PACKAGES: 'freight_packages',
    TRACKING_EVENTS: 'freight_tracking_events',
    PACKAGE_TYPES: 'freight_package_types',
    ROUTES: 'freight_routes',
    PRICING: 'freight_pricing',
    BILLING: 'freight_billing',
    QUOTES: 'freight_quotes',
    CUSTOMERS: 'freight_customers'
  },
  
  // Library module collections
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RESERVATIONS: 'library_reservations',
    CATEGORIES: 'library_categories',
    PUBLISHERS: 'library_publishers',
    AUTHORS: 'library_authors',
    SETTINGS: 'library_settings',
    STATS: 'library_stats'
  },
  
  // Transport module collection
  TRANSPORT: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients'
  },
  
  // Add top-level USER_PERMISSIONS
  USER_PERMISSIONS: 'user_permissions'
};
