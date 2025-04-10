
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
    DOCUMENTS: 'hr_documents',
    BADGES: 'hr_badges',          // Ajout de la collection des badges
    PAYSLIPS: 'hr_payslips',      // Ajout pour useHrData hook
    LEAVE_REQUESTS: 'hr_leave_requests', // Ajout pour useHrData hook
    ATTENDANCE: 'hr_attendance',   // Ajout pour useHrData hook
    ABSENCE_REQUESTS: 'hr_absence_requests', // Ajout pour useHrData hook
    REPORTS: 'hr_reports',         // Ajout pour useHrData hook
    ALERTS: 'hr_alerts'           // Ajout pour useHrData hook
  },
  
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts',
    ACTIVITIES: 'crm_activities',
    DEALS: 'crm_deals',
    SETTINGS: 'crm_settings',
    DASHBOARDS: 'crm_dashboards',
    LEADS: 'crm_leads',           // Ajout de LEADS
    REMINDERS: 'crm_reminders'    // Ajout de REMINDERS
  },
  
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    TRANSACTIONS: 'accounting_transactions',
    TAX_DECLARATIONS: 'accounting_tax_declarations',
    TAX_RATES: 'accounting_tax_rates',
    ACCOUNTS: 'accounting_accounts',
    LEDGERS: 'accounting_ledgers',
    EXPENSES: 'accounting_expenses',       // Ajout de EXPENSES
    CLIENTS: 'accounting_clients',         // Ajout de CLIENTS
    SUPPLIERS: 'accounting_suppliers',     // Ajout de SUPPLIERS
    REPORTS: 'accounting_reports',         // Ajout de REPORTS
    TAXES: 'accounting_taxes',             // Ajout de TAXES
    SETTINGS: 'accounting_settings',       // Ajout de SETTINGS
    PERMISSIONS: 'accounting_permissions'  // Ajout de PERMISSIONS
  },
  
  HEALTH: {
    PATIENTS: 'health_patients',
    CONSULTATIONS: 'health_consultations',
    STAFF: 'health_staff',
    BILLING: 'health_billing',
    INSURANCE: 'health_insurance',
    TREATMENTS: 'health_treatments',
    DOCTORS: 'health_doctors',             // Ajout de DOCTORS
    APPOINTMENTS: 'health_appointments'    // Ajout de APPOINTMENTS
  },
  
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    PACKAGES: 'freight_packages',
    CARRIERS: 'freight_carriers',
    ROUTES: 'freight_routes',
    CONTAINERS: 'freight_containers',
    TRACKING: 'freight_tracking',
    DOCUMENTS: 'freight_documents',
    CLIENTS: 'freight_clients',
    TRACKING_EVENTS: 'freight_tracking_events',  // Ajout de TRACKING_EVENTS
    PACKAGE_TYPES: 'freight_package_types',      // Ajout de PACKAGE_TYPES
    PRICING: 'freight_pricing',                  // Ajout de PRICING
    BILLING: 'freight_billing',                  // Ajout de BILLING
    QUOTES: 'freight_quotes',                    // Ajout de QUOTES
    CUSTOMERS: 'freight_customers',              // Ajout de CUSTOMERS
    VEHICLES: 'freight_vehicles',                // Ajout de VEHICLES
    DRIVERS: 'freight_drivers'                   // Ajout de DRIVERS
  },
  
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    CATEGORIES: 'library_categories',
    PUBLISHERS: 'library_publishers',
    STATS: 'library_stats'                       // Ajout de STATS
  },
  
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules',
    RESERVATIONS: 'transport_reservations',      // Ajout de RESERVATIONS
    CLIENTS: 'transport_clients'                 // Ajout de CLIENTS
  }
};

// Constantes pour les sous-collections
export const SUB_COLLECTIONS = {
  DOCUMENTS: 'documents',
  COMMENTS: 'comments',
  ACTIVITIES: 'activities',
  ATTACHMENTS: 'attachments'
};
