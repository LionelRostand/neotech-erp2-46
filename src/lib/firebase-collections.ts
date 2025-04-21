
// Firebase collections paths for the application

export const COLLECTIONS = {
  EMPLOYEES: "employees",
  DEPARTMENTS: "departments",
  COMPANIES: "companies",
  PAYSLIPS: "payslips",
  CONTRACTS: "contracts",
  BADGES: "badges",
  LEAVES: "leaves",
  ALERTS: "alerts",
  NOTIFICATIONS: "notifications",
  DOCUMENTS: "documents",
  USERS: "users",
  TIME_SHEETS: "timeSheets",
  EVALUATIONS: "evaluations",
  TRAININGS: "trainings",
  ATTENDANCE: "attendance",
  SETTINGS: "settings",
  
  // Module-specific collections
  FREIGHT: {
    SHIPMENTS: "freight_shipments",
    ROUTES: "freight_routes",
    CARRIERS: "freight_carriers",
    CONTAINERS: "freight_containers",
    PACKAGES: "freight_packages",
    TRACKINGS: "freight_trackings",
    CLIENTS: "freight_clients",
    DOCUMENTS: "freight_documents",
    SETTINGS: "freight_settings",
    INVOICES: "freight_invoices",
    QUOTES: "freight_quotes"
  },
  
  MESSAGES: {
    MESSAGES: "messages",
    CONTACTS: "contacts",
    TEMPLATES: "message_templates",
    SCHEDULED: "scheduled_messages",
    SETTINGS: "message_settings"
  },
  
  GARAGE: {
    VEHICLES: "garage_vehicles",
    CLIENTS: "garage_clients",
    APPOINTMENTS: "garage_appointments",
    SERVICES: "garage_services",
    PARTS: "garage_parts",
    INVOICES: "garage_invoices"
  },
  
  ACCOUNTING: {
    INVOICES: "accounting_invoices",
    CLIENTS: "accounting_clients",
    PAYMENTS: "accounting_payments",
    EXPENSES: "accounting_expenses",
    TAX_RATES: "accounting_tax_rates",
    TAX_DECLARATIONS: "accounting_tax_declarations"
  },
  
  CRM: {
    CLIENTS: "crm_clients",
    PROSPECTS: "crm_prospects",
    OPPORTUNITIES: "crm_opportunities",
    ACTIVITIES: "crm_activities",
    SETTINGS: "crm_settings"
  },
  
  HR: {
    EMPLOYEES: "hr_employees",
    PAYSLIPS: "hr_payslips",
    CONTRACTS: "hr_contracts",
    DEPARTMENTS: "hr_departments",
    LEAVES: "hr_leaves",
    ATTENDANCE: "hr_attendance"
  },
  
  PROJECTS: {
    PROJECTS: "projects",
    TASKS: "tasks",
    MILESTONES: "project_milestones",
    COMMENTS: "project_comments",
    TIMETRACKING: "project_timetracking"
  },
  
  TRANSPORT: {
    SERVICES: "transport_services",
    BOOKINGS: "transport_bookings",
    VEHICLES: "transport_vehicles",
    DRIVERS: "transport_drivers",
    ROUTES: "transport_routes"
  }
};
