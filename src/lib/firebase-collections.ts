
export const COLLECTIONS = {
  USERS: 'users',
  USER_PERMISSIONS: 'userPermissions',
  EMPLOYEES: 'employees',
  COMPANIES: 'companies',
  PROJECTS: 'projects',
  ACCOUNTING: 'accounting',
  CRM: 'crm',
  DOCUMENTS: 'documents',
  MESSAGES: 'messages',
  SETTINGS: 'settings',
  MODULES: 'modules',
  FREIGHT_SHIPMENTS: 'freight_shipments',
  FREIGHT_CONTAINERS: 'freight_containers',
  FREIGHT_CARRIERS: 'freight_carriers',
  FREIGHT_TRACKING: 'freight_tracking',
  FREIGHT_PRICING: 'freight_pricing',
  FREIGHT_DOCUMENTS: 'freight_documents',
  HEALTH: 'health',
  HEALTH_PATIENTS: 'health_patients',
  HEALTH_DOCTORS: 'health_doctors',
  HEALTH_APPOINTMENTS: 'health_appointments',
  
  // Messages collections
  CONTACTS: 'contacts',
  INBOX: 'inbox',
  SCHEDULED: 'scheduled',
  ARCHIVED: 'archived',
  METRICS: 'metrics',
  
  // Project collections
  TASKS: 'tasks',
  TEAMS: 'teams',
  NOTIFICATIONS: 'notifications',
  
  // Accounting collections
  TRANSACTIONS: 'transactions',
  INVOICES: 'invoices',
  PAYMENTS: 'payments',
  PERMISSIONS: 'permissions',
  
  // Freight collection
  FREIGHT: 'freight',
  
  // Health collections
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_INSURANCE: 'health_insurance',
  HEALTH_BILLING: 'health_billing',
  HEALTH_STAFF: 'health_staff',
  
  // Library collections
  LIBRARY: 'library',
  LIBRARY_MEMBERS: 'library_members',
  LIBRARY_LOANS: 'library_loans',
  
  // Convert all top-level strings into structured objects to fix nested property access
  MESSAGES: {
    ROOT: 'messages',
    INBOX: 'messages_inbox',
    CONTACTS: 'messages_contacts',
    SCHEDULED: 'messages_scheduled',
    ARCHIVED: 'messages_archived',
    METRICS: 'messages_metrics'
  },
  
  ACCOUNTING: {
    ROOT: 'accounting',
    TRANSACTIONS: 'accounting_transactions',
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    PERMISSIONS: 'accounting_permissions'
  },
  
  CRM: {
    ROOT: 'crm',
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts'
  },
  
  PROJECTS: {
    ROOT: 'projects',
    TASKS: 'project_tasks',
    TEAMS: 'project_teams',
    NOTIFICATIONS: 'project_notifications'
  },
  
  FREIGHT: {
    ROOT: 'freight',
    SHIPMENTS: 'freight_shipments',
    CARRIERS: 'freight_carriers',
    PACKAGES: 'freight_packages',
    TRACKING: 'freight_tracking',
    TRACKING_EVENTS: 'freight_tracking_events',
    ROUTES: 'freight_routes',
    PACKAGE_TYPES: 'freight_package_types'
  },
  
  HEALTH: {
    ROOT: 'health',
    PATIENTS: 'health_patients',
    DOCTORS: 'health_doctors',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    INSURANCE: 'health_insurance',
    BILLING: 'health_billing',
    STAFF: 'health_staff'
  },
  
  LIBRARY: {
    ROOT: 'library',
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    STATS: 'library_stats'
  },
  
  TRANSPORT_COLLECTIONS: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    RESERVATIONS: 'transport_reservations',
    MAINTENANCE: 'transport_maintenance',
    INCIDENTS: 'transport_incidents',
    CLIENTS: 'transport_clients',
    PAYMENTS: 'transport_payments',
    SETTINGS: 'transport_settings'
  }
};
