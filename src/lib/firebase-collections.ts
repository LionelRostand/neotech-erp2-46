
// Firestore collections names
export const USERS = 'users';
export const MODULES = 'modules';
export const APPLICATIONS = 'applications';
export const SETTINGS = 'settings';

// Collections générales pour les modules
export const DOCUMENTS = 'documents';
export const CONTACTS = 'contacts';
export const USER_PERMISSIONS = 'user_permissions';

// Collections pour les modules spécifiques
export const ACCOUNTING = 'accounting';
export const COMPANIES = 'companies'; 
export const CRM = 'crm';
export const EMPLOYEES = 'employees';
export const FREIGHT = 'freight';
export const PROJECTS = 'projects';
export const HEALTH = 'health';
export const LIBRARY = 'library'; // Added library collection

// Ajout des collections pour le module Health
export const HEALTH_PATIENTS = 'health_patients';
export const HEALTH_APPOINTMENTS = 'health_appointments';
export const HEALTH_DOCTORS = 'health_doctors';
export const HEALTH_NURSES = 'health_nurses';
export const HEALTH_STAFF = 'health_staff';
export const HEALTH_CONSULTATIONS = 'health_consultations';
export const HEALTH_MEDICAL_RECORDS = 'health_medical_records';
export const HEALTH_PRESCRIPTIONS = 'health_prescriptions';
export const HEALTH_LABORATORY = 'health_laboratory';
export const HEALTH_PHARMACY = 'health_pharmacy';
export const HEALTH_INSURANCE = 'health_insurance';
export const HEALTH_BILLING = 'health_billing';
export const HEALTH_ROOMS = 'health_rooms';
export const HEALTH_ADMISSIONS = 'health_admissions';
export const HEALTH_INTEGRATIONS = 'health_integrations';

// Ajout des collections pour le module Library
export const LIBRARY_BOOKS = 'library_books';
export const LIBRARY_MEMBERS = 'library_members';
export const LIBRARY_LOANS = 'library_loans';
export const LIBRARY_CATEGORIES = 'library_categories';
export const LIBRARY_PUBLISHERS = 'library_publishers';
export const LIBRARY_AUTHORS = 'library_authors';
export const LIBRARY_STATS = 'library_stats';

// Messages subcollections
export const MESSAGES = {
  ROOT: 'messages',
  INBOX: 'messages_inbox',
  ARCHIVED: 'messages_archived',
  SCHEDULED: 'messages_scheduled',
  METRICS: 'messages_metrics'
};

// Projects subcollections
export const PROJECTS_COLLECTIONS = {
  PROJECTS: 'projects_projects',
  TASKS: 'projects_tasks',
  TEAMS: 'projects_teams',
  NOTIFICATIONS: 'projects_notifications'
};

// Accounting subcollections
export const ACCOUNTING_COLLECTIONS = {
  INVOICES: 'accounting_invoices',
  PAYMENTS: 'accounting_payments',
  TRANSACTIONS: 'accounting_transactions',
  PERMISSIONS: 'accounting_permissions'
};

// Freight subcollections
export const FREIGHT_COLLECTIONS = {
  SHIPMENTS: 'freight_shipments',
  TRACKING: 'freight_tracking'
};

// CRM subcollections
export const CRM_COLLECTIONS = {
  PROSPECTS: 'crm_prospects',
  OPPORTUNITIES: 'crm_opportunities'
};

// Library subcollections
export const LIBRARY_COLLECTIONS = {
  BOOKS: 'library_books',
  MEMBERS: 'library_members',
  LOANS: 'library_loans',
  CATEGORIES: 'library_categories',
  PUBLISHERS: 'library_publishers',
  AUTHORS: 'library_authors',
  STATS: 'library_stats'
};

// Exports as a single object for convenience
export const COLLECTIONS = {
  USERS,
  MODULES,
  APPLICATIONS,
  SETTINGS,
  
  // Collections générales
  DOCUMENTS,
  CONTACTS,
  MESSAGES,
  USER_PERMISSIONS,
  
  // Collections pour modules spécifiques
  ACCOUNTING: ACCOUNTING_COLLECTIONS,
  COMPANIES,
  CRM: CRM_COLLECTIONS,
  EMPLOYEES,
  FREIGHT: FREIGHT_COLLECTIONS,
  PROJECTS: PROJECTS_COLLECTIONS,
  HEALTH,
  LIBRARY: LIBRARY_COLLECTIONS,
  
  // Health module collections
  HEALTH_PATIENTS,
  HEALTH_APPOINTMENTS,
  HEALTH_DOCTORS,
  HEALTH_NURSES,
  HEALTH_STAFF,
  HEALTH_CONSULTATIONS,
  HEALTH_MEDICAL_RECORDS,
  HEALTH_PRESCRIPTIONS,
  HEALTH_LABORATORY,
  HEALTH_PHARMACY,
  HEALTH_INSURANCE,
  HEALTH_BILLING,
  HEALTH_ROOMS,
  HEALTH_ADMISSIONS,
  HEALTH_INTEGRATIONS,
  
  // Library module collections
  LIBRARY_BOOKS,
  LIBRARY_MEMBERS,
  LIBRARY_LOANS,
  LIBRARY_CATEGORIES,
  LIBRARY_PUBLISHERS,
  LIBRARY_AUTHORS,
  LIBRARY_STATS
};
