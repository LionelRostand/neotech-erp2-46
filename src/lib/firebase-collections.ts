
export const COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  SETTINGS: 'settings',
  USER_PERMISSIONS: 'user_permissions',
  DOCUMENTS: 'documents',
  CONTACTS: 'contacts',
  EMPLOYEES: 'employees', // Add direct employees collection
  MESSAGES: {
    INBOX: 'messages/inbox',
    SCHEDULED: 'messages/scheduled',
    ARCHIVED: 'messages/archived',
    METRICS: 'messages/metrics'
  },
  PROJECTS: {
    MAIN: 'projects',
    TASKS: 'projects/tasks',
    COMMENTS: 'projects/comments',
    TEAMS: 'project_teams', // Add this collection for projects team
    PROJECTS: 'projects_data', // This for project data specifically
    NOTIFICATIONS: 'project_notifications' // For project notifications
  },
  ORDERS: 'orders',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  CUSTOMERS: 'customers',
  // Add missing collections required by other modules
  BADGES: 'badges',
  ACCOUNTING: {
    INVOICES: 'accounting_invoices',
    PAYMENTS: 'accounting_payments',
    EXPENSES: 'accounting_expenses'
  },
  CRM: {
    LEADS: 'crm_leads',
    OPPORTUNITIES: 'crm_opportunities',
    CONTACTS: 'crm_contacts',
    DEALS: 'crm_deals'
  },
  FREIGHT: {
    SHIPMENTS: 'freight_shipments',
    VEHICLES: 'freight_vehicles',
    ROUTES: 'freight_routes',
    DRIVERS: 'freight_drivers',
    PACKAGES: 'freight_packages',
    TRACKING: 'freight_tracking'
  },
  HEALTH: {
    PATIENTS: 'health_patients',
    APPOINTMENTS: 'health_appointments',
    STAFF: 'health_staff',
    BILLING: 'health_billing',
    PRESCRIPTIONS: 'health_prescriptions',
    MEDICAL_RECORDS: 'health_records'
  },
  HEALTH_CONSULTATIONS: 'health_consultations',
  HEALTH_INSURANCE: 'health_insurance',
  HEALTH_BILLING: 'health_billing',
  TRANSPORT: {
    VEHICLES: 'transport_vehicles',
    DRIVERS: 'transport_drivers',
    ROUTES: 'transport_routes',
    SCHEDULES: 'transport_schedules'
  },
  LIBRARY: {
    BOOKS: 'library_books',
    MEMBERS: 'library_members',
    LOANS: 'library_loans',
    RESERVATIONS: 'library_reservations'
  },
  HR: {
    // Replace slash notation with underscores for all HR collections
    EMPLOYEES: 'hr_employees',
    CONTRACTS: 'hr_contracts',
    DEPARTMENTS: 'hr_departments',
    LEAVE_REQUESTS: 'hr_leave_requests',
    PAYSLIPS: 'hr_payslips',
    ATTENDANCE: 'hr_attendance',
    ABSENCE_REQUESTS: 'hr_absence_requests',
    DOCUMENTS: 'hr_documents',
    TIMESHEETS: 'hr_timesheets',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    REPORTS: 'hr_reports',
    ALERTS: 'hr_alerts'
  }
};
