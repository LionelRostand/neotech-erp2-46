
// Firestore collections names
export const USERS = 'users';
export const MODULES = 'modules';
export const APPLICATIONS = 'applications';
export const SETTINGS = 'settings';

// Collections générales pour les modules
export const DOCUMENTS = 'documents';
export const CONTACTS = 'contacts';
export const MESSAGES = 'messages';
export const USER_PERMISSIONS = 'user_permissions';

// Collections pour les modules spécifiques
export const ACCOUNTING = 'accounting';
export const COMPANIES = 'companies'; 
export const CRM = 'crm';
export const EMPLOYEES = 'employees';
export const FREIGHT = 'freight';
export const PROJECTS = 'projects';
export const HEALTH = 'health';

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
  ACCOUNTING,
  COMPANIES,
  CRM,
  EMPLOYEES,
  FREIGHT,
  PROJECTS,
  HEALTH,
  
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
  HEALTH_INTEGRATIONS
};
