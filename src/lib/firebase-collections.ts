
/**
 * Définition des chemins vers les collections Firestore utilisées dans l'application
 * Centraliser ces chemins permet d'éviter les erreurs de frappe et facilite les changements
 */
export const COLLECTIONS = {
  // Collections principales
  USERS: 'users',
  COMPANIES: 'companies',
  USER_PERMISSIONS: 'user_permissions',
  
  // Module RH (Ressources Humaines)
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
  
  // Module Finance
  FINANCE: {
    INVOICES: 'invoices',
    EXPENSES: 'expenses',
    ACCOUNTS: 'accounts',
    TRANSACTIONS: 'transactions'
  },
  
  // Module CRM
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

  // Module Projets
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'tasks',
    MILESTONES: 'milestones',
    TIMESHEETS: 'project_timesheets',
    TEAMS: 'teams',
    NOTIFICATIONS: 'project_notifications'
  },
  
  // Module Documents
  DOCUMENTS: 'documents',

  // Module Messages
  MESSAGES: 'messages',
  CONTACTS: 'contacts',
  
  // Module Comptabilité
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

  // Module Santé
  HEALTH: {
    PATIENTS: 'patients',
    CONSULTATIONS: 'consultations',
    STAFF: 'health_staff',
    APPOINTMENTS: 'appointments',
    INSURANCE: 'insurance',
    BILLING: 'health_billing',
    PRESCRIPTIONS: 'prescriptions',
    MEDICAL_RECORDS: 'medical_records',
    INVENTORY: 'medical_inventory'
  },

  // Module Transport
  TRANSPORT: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients',
    ROUTES: 'transport_routes',
    MAINTENANCE: 'transport_maintenance'
  },

  // Module Fret
  FREIGHT: {
    SHIPMENTS: 'shipments',
    CONTAINERS: 'containers',
    CARRIERS: 'carriers',
    TRACKING: 'tracking_events',
    CUSTOMERS: 'freight_customers',
    DOCUMENTS: 'freight_documents',
    RATES: 'freight_rates',
    ROUTES: 'freight_routes',
    CUSTOMS: 'customs_declarations',
    PERMISSIONS: 'freight_permissions',
    SETTINGS: 'freight_settings',
    USERS: 'freight_users'
  },

  // Module Bibliothèque
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
