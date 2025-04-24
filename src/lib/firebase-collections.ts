
export const COLLECTIONS = {
  HR: {
    EMPLOYEES: 'hr_employees',
    TRAININGS: 'hr_trainings',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    PAYSLIPS: 'hr_payslips',
    CONTRACTS: 'hr_contracts',
    DEPARTMENTS: 'hr_departments',
    LEAVE_REQUESTS: 'hr_leave_requests',
    ATTENDANCE: 'hr_attendance',
    DOCUMENTS: 'hr_documents',
    TIMESHEET: 'hr_timesheet',
    EVALUATIONS: 'hr_evaluations',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts',
    RECRUITMENT: 'hr_recruitment'
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
    TAXES: 'accounting_taxes',
    SETTINGS: 'accounting_settings'
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    CONTAINERS: 'freight_containers',
    DOCUMENTS: 'freight_documents',
    BILLING: 'freight_billing',
    CLIENTS: 'freight_clients',
    PACKAGES: 'freight_packages',
    TRACKING_EVENTS: 'freight_tracking_events'
  },
  TRANSPORT: {
    DRIVERS: 'transport_drivers',
    VEHICLES: 'transport_vehicles',
    RESERVATIONS: 'transport_reservations',
    CLIENTS: 'transport_clients'
  },
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    STATS: 'library_stats'
  },
  SALON: {
    INVOICES: 'salon_invoices',
    PAYMENTS: 'salon_payments',
    CLIENTS: 'salon_clients',
    APPOINTMENTS: 'salon_appointments',
    SERVICES: 'salon_services',
    PRODUCTS: 'salon_products',
    STAFF: 'salon_staff'
  }
} as const;
