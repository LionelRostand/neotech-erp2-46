
export const COLLECTIONS = {
  HR: {
    EMPLOYEES: 'hr_employees',
    TRAININGS: 'hr_trainings',
    ABSENCE_REQUESTS: 'hr_absence_requests',  // Added for EmployeesAbsences component
  },
  GARAGE: {
    MECHANICS: 'garage_mechanics',
    REPAIRS: 'garage_repairs',
    VEHICLES: 'garage_vehicles',
    SERVICES: 'garage_services',
    INVOICES: 'garage_invoices',
    CLIENTS: 'garage_clients',
    APPOINTMENTS: 'garage_appointments',
    INVENTORY: 'garage_inventory',
    LOYALTY: 'garage_loyalty',
    SETTINGS: 'garage_settings',
    SUPPLIERS: 'garage_suppliers',
  },
  MESSAGES: {
    CONTACTS: 'message_contacts',
    INBOX: 'message_inbox',
    SENT: 'message_sent',
    ARCHIVED: 'message_archived',
    SCHEDULED: 'message_scheduled',
    DRAFTS: 'message_drafts',  // Added for useMessageForm
    MESSAGES: 'messages',       // Added for MessagesDashboard
  },
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    CATEGORIES: 'document_categories',
    PERMISSIONS: 'document_permissions',
    SETTINGS: 'document_settings',
  }
} as const;
