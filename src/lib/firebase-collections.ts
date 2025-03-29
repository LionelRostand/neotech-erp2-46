
export const COLLECTIONS = {
  USERS: 'users',
  USER_PERMISSIONS: 'userPermissions',
  EMPLOYEES: 'employees',
  COMPANIES: 'companies',
  DOCUMENTS: 'documents',
  SETTINGS: 'settings',
  MODULES: 'modules',
  CONTACTS: 'contacts', // Top-level contacts collection
  
  // Collection paths for top-level directories
  MESSAGES: {
    ROOT: 'messages',
    INBOX: 'messages_inbox',
    CONTACTS: 'messages_contacts',
    SCHEDULED: 'messages_scheduled',
    ARCHIVED: 'messages_archived',
    METRICS: 'messages_metrics'
  },
  
  ACCOUNTING: {
    ROOT: 'accounting',
    TRANSACTIONS: 'accounting_transactions',
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    PERMISSIONS: 'accounting_permissions'
  },
  
  CRM: {
    ROOT: 'crm',
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts'
  },
  
  PROJECTS: {
    ROOT: 'projects',
    TASKS: 'project_tasks',
    TEAMS: 'project_teams',
    NOTIFICATIONS: 'project_notifications',
    PROJECTS: 'projects_list' // PROJECTS field for projects list
  },
  
  FREIGHT: {
    ROOT: 'freight',
    SHIPMENTS: 'freight_shipments',
    CARRIERS: 'freight_carriers',
    PACKAGES: 'freight_packages',
    TRACKING: 'freight_tracking',
    TRACKING_EVENTS: 'freight_tracking_events',
    ROUTES: 'freight_routes',
    PACKAGE_TYPES: 'freight_package_types'
  },
  
  HEALTH: {
    ROOT: 'health',
    PATIENTS: 'health_patients',
    DOCTORS: 'health_doctors',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    INSURANCE: 'health_insurance',
    BILLING: 'health_billing',
    STAFF: 'health_staff'
  },
  
  // Direct properties for health collections
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_PATIENTS: 'health_patients',
  HEALTH_DOCTORS: 'health_doctors',
  HEALTH_APPOINTMENTS: 'health_appointments',
  HEALTH_INSURANCE: 'health_insurance',
  HEALTH_BILLING: 'health_billing',
  HEALTH_STAFF: 'health_staff',
  
  LIBRARY: {
    ROOT: 'library',
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    STATS: 'library_stats'
  },
  
  TRANSPORT: {
    ROOT: 'transport',
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    RESERVATIONS: 'transport_reservations',
    MAINTENANCE: 'transport_maintenance',
    INCIDENTS: 'transport_incidents',
    CLIENTS: 'transport_clients',
    PAYMENTS: 'transport_payments',
    SETTINGS: 'transport_settings'
  },
  
  COMPANY_DATA: {
    ROOT: 'companies',
    COMPANIES: 'companies', // Main companies collection
    CONTACTS: 'company_contacts',
    DOCUMENTS: 'company_documents'
  },
  
  // Nouvelles collections pour les ressources humaines
  HR: {
    ROOT: 'hr',
    EMPLOYEES: 'employees',
    PAYSLIPS: 'hr_payslips',
    LEAVE_REQUESTS: 'hr_leave_requests',
    CONTRACTS: 'hr_contracts',
    EVALUATIONS: 'hr_evaluations',
    DEPARTMENTS: 'hr_departments',
    TRAININGS: 'hr_trainings'
  }
};
