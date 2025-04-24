
export const COLLECTIONS = {
  HR: {
    EMPLOYEES: 'hr_employees',
    TRAININGS: 'hr_trainings',  // Adding TRAININGS since it's referenced in other code
  },
  GARAGE: {
    MECHANICS: 'garage_mechanics',
    REPAIRS: 'garage_repairs',
    VEHICLES: 'garage_vehicles',
    SERVICES: 'garage_services',
    INVOICES: 'garage_invoices',
    CLIENTS: 'garage_clients',
    APPOINTMENTS: 'garage_appointments',
  },
  MESSAGES: {  // Adding MESSAGES since it's referenced in components
    CONTACTS: 'message_contacts',
    INBOX: 'message_inbox',
    SENT: 'message_sent',
    ARCHIVED: 'message_archived',
    SCHEDULED: 'message_scheduled'
  },
  DOCUMENT_COLLECTIONS: {  // Adding this since it's referenced in document services
    DOCUMENTS: 'documents',
    CATEGORIES: 'document_categories',
    PERMISSIONS: 'document_permissions',
    SETTINGS: 'document_settings',
  }
} as const;
