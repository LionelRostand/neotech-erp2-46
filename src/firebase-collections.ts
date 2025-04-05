
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  COMPANIES: 'companies',
  DEPARTMENTS: 'departments',
  EMPLOYEES: 'employees',
  DOCUMENTS: 'documents',
  SETTINGS: 'settings',
  CONTACTS: 'contacts',
  
  CRM: {
    CLIENTS: 'crm/clients',
    PROSPECTS: 'crm/prospects',
    REMINDERS: 'crm/reminders',
    OPPORTUNITIES: 'crm/opportunities',
    LEADS: 'crm/leads',
    CONTACTS: 'crm/contacts',
    DEALS: 'crm/deals',
    SETTINGS: 'crm/settings',
  },
  
  ACCOUNTING: {
    INVOICES: 'accounting/invoices',
    PAYMENTS: 'accounting/payments',
    EXPENSES: 'accounting/expenses',
    CLIENTS: 'accounting/clients',
    SUPPLIERS: 'accounting/suppliers',
    REPORTS: 'accounting/reports',
    TAXES: 'accounting/taxes',
    SETTINGS: 'accounting/settings',
    TRANSACTIONS: 'accounting/transactions',
    PERMISSIONS: 'accounting/permissions',
  },
  
  HR: {
    EMPLOYEES: 'hr-employees',  // Changed from 'hr/employees' to avoid path segment issue
    LEAVES: 'hr-leaves',        // Changed from 'hr/leaves'
    CONTRACTS: 'hr-contracts',  // Changed from 'hr/contracts'
    POSITIONS: 'hr-positions',  // Changed from 'hr/positions'
    DEPARTMENTS: 'hr-departments', // Changed from 'hr/departments'
    EVALUATIONS: 'hr-evaluations', // Changed from 'hr/evaluations'
    PAYSLIPS: 'hr-payslips',    // Changed from 'hr/payslips'
    RECRUITMENT: 'hr-recruitment', // Changed from 'hr/recruitment'
    TRAININGS: 'hr-trainings',  // Changed from 'hr/trainings'
    BADGES: 'hr-badges',        // Changed from 'hr/badges'
    ATTENDANCE: 'hr-attendance', // Changed from 'hr/attendance'
    ABSENCE_REQUESTS: 'hr-absence_requests', // Changed from 'hr/absence_requests'
    DOCUMENTS: 'hr-documents',  // Changed from 'hr/documents'
    TIMESHEETS: 'hr-timesheets', // Changed from 'hr/timesheets'
    REPORTS: 'hr-reports',      // Changed from 'hr/reports'
    ALERTS: 'hr-alerts',        // Changed from 'hr/alerts'
    LEAVE_REQUESTS: 'hr-leave_requests', // Changed from 'hr/leave_requests'
    ABSENCES: 'hr-absences',    // Changed from 'hr/absences'
    SALARIES: 'hr-salaries',    // Changed from 'hr/salaries'
  },
  
  HEALTH: {
    PATIENTS: 'health-patients',  // Changed from 'health/patients'
    DOCTORS: 'health-doctors',    // Changed from 'health/doctors'
    APPOINTMENTS: 'health-appointments', // Changed from 'health/appointments'
    CONSULTATIONS: 'health-consultations', // Changed from 'health/consultations'
    MEDICAL_RECORDS: 'health-medical_records', // Changed from 'health/medical_records'
    PRESCRIPTIONS: 'health-prescriptions', // Changed from 'health/prescriptions'
    INSURANCE: 'health-insurance', // Changed from 'health/insurance'
    BILLING: 'health-billing',    // Changed from 'health/billing'
    SETTINGS: 'health-settings',  // Changed from 'health/settings'
    HEALTH_CONSULTATIONS: 'health-consultations', // Changed
    HEALTH_INSURANCE: 'health-insurance', // Changed
    HEALTH_BILLING: 'health-billing', // Changed
    STAFF: 'health-staff', // Changed from 'health/staff'
  },
  
  USER_PERMISSIONS: 'userPermissions',
};
