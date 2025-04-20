
/**
 * Constantes pour les chemins des collections Firestore
 * Utilisé pour centraliser les noms des collections et éviter les erreurs de typo
 */
export const COLLECTIONS = {
  USERS: 'users',
  EMPLOYEES: 'employees',
  USER_PERMISSIONS: 'user-permissions',
  CONTACTS: 'contacts',  // Ajout de la collection contacts
  HR: {
    EMPLOYEES: 'hr-employees',
    DEPARTMENTS: 'hr-departments',
    CONTRACTS: 'hr-contracts',
    ABSENCES: 'hr-absences',
    LEAVE_REQUESTS: 'hr-leave-requests',
    EVALUATIONS: 'hr-evaluations',
    TRAININGS: 'hr-trainings',
    ABSENCE_REQUESTS: 'hr-absence-requests',
    MANAGERS: 'hr-managers',
    RECRUITMENT: 'hr-recruitment',
    LEAVES: 'hr-leaves',
    ALERTS: 'hr-alerts',
    TIMESHEET: 'hr-timesheet'
  },
  COMPANIES: 'companies',
  TRANSPORT: {
    VEHICLES: 'transport-vehicles',
    DRIVERS: 'transport-drivers',
    ROUTES: 'transport-routes',
    MAINTENANCE: 'transport-maintenance',
    CLIENTS: 'transport-clients',
    SHIPMENTS: 'transport-shipments'
  },
  MESSAGES: {
    INBOX: 'messages-inbox',
    SENT: 'messages-sent',
    DRAFTS: 'messages-drafts',
    CONTACTS: 'messages-contacts',
    ARCHIVE: 'messages-archive',
    ARCHIVED: 'messages-archive', // Alias pour ARCHIVE pour compatibilité
    SCHEDULED: 'messages-scheduled',
    TEMPLATES: 'messages-templates',
    SETTINGS: 'messages-settings',
    METRICS: 'messages-metrics'  // Ajout des métriques
  },
  // Ajout des collections pour les documents
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    FOLDERS: 'document-folders',
    TEMPLATES: 'document-templates',
    SETTINGS: 'document-settings',
    CATEGORIES: 'document-categories',
    PERMISSIONS: 'document-permissions',
    ARCHIVES: 'document-archives',
    VERSIONS: 'document-versions',
    SHARED: 'document-shared',
    TAGS: 'document-tags'
  }
};
