
/**
 * Constantes pour les chemins des collections Firestore
 * Utilisé pour centraliser les noms des collections et éviter les erreurs de typo
 */
export const COLLECTIONS = {
  USERS: 'users',
  EMPLOYEES: 'employees',
  USER_PERMISSIONS: 'user-permissions', // Ajout de la collection de permissions utilisateur
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
    SCHEDULED: 'messages-scheduled',
    TEMPLATES: 'messages-templates',
    SETTINGS: 'messages-settings'
  }
};
