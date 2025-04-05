
// Define the structure of all available collections in Firestore
export const COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  DEPARTMENTS: 'departments',
  EMPLOYEES: 'employees',
  DOCUMENTS: 'documents',
  SETTINGS: 'settings',
  CONTACTS: 'contacts', // Added for messages module
  // CRM Collections
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm/prospects',
    REMINDERS: 'crm/reminders',
    OPPORTUNITIES: 'crm/opportunities',
    LEADS: 'crm/leads',
    CONTACTS: 'crm/contacts',
    DEALS: 'crm/deals',
    SETTINGS: 'crm/settings'
  },
  // Accounting Collections
  ACCOUNTING: {
    INVOICES: 'accounting/invoices',
    EXPENSES: 'accounting/expenses',
    PAYMENTS: 'accounting/payments',
    TRANSACTIONS: 'accounting/transactions',
    PERMISSIONS: 'accounting/permissions'
  },
  // Freight Collections
  FREIGHT: {
    SHIPMENTS: 'freight/shipments',
    CARRIERS: 'freight/carriers',
    PACKAGES: 'freight/packages',
    ROUTES: 'freight/routes',
    TRACKING_EVENTS: 'freight/tracking_events',
    PACKAGE_TYPES: 'freight/package_types',
    TRACKING: 'freight/tracking',
    VEHICLES: 'freight/vehicles', // Added
    DRIVERS: 'freight/drivers' // Added
  },
  // HR Collections
  HR: {
    BADGES: 'hr/badges',
    EVALUATIONS: 'hr/evaluations',
    DOCUMENTS: 'hr/documents',
    CONTRACTS: 'hr/contracts',
    RECRUITMENT: 'hr/recruitment',
    DEPARTMENTS: 'hr/departments',
    EMPLOYEES: 'hr/employees',
    TRAININGS: 'hr/trainings',
    LEAVES: 'hr/leaves',
    ABSENCES: 'hr/absences',
    TIMESHEETS: 'hr/timesheets',
    SALARIES: 'hr/salaries',
    PAYSLIPS: 'hr/payslips', // Added
    LEAVE_REQUESTS: 'hr/leave_requests', // Added
    ATTENDANCE: 'hr/attendance', // Added
    ABSENCE_REQUESTS: 'hr/absence_requests', // Added
    REPORTS: 'hr/reports', // Added
    ALERTS: 'hr/alerts' // Added
  },
  // Messages Collections
  MESSAGES: {
    INBOX: 'messages/inbox',
    SENT: 'messages/sent',
    DRAFTS: 'messages/drafts',
    ARCHIVED: 'messages/archived',
    SCHEDULED: 'messages/scheduled',
    CONTACTS: 'messages/contacts',
    METRICS: 'messages/metrics' // Added
  },
  // Projects Collections
  PROJECTS: {
    PROJECTS: 'projects/projects',
    TASKS: 'projects/tasks',
    TEAMS: 'projects/teams',
    COMMENTS: 'projects/comments',
    NOTIFICATIONS: 'projects/notifications'
  },
  // Health Collections
  HEALTH: {
    PATIENTS: 'health/patients',
    DOCTORS: 'health/doctors',
    APPOINTMENTS: 'health/appointments',
    CONSULTATIONS: 'health/consultations',
    INSURANCE: 'health/insurance',
    BILLING: 'health/billing',
    STAFF: 'health/staff',
    HEALTH_CONSULTATIONS: 'health/consultations', // Added
    HEALTH_INSURANCE: 'health/insurance', // Added
    HEALTH_BILLING: 'health/billing' // Added
  },
  // Library Collections
  LIBRARY: {
    BOOKS: 'library/books',
    MEMBERS: 'library/members',
    LOANS: 'library/loans',
    CATEGORIES: 'library/categories',
    ACCESS_POINTS: 'library/access_points',
    STATS: 'library/stats' // Added
  },
  // Transport Collections
  TRANSPORT: {
    VEHICLES: 'transport/vehicles',
    DRIVERS: 'transport/drivers',
    RESERVATIONS: 'transport/reservations',
    MAINTENANCE: 'transport/maintenance',
    CLIENTS: 'transport/clients' // Added
  },
  // User permissions
  USER_PERMISSIONS: 'user_permissions'
};
