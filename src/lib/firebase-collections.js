
// Define Firestore collection paths here to ensure consistency
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  CLIENTS: 'clients',
  USER_PERMISSIONS: 'user_permissions',
  HR: {
    EMPLOYEES: 'hr_employees',
    DEPARTMENTS: 'hr_departments',
    CONTRACTS: 'hr_contracts',
    LEAVES: 'hr_leaves',
    DOCUMENTS: 'hr_documents',
    ATTENDANCE: 'hr_attendance',
    ABSENCES: 'hr_absences',
    BADGES: 'hr_badges',
    PAYSLIPS: 'hr_payslips',
    EVALUATIONS: 'hr_evaluations',
    TRAININGS: 'hr_trainings',
    ALERTS: 'hr_alerts',
    REPORTS: 'hr_reports',
    SETTINGS: 'hr_settings',
    MANAGERS: 'hr_managers'
  },
  MESSAGES: {
    INBOX: 'messages_inbox',
    ARCHIVE: 'messages_archive',
    SCHEDULED: 'messages_scheduled',
    METRICS: 'messages_metrics'
  },
  CONTACTS: 'contacts',
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
  },
  DOCUMENT_COLLECTIONS: {
    DOCUMENTS: 'documents',
    SETTINGS: 'document_settings',
    TEMPLATES: 'document_templates'
  }
};
