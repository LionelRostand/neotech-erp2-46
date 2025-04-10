
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
    PAYROLL: 'payroll'
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
    CONTACTS: 'contacts'
  },

  // Module Projets
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'tasks',
    MILESTONES: 'milestones',
    TIMESHEETS: 'timesheets'
  },
  
  // Module Documents
  DOCUMENTS: 'documents',
  
  // Autres modules peuvent être ajoutés ici...
};

