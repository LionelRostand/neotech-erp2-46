
/**
 * Constantes pour les noms des collections Firestore
 * Centralise les noms de collections pour éviter les erreurs de frappe et faciliter les refactorisations
 */
export const COLLECTIONS = {
  // Collections principales
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  
  // Module CRM
  CRM_CLIENTS: 'crm_clients',
  CRM_PROSPECTS: 'crm_prospects',
  CRM_OPPORTUNITIES: 'crm_opportunities',
  CRM_REMINDERS: 'crm_reminders',
  CRM_SETTINGS: 'crm_settings',
  
  // Module Comptabilité
  INVOICES: 'accounting_invoices',
  PAYMENTS: 'accounting_payments',
  EXPENSES: 'accounting_expenses',
  ACCOUNTING_CLIENTS: 'accounting_clients',
  ACCOUNTING_SUPPLIERS: 'accounting_suppliers',
  
  // Module RH / Employés
  EMPLOYEES: 'hr-employees',
  DEPARTMENTS: 'hr-departments',
  LEAVES: 'hr-leaves',
  CONTRACTS: 'hr-contracts',
  EVALUATIONS: 'hr-evaluations',
  
  // Module Projets
  PROJECTS: 'projects/projects',
  TASKS: 'projects/tasks',
  TEAMS: 'projects/teams',
  
  // Module Santé
  PATIENTS: 'health-patients',
  DOCTORS: 'health-doctors',
  APPOINTMENTS: 'health-appointments',
  CONSULTATIONS: 'health-consultations',
  
  // Module Freight
  SHIPMENTS: 'freight/shipments',
  PACKAGES: 'freight/packages',
  FREIGHT_CUSTOMERS: 'freight/customers',
  
  // Module Messages
  MESSAGES: 'messages/inbox',
  CONTACTS: 'messages/contacts',
  
  // Module Documents
  DOCUMENTS: 'documents',
  
  // Permissions
  USER_PERMISSIONS: 'userPermissions'
};
