
/**
 * Constants for Firestore collection names
 * Centralizes collection names to avoid typos and facilitate refactoring
 */
export const COLLECTIONS = {
  // Main collections
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  CONTACTS: 'contacts', // General contacts collection
  
  // Module CRM
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    REMINDERS: 'crm_reminders',
    SETTINGS: 'crm_settings',
    CONTACTS: 'crm_contacts', // CRM contacts
    LEADS: 'crm_leads',       // Adding leads
    DEALS: 'crm_deals'        // Adding deals
  },
  
  // Module Accounting
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers',
    REPORTS: 'accounting_reports',
    TAXES: 'accounting_taxes',
    SETTINGS: 'accounting_settings',
    TRANSACTIONS: 'accounting_transactions',
    PERMISSIONS: 'accounting_permissions',
  },
  
  // Module HR / Employees
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    LEAVES: 'hr_leaves',
    CONTRACTS: 'hr_contracts',
    EVALUATIONS: 'hr_evaluations',
    SALARIES: 'hr_salaries',
    TIMESHEETS: 'hr_timesheets',
    RECRUITMENTS: 'hr_recruitments',
    BADGES: 'hr_badges',
    DOCUMENTS: 'hr_documents',
    PAYSLIPS: 'hr_payslips',               // Adding payslips
    LEAVE_REQUESTS: 'hr_leave_requests',   // Adding leave requests
    ATTENDANCE: 'hr_attendance',           // Adding attendance
    ABSENCE_REQUESTS: 'hr_absence_requests', // Adding absence requests
    TRAININGS: 'hr_trainings',             // Adding trainings
    REPORTS: 'hr_reports',                 // Adding reports
    ALERTS: 'hr_alerts'                    // Adding alerts
  },
  
  // Module Projects
  PROJECTS: {
    PROJECTS: 'projects_projects',
    TASKS: 'projects_tasks',
    TEAMS: 'projects_teams',
    NOTIFICATIONS: 'projects_notifications',
  },
  
  // Module Health
  HEALTH: {
    PATIENTS: 'health_patients',
    DOCTORS: 'health_doctors',
    APPOINTMENTS: 'health_appointments',
    CONSULTATIONS: 'health_consultations',
    INSURANCE: 'health_insurance',
    BILLING: 'health_billing',
    SETTINGS: 'health_settings',
    INTEGRATIONS: 'health_integrations',
    STAFF: 'health_staff',
  },
  
  // Module Freight
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    PACKAGES: 'freight_packages',
    CUSTOMERS: 'freight_customers',
    CARRIERS: 'freight_carriers',
    CONTAINERS: 'freight_containers',
    DOCUMENTS: 'freight_documents',
    ROUTES: 'freight_routes',
    VEHICLES: 'freight_vehicles',
    DRIVERS: 'freight_drivers',
    WAREHOUSES: 'freight_warehouses',
    TRACKING: 'freight_tracking',
    TRACKING_EVENTS: 'freight_tracking_events', // Adding tracking events
    PACKAGE_TYPES: 'freight_package_types',     // Adding package types
    PRICING: 'freight_pricing',                 // Adding pricing
    BILLING: 'freight_billing',                 // Adding billing
    QUOTES: 'freight_quotes'                    // Adding quotes
  },
  
  // Module Library
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RETURNS: 'library_returns',
    CATEGORIES: 'library_categories',
    PUBLISHERS: 'library_publishers',
    AUTHORS: 'library_authors',
    STATS: 'library_stats',
  },
  
  // Module Transport
  TRANSPORT: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules',
    RESERVATIONS: 'transport_reservations',    // Adding reservations 
    CLIENTS: 'transport_clients'               // Adding clients
  },
  
  // Module Messages
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVED: 'messages_archived',
    SCHEDULED: 'messages_scheduled',
    CONTACTS: 'messages_contacts',
    TEMPLATES: 'messages_templates',
    METRICS: 'messages_metrics',
  },
  
  // Module Documents
  DOCUMENTS: 'documents',
  
  // Permissions
  USER_PERMISSIONS: 'userPermissions'
};

// For backward compatibility with old code using flat references
export const FLAT_COLLECTIONS = {
  CRM_CLIENTS: COLLECTIONS.CRM.CLIENTS,
  CRM_PROSPECTS: COLLECTIONS.CRM.PROSPECTS,
  CRM_OPPORTUNITIES: COLLECTIONS.CRM.OPPORTUNITIES,
  CRM_REMINDERS: COLLECTIONS.CRM.REMINDERS,
  CRM_SETTINGS: COLLECTIONS.CRM.SETTINGS,
  CRM_CONTACTS: COLLECTIONS.CRM.CONTACTS,
  CRM_LEADS: COLLECTIONS.CRM.LEADS,
  CRM_DEALS: COLLECTIONS.CRM.DEALS,
  
  INVOICES: COLLECTIONS.ACCOUNTING.INVOICES,
  PAYMENTS: COLLECTIONS.ACCOUNTING.PAYMENTS,
  EXPENSES: COLLECTIONS.ACCOUNTING.EXPENSES,
  ACCOUNTING_CLIENTS: COLLECTIONS.ACCOUNTING.CLIENTS,
  ACCOUNTING_SUPPLIERS: COLLECTIONS.ACCOUNTING.SUPPLIERS,
  
  EMPLOYEES: COLLECTIONS.HR.EMPLOYEES,
  DEPARTMENTS: COLLECTIONS.HR.DEPARTMENTS,
  LEAVES: COLLECTIONS.HR.LEAVES,
  CONTRACTS: COLLECTIONS.HR.CONTRACTS,
  EVALUATIONS: COLLECTIONS.HR.EVALUATIONS,
  PAYSLIPS: COLLECTIONS.HR.PAYSLIPS,
  LEAVE_REQUESTS: COLLECTIONS.HR.LEAVE_REQUESTS,
  ATTENDANCE: COLLECTIONS.HR.ATTENDANCE,
  ABSENCE_REQUESTS: COLLECTIONS.HR.ABSENCE_REQUESTS,
  HR_DOCUMENTS: COLLECTIONS.HR.DOCUMENTS,
  TRAININGS: COLLECTIONS.HR.TRAININGS,
  HR_REPORTS: COLLECTIONS.HR.REPORTS,
  HR_ALERTS: COLLECTIONS.HR.ALERTS,
  
  FREIGHT_SHIPMENTS: COLLECTIONS.FREIGHT.SHIPMENTS,
  FREIGHT_PACKAGES: COLLECTIONS.FREIGHT.PACKAGES,
  FREIGHT_TRACKING_EVENTS: COLLECTIONS.FREIGHT.TRACKING_EVENTS,
  FREIGHT_PACKAGE_TYPES: COLLECTIONS.FREIGHT.PACKAGE_TYPES,
  FREIGHT_PRICING: COLLECTIONS.FREIGHT.PRICING,
  FREIGHT_BILLING: COLLECTIONS.FREIGHT.BILLING,
  FREIGHT_QUOTES: COLLECTIONS.FREIGHT.QUOTES,
  
  TRANSPORT_RESERVATIONS: COLLECTIONS.TRANSPORT.RESERVATIONS,
  TRANSPORT_CLIENTS: COLLECTIONS.TRANSPORT.CLIENTS,
  
  // ... add more flat references as needed for backward compatibility
};
