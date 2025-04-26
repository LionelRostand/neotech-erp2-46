
// Define all Firestore collection paths here for consistency
export const COLLECTIONS = {
  // User collections
  USERS: 'users',
  USER_PREFERENCES: 'user_preferences',
  USER_SETTINGS: 'user_settings',
  
  // Module collections
  MODULES: 'modules',
  SUBMODULES: 'submodules',
  
  // Message module collections
  MESSAGES: {
    INBOX: 'messages_inbox',
    SENT: 'messages_sent',
    DRAFTS: 'messages_drafts',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    TEMPLATES: 'messages_templates',
    CONTACTS: 'messages_contacts',
  },
  
  // Document module collections
  DOCUMENTS: {
    FILES: 'documents_files',
    FOLDERS: 'documents_folders',
    SHARED: 'documents_shared',
    FAVORITES: 'documents_favorites',
    RECENTS: 'documents_recents',
    ARCHIVES: 'documents_archives',
    METADATA: 'documents_metadata',
  },

  // Garage module collections
  GARAGE: {
    APPOINTMENTS: 'garage_appointments',
    CLIENTS: 'garage_clients',
    VEHICLES: 'garage_vehicles',
    MECHANICS: 'garage_mechanics',
    SERVICES: 'garage_services',
    REPAIRS: 'garage_repairs',
    MAINTENANCE: 'garage_maintenance', // Add the maintenance collection path
    INVOICES: 'garage_invoices',
    PARTS: 'garage_parts',
    SUPPLIERS: 'garage_suppliers',
    INVENTORY: 'garage_inventory',
  },
};
