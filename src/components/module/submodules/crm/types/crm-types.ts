
// Define types for the CRM module

// Common interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

// Prospect related types
export interface Prospect extends BaseEntity {
  company: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'new' | 'contacted' | 'meeting' | 'proposal' | 'negotiation' | 'converted' | 'lost';
  source?: string;
  notes?: string;
  lastContact?: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
  email?: string;
  phone?: string;
  name: string;
}

export interface ProspectFormData {
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: string;
  source?: string;
  notes?: string;
  lastContact?: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
  email?: string;
  phone?: string;
  name: string;
}

// Client related types
export interface Client extends BaseEntity {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'inactive';
  sector?: string;
  revenue?: string;
  website?: string;
  address?: string;
  notes?: string;
  customerSince?: string; // Made optional to fix type error
}

export interface ClientFormData {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'inactive';
  sector?: string;
  revenue?: string;
  website?: string;
  address?: string;
  notes?: string;
  customerSince?: string;
}

// Opportunity related types
export enum OpportunityStage {
  LEAD = 'lead',
  DISCOVERY = 'discovery',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export interface Opportunity extends BaseEntity {
  title: string;
  description?: string;
  stage: OpportunityStage;
  clientId?: string;
  probability?: number;
  amount?: number;
  expectedCloseDate?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  assignedTo?: string;
  value?: number;
  notes?: string;
  products?: OpportunityProduct[];
}

export interface OpportunityProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OpportunityFormData {
  title: string;
  description?: string;
  stage: OpportunityStage;
  clientId?: string;
  probability?: number;
  amount?: number;
  expectedCloseDate?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  assignedTo?: string;
  value?: number;
  notes?: string;
  startDate?: string;
  closeDate?: string;
  products?: OpportunityProduct[];
}

// Reminder related types
export interface ReminderData {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
  prospectId: string;
}

export interface RelatedEntity {
  type: 'prospect' | 'client' | 'opportunity';
  id: string;
  name: string;
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
