
// Liste des collections Firebase pour l'application
export const COLLECTIONS = {
  // Gestion d'entreprise
  EMPLOYEES: 'employees',
  COMPANIES: 'companies',
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    TAXES: 'accounting_taxes',
    REPORTS: 'accounting_reports',
    SETTINGS: 'accounting_settings',
    BANK_ACCOUNTS: 'accounting_bank_accounts',
    TRANSACTIONS: 'accounting_transactions',
    PERMISSIONS: 'accounting_permissions'
  },
  PROJECTS: {
    PROJECTS: 'projects_list',
    TASKS: 'projects_tasks',
    TEAMS: 'projects_teams',
    COMMENTS: 'projects_comments',
    NOTIFICATIONS: 'projects_notifications',
    SETTINGS: 'projects_settings'
  },
  CRM: {
    PROSPECTS: 'crm_prospects',
    CLIENTS: 'crm_clients',
    OPPORTUNITIES: 'crm_opportunities',
    ACTIVITIES: 'crm_activities'
  },
  CONTACTS: 'contacts',
  
  // Services spécialisés
  RESTAURANTS: 'restaurants',
  GARAGES: 'garages',
  TRANSPORT: 'transport',
  HEALTH: 'health',
  HEALTH_PATIENTS: 'health_patients',
  HEALTH_DOCTORS: 'health_doctors',
  HEALTH_NURSES: 'health_nurses',
  HEALTH_APPOINTMENTS: 'health_appointments',
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_MEDICAL_RECORDS: 'health_medical_records',
  HEALTH_LABORATORY: 'health_laboratory',
  HEALTH_PRESCRIPTIONS: 'health_prescriptions',
  HEALTH_PHARMACY: 'health_pharmacy',
  HEALTH_SETTINGS: 'health_settings',
  HEALTH_STAFF: 'health_staff',
  HEALTH_SCHEDULES: 'health_schedules',
  HEALTH_ABSENCES: 'health_absences',
  HEALTH_PHARMACY_INVENTORY: 'health_pharmacy_inventory',
  HEALTH_PHARMACY_SALES: 'health_pharmacy_sales',
  HEALTH_PHARMACY_RESTOCKS: 'health_pharmacy_restocks',
  HEALTH_MEDICAL_IMAGES: 'health_medical_images',
  VEHICLE_RENTALS: 'vehicleRentals',
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CONTAINERS: 'freight_containers',
    CARRIERS: 'freight_carriers',
    TRACKING: 'freight_tracking',
    PRICING: 'freight_pricing',
    DOCUMENTS: 'freight_documents'
  },
  LIBRARY: 'library',
  
  // Présence numérique
  WEBSITES: 'websites',
  ECOMMERCE: 'ecommerce',
  ACADEMY: 'academy',
  EVENTS: 'events',
  
  // Communication
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  DOCUMENTS: 'documents',
  
  // Gestion de l'application
  USERS: 'users',
  USER_PERMISSIONS: 'userPermissions',
  SETTINGS: 'settings',
  MODULES: 'modules'
};
