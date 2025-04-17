
// Define Firestore collection paths here to ensure consistency
export const COLLECTIONS = {
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVE: 'messages_archive',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
  USERS: 'users',
  USER_PERMISSIONS: 'user_permissions',
  COMPANIES: 'companies',
  WAREHOUSES: 'warehouses',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  INVENTORY: 'inventory',
  EMPLOYEES: 'employees',
  SHIPMENTS: 'shipments',
  DRIVERS: 'drivers',
  VEHICLES: 'vehicles',
  CONTRACTS: 'contracts',
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates'
  },
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses',
    CLIENTS: 'accounting_clients',
    SUPPLIERS: 'accounting_suppliers',
    REPORTS: 'accounting_reports',
    TAXES: 'accounting_taxes',
    TRANSACTIONS: 'accounting_transactions',
    SETTINGS: 'accounting_settings',
    PERMISSIONS: 'accounting_permissions'
  },
  CRM: {
    CLIENTS: 'crm_clients',
    PROSPECTS: 'crm_prospects',
    OPPORTUNITIES: 'crm_opportunities',
    ACTIVITIES: 'crm_activities',
    CONTACTS: 'crm_contacts',
    DEALS: 'crm_deals',
    SETTINGS: 'crm_settings',
    TASKS: 'crm_tasks',
    CAMPAIGNS: 'crm_campaigns',
    LEADS: 'crm_leads'
  },
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    LEAVES: 'hr_leaves',
    ATTENDANCE: 'hr_attendance',
    DOCUMENTS: 'hr_documents',
    TRAININGS: 'hr_trainings',
    PAYSLIPS: 'hr_payslips',
    EVALUATIONS: 'hr_evaluations',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    BADGES: 'hr_badges',
    MANAGERS: 'hr_managers',
    SALARIES: 'hr_salaries',
    POSITIONS: 'hr_positions',
    PERMISSIONS: 'hr_permissions',
    SETTINGS: 'hr_settings',
    ALERTS: 'hr_alerts',
    REPORTS: 'hr_reports'
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CONTAINERS: 'freight_containers',
    CARRIERS: 'freight_carriers',
    ROUTES: 'freight_routes',
    TRACKING: 'freight_tracking',
    DOCUMENTS: 'freight_documents',
    PRICING: 'freight_pricing',
    CLIENTS: 'freight_clients',
    SETTINGS: 'freight_settings',
    USERS: 'freight_users'
  }
};
