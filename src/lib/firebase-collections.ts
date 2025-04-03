
/**
 * Liste des collections Firebase pour une référence facile
 */
export const COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  DOCUMENTS: 'documents',
  MESSAGES: {
    INBOX: 'messages_inbox',
    SCHEDULED: 'messages_scheduled',
    ARCHIVED: 'messages_archived',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
  EMPLOYEES: 'employees',
  USER_PERMISSIONS: 'user_permissions',
  
  // Collections pour les modules
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    REPORTS: 'accounting_reports',
    SETTINGS: 'accounting_settings',
    TRANSACTIONS: 'accounting_transactions',
    PERMISSIONS: 'accounting_permissions'
  },
  
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    ACTIVITIES: 'crm_activities',
    CONTACTS: 'crm_contacts'
  },
  
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CONTAINERS: 'freight_containers',
    TRACKING: 'freight_tracking',
    INVOICES: 'freight_invoices',
    DOCUMENTS: 'freight_documents',
    SETTINGS: 'freight_settings',
    CARRIERS: 'freight_carriers',
    PACKAGES: 'freight_packages',
    ROUTES: 'freight_routes',
    TRACKING_EVENTS: 'freight_tracking_events',
    PACKAGE_TYPES: 'freight_package_types'
  },
  
  // Ajouter les collections directes pour résoudre les erreurs
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_INSURANCE: 'health_insurance',
  HEALTH_BILLING: 'health_billing',
  
  HEALTH: {
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    INSURANCE: 'health_insurance',
    BILLING: 'health_billing',
    STAFF: 'health_staff',
    DOCTORS: 'health_doctors',
    NURSES: 'health_nurses',
    MEDICAL_RECORDS: 'health_medical_records',
    PRESCRIPTIONS: 'health_prescriptions',
    PHARMACY: 'health_pharmacy',
    ADMISSIONS: 'health_admissions',
    ROOMS: 'health_rooms',
    LABORATORY: 'health_laboratory',
    SETTINGS: 'health_settings',
    STATS: 'health_stats',
    INTEGRATIONS: 'health_integrations',
    ASSETS: 'health_assets'
  },
  
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RESERVATIONS: 'library_reservations',
    SETTINGS: 'library_settings',
    STATS: 'library_stats'
  },
  
  PROJECTS: {
    PROJECTS: 'projects_projects',
    TASKS: 'projects_tasks',
    TEAMS: 'projects_teams',
    REPORTS: 'projects_reports',
    NOTIFICATIONS: 'projects_notifications'
  },
  
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients'
  },
  
  // Collections du module HR/Employés
  HR: {
    EMPLOYEES: 'employees', 
    PAYSLIPS: 'hr_payslips',
    LEAVE_REQUESTS: 'hr_leave_requests',
    CONTRACTS: 'hr_contracts', 
    DEPARTMENTS: 'hr_departments',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    BADGES: 'hr_badges',
    ATTENDANCE: 'hr_attendance',
    TIME_SHEETS: 'hr_time_sheets',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    DOCUMENTS: 'hr_documents',
    RECRUITMENT: 'hr_recruitment',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts'
  },
  
  // Autres modules peuvent être ajoutés ici
};
