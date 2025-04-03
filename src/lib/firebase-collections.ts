
/**
 * Liste des collections Firebase pour une référence facile
 */
export const COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  DOCUMENTS: 'documents',
  MESSAGES: 'messages',
  CONTACTS: 'contacts',
  EMPLOYEES: 'employees',
  USER_PERMISSIONS: 'user_permissions',
  
  // Collections pour les modules
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    REPORTS: 'accounting_reports',
    SETTINGS: 'accounting_settings'
  },
  
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    ACTIVITIES: 'crm_activities'
  },
  
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CONTAINERS: 'freight_containers',
    TRACKING: 'freight_tracking',
    INVOICES: 'freight_invoices',
    DOCUMENTS: 'freight_documents',
    SETTINGS: 'freight_settings'
  },
  
  HEALTH: {
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    INSURANCE: 'health_insurance',
    BILLING: 'health_billing',
    STAFF: 'health_staff'
  },
  
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RESERVATIONS: 'library_reservations',
    SETTINGS: 'library_settings'
  },
  
  PROJECTS: {
    PROJECTS: 'projects_projects',
    TASKS: 'projects_tasks',
    TEAMS: 'projects_teams',
    REPORTS: 'projects_reports'
  },
  
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    RESERVATIONS: 'transport_reservations'
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
