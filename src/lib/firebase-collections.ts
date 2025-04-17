
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
  }
};
