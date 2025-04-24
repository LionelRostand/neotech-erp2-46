
export const COLLECTIONS = {
  HR: {
    EMPLOYEES: 'hr_employees',
    TRAININGS: 'hr_trainings',
    ABSENCE_REQUESTS: 'hr_absence_requests',
  },
  GARAGE: {
    MECHANICS: 'garage_mechanics',
    REPAIRS: 'garage_repairs',
    VEHICLES: 'garage_vehicles',
    SERVICES: 'garage_services',
    INVOICES: 'garage_invoices',
    CLIENTS: 'garage_clients',
    APPOINTMENTS: 'garage_appointments',
    INVENTORY: 'garage_inventory',
    LOYALTY: 'garage_loyalty',
    SETTINGS: 'garage_settings',
    SUPPLIERS: 'garage_suppliers',
  },
  MESSAGES: {
    CONTACTS: 'message_contacts',
    INBOX: 'message_inbox',
    SENT: 'message_sent',
    ARCHIVED: 'message_archived',
    SCHEDULED: 'message_scheduled',
    DRAFTS: 'message_drafts',
    MESSAGES: 'messages',
  },
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    CATEGORIES: 'document_categories',
    PERMISSIONS: 'document_permissions',
    SETTINGS: 'document_settings',
  },
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    TRANSACTIONS: 'accounting_transactions',
    TAX_RATES: 'accounting_tax_rates',
    TAX_DECLARATIONS: 'accounting_tax_declarations',
    SETTINGS: 'accounting_settings'
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CONTAINERS: 'freight_containers',
    DOCUMENTS: 'freight_documents',
    BILLING: 'freight_billing'
  }
} as const;
