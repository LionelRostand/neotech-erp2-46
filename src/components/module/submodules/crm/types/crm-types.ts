
// CRM Prospect types
export interface Prospect {
  id: string;
  name: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  lastContact: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
  potentialValue?: number;
  website?: string;
  industry?: string;
  address?: string;
  size?: string;
  estimatedValue?: number;
}

export interface ProspectFormData {
  name: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  lastContact: string;
  notes: string;
  potentialValue?: number;
  website?: string;
  industry?: string;
  address?: string;
  size?: string;
  estimatedValue?: number;
}

export interface ReminderData {
  date: string;
  title: string;
  description: string;
  notes?: string;
}

// CRM Client types
export interface Client {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  industry?: string;
  size?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalSpent?: number;
  assignedTo?: string;
}

export interface ClientFormData {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  industry?: string;
  size?: string;
  notes?: string;
  status: string;
  assignedTo?: string;
}

// CRM Opportunity types
export enum OpportunityStage {
  LEAD = 'lead',
  DISCOVERY = 'discovery',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSING = 'closing',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export interface Opportunity {
  id: string;
  name: string;
  title?: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  stage: OpportunityStage;
  value: number;
  probability?: number;
  expectedCloseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  products?: string[];
  source?: string;
  notes?: string;
  assignedTo?: string;
  ownerName?: string;
  nextContact?: string;
}

export interface OpportunityFormData {
  name: string;
  title?: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  stage: OpportunityStage;
  value: number;
  probability?: number;
  expectedCloseDate?: string;
  products?: string[];
  source?: string;
  notes?: string;
  assignedTo?: string;
}
