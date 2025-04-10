
// Constantes pour les noms de collections Firebase
export const COLLECTIONS = {
  USERS: 'users',
  USER_PERMISSIONS: 'user_permissions',
  EMPLOYEES: 'hr_employees',
  COMPANIES: 'companies',
  DOCUMENTS: 'documents',
  PROJECTS: {
    PROJECTS: 'projects',
    TASKS: 'project_tasks',
    TEAMS: 'project_teams',
    NOTIFICATIONS: 'project_notifications'
  },
  TASKS: 'tasks',
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
  SHIPMENTS: 'freight_shipments',
  PACKAGES: 'freight_packages',
  CARRIERS: 'freight_carriers',
  ROUTES: 'freight_routes',
  
  // Ajouter les collections manquantes
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    EVALUATIONS: 'hr_evaluations',
    LEAVES: 'hr_leaves',
    TRAININGS: 'hr_trainings',
    RECRUITMENTS: 'hr_recruitments',
    SALARIES: 'hr_salaries',
    TIMESHEETS: 'hr_timesheets',
    DOCUMENTS: 'hr_documents'
  },
  
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts',
    ACTIVITIES: 'crm_activities',
    DEALS: 'crm_deals',
    SETTINGS: 'crm_settings',
    DASHBOARDS: 'crm_dashboards'
  },
  
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    TRANSACTIONS: 'accounting_transactions',
    TAX_DECLARATIONS: 'accounting_tax_declarations',
    TAX_RATES: 'accounting_tax_rates',
    ACCOUNTS: 'accounting_accounts',
    LEDGERS: 'accounting_ledgers'
  },
  
  HEALTH: {
    PATIENTS: 'health_patients',
    CONSULTATIONS: 'health_consultations',
    STAFF: 'health_staff',
    BILLING: 'health_billing',
    INSURANCE: 'health_insurance',
    TREATMENTS: 'health_treatments'
  },
  
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    PACKAGES: 'freight_packages',
    CARRIERS: 'freight_carriers',
    ROUTES: 'freight_routes',
    CONTAINERS: 'freight_containers',
    TRACKING: 'freight_tracking',
    DOCUMENTS: 'freight_documents',
    CLIENTS: 'freight_clients'
  },
  
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    CATEGORIES: 'library_categories',
    PUBLISHERS: 'library_publishers'
  },
  
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules'
  }
};

// Constantes pour les sous-collections
export const SUB_COLLECTIONS = {
  DOCUMENTS: 'documents',
  COMMENTS: 'comments',
  ACTIVITIES: 'activities',
  ATTACHMENTS: 'attachments'
};
