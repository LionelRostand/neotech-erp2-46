
export const COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  USER_PERMISSIONS: 'user_permissions',
  DOCUMENTS: 'documents',
  CONTACTS: 'contacts',
  EMPLOYEES: 'employees', // Add direct employees collection
  MESSAGES: {
    INBOX: 'messages/inbox',
    SCHEDULED: 'messages/scheduled',
    ARCHIVED: 'messages/archived',
    METRICS: 'messages/metrics'
  },
  PROJECTS: {
    MAIN: 'projects',
    TASKS: 'projects/tasks',
    COMMENTS: 'projects/comments',
    TEAMS: 'project_teams', // Add this collection for projects team
    PROJECTS: 'projects_data', // This for project data specifically
    NOTIFICATIONS: 'project_notifications' // For project notifications
  },
  ORDERS: 'orders',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  CUSTOMERS: 'customers',
  // Add missing collections required by other modules
  BADGES: 'badges',
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    TRANSACTIONS: 'accounting_transactions', // Added missing TRANSACTIONS field
    PERMISSIONS: 'accounting_permissions'     // Added missing PERMISSIONS field
  },
  CRM: {
    LEADS: 'crm_leads',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts',
    DEALS: 'crm_deals',
    CLIENTS: 'crm_clients',         // Added missing CLIENTS field
    PROSPECTS: 'crm_prospects'      // Added missing PROSPECTS field
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    VEHICLES: 'freight_vehicles',
    ROUTES: 'freight_routes',
    DRIVERS: 'freight_drivers',
    PACKAGES: 'freight_packages',
    TRACKING: 'freight_tracking',
    CARRIERS: 'freight_carriers',             // Added missing CARRIERS field
    TRACKING_EVENTS: 'freight_tracking_events', // Added missing TRACKING_EVENTS field
    PACKAGE_TYPES: 'freight_package_types'      // Added missing PACKAGE_TYPES field
  },
  HEALTH: {
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    STAFF: 'health_staff',
    BILLING: 'health_billing',
    PRESCRIPTIONS: 'health_prescriptions',
    MEDICAL_RECORDS: 'health_records',
    DOCTORS: 'health_doctors',           // Added missing DOCTORS field 
    CONSULTATIONS: 'health_consultations', // Added missing CONSULTATIONS field
    INSURANCE: 'health_insurance'         // Added missing INSURANCE field
  },
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_INSURANCE: 'health_insurance',
  HEALTH_BILLING: 'health_billing',
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules',
    RESERVATIONS: 'transport_reservations',  // Added missing RESERVATIONS field
    CLIENTS: 'transport_clients'             // Added missing CLIENTS field
  },
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RESERVATIONS: 'library_reservations',
    STATS: 'library_stats'                   // Added missing STATS field
  },
  HR: {
    // Replace slash notation with underscores for all HR collections
    EMPLOYEES: 'hr_employees',
    CONTRACTS: 'hr_contracts',
    DEPARTMENTS: 'hr_departments',
    LEAVE_REQUESTS: 'hr_leave_requests',
    PAYSLIPS: 'hr_payslips',
    ATTENDANCE: 'hr_attendance',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    DOCUMENTS: 'hr_documents',
    TIMESHEETS: 'hr_timesheets',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts',
    BADGES: 'hr_badges',                     // Added missing BADGES field
    RECRUITMENT: 'hr-recruitment'            // Using the existing recruitment collection
  }
};
