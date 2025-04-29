// This file defines all the Firestore collection paths used in the app
// This makes it easier to change collection names if needed and keeps the app consistent

// To move a collection, just change its path here!
export const COLLECTIONS = {
  // Users and authentication
  USERS: 'users',
  
  // HR / Employees module collections
  HR: {
    EMPLOYEES: 'hr/data/employees',
    DEPARTMENTS: 'hr/data/departments', 
    COMPANIES: 'hr/data/companies',
    LEAVES: 'hr/data/leaves',
    CONTRACTS: 'hr/data/contracts',
    EVALUATIONS: 'hr/data/evaluations',
    TRAINING: 'hr/data/training',
    DOCUMENTS: 'hr/data/documents',
    SETTINGS: 'hr/data/settings',
    POSITIONS: 'hr/data/positions', 
    SALARIES: 'hr/data/salaries', 
    ATTENDANCE: 'hr/data/attendance',
    MESSAGES: 'hr/data/messages',
    PERMISSIONS: 'hr/data/permissions',
    BADGES: 'hr/data/badges',
  },
  
  // Accounting module collections
  ACCOUNTING: {
    INVOICES: 'accounting/data/invoices',
    PAYMENTS: 'accounting/data/payments',
    TRANSACTIONS: 'accounting/data/transactions',
    REPORTS: 'accounting/data/reports',
    TAX_RATES: 'accounting/data/taxRates',
    TAX_DECLARATIONS: 'accounting/data/taxDeclarations',
    SETTINGS: 'accounting/data/settings',
    PERMISSIONS: 'accounting/data/permissions',
    CHARTS_OF_ACCOUNTS: 'accounting/data/chartsOfAccounts',
    FISCAL_YEARS: 'accounting/data/fiscalYears',
    BUDGET: 'accounting/data/budget',
    EXPORT_HISTORY: 'accounting/data/exportHistory',
    CLIENTS: 'accounting/data/clients',
    CATEGORIES: 'accounting/data/categories',
    PAYMENT_METHODS: 'accounting/data/paymentMethods',
  },
  
  // Documents module collections
  DOCUMENTS: {
    FILES: 'documents/data/files',
    FOLDERS: 'documents/data/folders',
    TEMPLATES: 'documents/data/templates',
    ARCHIVE: 'documents/data/archive',
    SETTINGS: 'documents/data/settings',
    PERMISSIONS: 'documents/data/permissions',
    TAGS: 'documents/data/tags',
    METADATA: 'documents/data/metadata',
    SHARED: 'documents/data/shared',
  },
  
  // CRM module collections
  CRM: {
    CLIENTS: 'crm/data/clients',
    PROSPECTS: 'crm/data/prospects',
    OPPORTUNITIES: 'crm/data/opportunities',
    CONTACTS: 'crm/data/contacts',
    ACTIVITIES: 'crm/data/activities',
    SETTINGS: 'crm/data/settings',
    PERMISSIONS: 'crm/data/permissions',
  },
  
  // Garage module collections
  GARAGE: {
    VEHICLES: 'garage/data/vehicles',
    MAINTENANCE: 'garage/data/maintenance',
    APPOINTMENTS: 'garage/data/appointments',
    PARTS: 'garage/data/parts',
    TECHNICIANS: 'garage/data/technicians',
    CLIENTS: 'garage/data/clients',
    SETTINGS: 'garage/data/settings',
    PERMISSIONS: 'garage/data/permissions',
  },
  
  // Transport module collections
  TRANSPORT: {
    ROUTES: 'transport/data/routes',
    DRIVERS: 'transport/data/drivers',
    VEHICLES: 'transport/data/vehicles',
    SHIPMENTS: 'transport/data/shipments',
    CLIENTS: 'transport/data/clients',
    MAINTENANCE: 'transport/data/maintenance',
    PLANNING: 'transport/data/planning',
    SETTINGS: 'transport/data/settings',
    PERMISSIONS: 'transport/data/permissions',
    WAYPOINTS: 'transport/data/waypoints',
  },
  
  // Academy module collections
  ACADEMY: {
    STUDENTS: 'academy/data/students',
    TEACHERS: 'academy/data/teachers',
    COURSES: 'academy/data/courses',
    GRADES: 'academy/data/grades',
    ATTENDANCE: 'academy/data/attendance',
    SCHEDULE: 'academy/data/schedule',
    ASSIGNMENTS: 'academy/data/assignments',
    EXAMS: 'academy/data/exams',
    SETTINGS: 'academy/data/settings',
    PERMISSIONS: 'academy/data/permissions',
    DEPARTMENTS: 'academy/data/departments',
    REGISTRATIONS: 'academy/data/registrations',
    DOCUMENTS: 'academy/data/documents',
  },
  
  // Health module collections
  HEALTH: {
    PATIENTS: 'health/data/patients',
    APPOINTMENTS: 'health/data/appointments',
    PRESCRIPTIONS: 'health/data/prescriptions',
    MEDICAL_RECORDS: 'health/data/medicalRecords',
    INVENTORY: 'health/data/inventory',
    STAFF: 'health/data/staff',
    SETTINGS: 'health/data/settings',
    PERMISSIONS: 'health/data/permissions',
    VACCINATION: 'health/data/vaccination',
    INSURANCE: 'health/data/insurance',
  },
  
  // Messages module collections
  MESSAGES: {
    INBOX: 'messages/data/inbox',
    SENT: 'messages/data/sent',
    DRAFTS: 'messages/data/drafts',
    ARCHIVE: 'messages/data/archive',
    SCHEDULED: 'messages/data/scheduled',
    CONTACTS: 'messages/data/contacts',
    SETTINGS: 'messages/data/settings',
    PERMISSIONS: 'messages/data/permissions',
    TEMPLATES: 'messages/data/templates',
    ATTACHMENTS: 'messages/data/attachments',
    FOLDERS: 'messages/data/folders',
    LABELS: 'messages/data/labels',
  },
  
  // Document collections for referencing in document services
  DOCUMENT_COLLECTIONS: {
    FILES: 'documents/data/files',
    FOLDERS: 'documents/data/folders',
    TEMPLATES: 'documents/data/templates',
    ARCHIVE: 'documents/data/archive',
    SETTINGS: 'documents/data/settings',
    PERMISSIONS: 'documents/data/permissions',
    TAGS: 'documents/data/tags',
    METADATA: 'documents/data/metadata',
    SHARED: 'documents/data/shared',
  }
};
