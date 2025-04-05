
// Define types for the CRM module

// Prospect type definition
export interface Prospect {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  name?: string;
  email?: string;
  phone?: string;
  status: "new" | "contacted" | "converted" | "meeting" | "proposal" | "negotiation" | "lost";
  source: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: "small" | "medium" | "large" | "enterprise";
  estimatedValue?: number;
  lastContact?: string;
  convertedToClientId?: string;
  convertedAt?: string;
}

// Form data for creating/editing a prospect
export interface ProspectFormData {
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  source: string;
  notes?: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: "small" | "medium" | "large" | "enterprise";
  estimatedValue?: number;
  lastContact?: string;
}

// Client type definition
export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: "active" | "inactive";
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  customerSince: string;
  convertedFromProspectId?: string;
}

// Form data for creating/editing a client
export interface ClientFormData {
  name: string;
  sector: string;
  revenue: string;
  status: "active" | "inactive";
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  notes?: string;
  customerSince: string;
}

// Opportunity type definition
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  status: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  stage: string;
  clientId?: string;
  prospectId?: string;
  amount: number;
  probability: number;
  createdAt: string;
  updatedAt?: string;
  expectedCloseDate?: string;
}

// Form data for creating/editing an opportunity
export interface OpportunityFormData {
  title: string;
  description: string;
  status: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  stage: string;
  clientId?: string;
  prospectId?: string;
  amount: number;
  probability: number;
  expectedCloseDate?: string;
}

// Reminder type
export interface Reminder {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
  prospectId?: string;
  clientId?: string;
  opportunityId?: string;
  createdAt: string;
  createdBy?: string;
}

// Reminder data for creating/editing a reminder
export interface ReminderData {
  id?: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
  prospectId?: string;
  clientId?: string;
  opportunityId?: string;
}

// Permission type
export interface CrmPermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

// User with CRM permissions
export interface UserWithCrmPermissions {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: {
    crm?: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      clients?: CrmPermission;
      prospects?: CrmPermission;
      opportunities?: CrmPermission;
    }
  }
}
