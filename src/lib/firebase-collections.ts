
// Firebase collections constants

export const COLLECTIONS = {
  // HR module collections
  HR: {
    EMPLOYEES: 'hr_employees',
    PAYSLIPS: 'hr_payslips',
    LEAVE_REQUESTS: 'hr_leaves',
    CONTRACTS: 'hr_contracts',
    DEPARTMENTS: 'hr_departments',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    BADGES: 'hr_badges',
    ATTENDANCE: 'hr_attendance',
    TIMESHEETS: 'hr_timesheets',
    DOCUMENTS: 'hr_documents',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts',
    ABSENCES: 'hr_absences',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    TIME_SHEETS: 'hr_time_sheets'
  },
  
  // For direct access (legacy)
  EMPLOYEES: 'hr_employees',
  PAYSLIPS: 'hr_payslips',
  LEAVE_REQUESTS: 'hr_leaves',
  CONTRACTS: 'hr_contracts',
  DEPARTMENTS: 'hr_departments',
  EVALUATIONS: 'hr_evaluations',
  TRAININGS: 'hr_trainings',
  BADGES: 'hr_badges',
  ATTENDANCE: 'hr_attendance',
  TIMESHEETS: 'hr_timesheets',
  DOCUMENTS: 'hr_documents',
  REPORTS: 'hr_reports',
  ALERTS: 'hr_alerts',
  ABSENCES: 'hr_absences',
  
  // Document collections
  DOCUMENTS: 'documents',
  
  // User permissions
  USER_PERMISSIONS: 'user_permissions',
  
  // Message collections
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
  
  // Freight collections
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CARRIERS: 'freight_carriers',
    PACKAGES: 'freight_packages',
    ROUTES: 'freight_routes',
    TRACKING: 'freight_tracking',
    TRACKING_EVENTS: 'freight_tracking_events',
    PACKAGE_TYPES: 'freight_package_types'
  },
  
  // Health module collections
  HEALTH: {
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    PRESCRIPTIONS: 'health_prescriptions',
    STAFF: 'health_staff',
    BILLING: 'health_billing',
    DOCTORS: 'health_doctors',
    CONSULTATIONS: 'health_consultations',
    INSURANCE: 'health_insurance'
  },
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_INSURANCE: 'health_insurance',
  HEALTH_BILLING: 'health_billing',
  
  // Library module collections
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    STATS: 'library_stats'
  },
  
  // Projects module collections
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'project_tasks',
    TEAMS: 'project_teams',
    COMMENTS: 'project_comments',
    NOTIFICATIONS: 'project_notifications'
  },
  
  // Accounting module collections
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    TRANSACTIONS: 'accounting_transactions',
    PERMISSIONS: 'accounting_permissions'
  },
  
  // CRM module collections
  CRM: {
    LEADS: 'crm_leads',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts',
    ACCOUNTS: 'crm_accounts',
    PROSPECTS: 'crm_prospects',
    CLIENTS: 'crm_clients'
  },
  
  // Transport module collections
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    MAINTENANCE: 'transport_maintenance',
    ROUTES: 'transport_routes',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients'
  },
  
  // Other collections can be added as needed
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  TEMPLATES: 'templates',
  NOTIFICATIONS: 'notifications'
};
