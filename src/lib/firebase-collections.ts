
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
export const TRANSPORT = 'transport'; // Added transport collection

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

// Ajout des collections pour le module Transport
export const TRANSPORT_RESERVATIONS = 'transport_reservations';
export const TRANSPORT_CLIENTS = 'transport_clients';
export const TRANSPORT_VEHICLES = 'transport_vehicles';
export const TRANSPORT_DRIVERS = 'transport_drivers';
export const TRANSPORT_CONTRACTS = 'transport_contracts';
export const TRANSPORT_PAYMENTS = 'transport_payments';
export const TRANSPORT_LOCATIONS = 'transport_locations';
export const TRANSPORT_LOYALTY_MEMBERS = 'transport_loyalty_members';
export const TRANSPORT_LOYALTY_REWARDS = 'transport_loyalty_rewards';
export const TRANSPORT_LOYALTY_TRANSACTIONS = 'transport_loyalty_transactions';
export const TRANSPORT_LOYALTY_SETTINGS = 'transport_loyalty_settings';

// Ajout des collections spécifiques pour le module Freight
export const FREIGHT_SHIPMENTS = 'freight_shipments';
export const FREIGHT_CONTAINERS = 'freight_containers';
export const FREIGHT_CARRIERS = 'freight_carriers';
export const FREIGHT_TRACKING = 'freight_tracking';
export const FREIGHT_PACKAGES = 'freight_packages';
export const FREIGHT_ROUTES = 'freight_routes';
export const FREIGHT_PRICING = 'freight_pricing';
export const FREIGHT_DOCUMENTS = 'freight_documents';
export const FREIGHT_TRACKING_EVENTS = 'freight_tracking_events';
export const FREIGHT_PACKAGE_TYPES = 'freight_package_types';
export const FREIGHT_CLIENT_PORTAL = 'freight_client_portal';

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

// Freight subcollections - Étendre pour inclure toutes les collections du module
export const FREIGHT_COLLECTIONS = {
  SHIPMENTS: 'freight_shipments',
  CONTAINERS: 'freight_containers',
  CARRIERS: 'freight_carriers',
  TRACKING: 'freight_tracking',
  TRACKING_EVENTS: 'freight_tracking_events',
  PACKAGES: 'freight_packages',
  ROUTES: 'freight_routes',
  PRICING: 'freight_pricing',
  DOCUMENTS: 'freight_documents',
  PACKAGE_TYPES: 'freight_package_types',
  CLIENT_PORTAL: 'freight_client_portal'
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

// Transport subcollections
export const TRANSPORT_COLLECTIONS = {
  RESERVATIONS: 'transport_reservations',
  CLIENTS: 'transport_clients',
  VEHICLES: 'transport_vehicles',
  DRIVERS: 'transport_drivers',
  CONTRACTS: 'transport_contracts',
  PAYMENTS: 'transport_payments',
  LOCATIONS: 'transport_locations',
  LOYALTY: {
    MEMBERS: 'transport_loyalty_members',
    REWARDS: 'transport_loyalty_rewards',
    TRANSACTIONS: 'transport_loyalty_transactions',
    SETTINGS: 'transport_loyalty_settings'
  }
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
  TRANSPORT: TRANSPORT_COLLECTIONS,
  
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
  LIBRARY_STATS,
  
  // Transport module collections
  TRANSPORT_RESERVATIONS,
  TRANSPORT_CLIENTS,
  TRANSPORT_VEHICLES,
  TRANSPORT_DRIVERS,
  TRANSPORT_CONTRACTS,
  TRANSPORT_PAYMENTS,
  TRANSPORT_LOCATIONS,
  TRANSPORT_LOYALTY_MEMBERS,
  TRANSPORT_LOYALTY_REWARDS,
  TRANSPORT_LOYALTY_TRANSACTIONS,
  TRANSPORT_LOYALTY_SETTINGS
};
