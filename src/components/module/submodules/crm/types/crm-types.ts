export enum OpportunityStage {
  LEAD = 'lead',
  DISCOVERY = 'discovery',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSING = 'closing',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export interface Client {
  id: string;
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  sector: string;
  revenue: string;
  status: 'active' | 'inactive' | 'lead';
  address?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  customerSince?: string;
  _offlineUpdated?: boolean; // Propriété pour le suivi des mises à jour hors ligne
  _offlineDeleted?: boolean; // Propriété pour le suivi des suppressions hors ligne
}

export interface Prospect {
  id: string;
  name: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'meeting' | 'proposal' | 'negotiation' | 'converted' | 'lost';
  source: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: string;
  estimatedValue?: number;
  notes?: string;
  lastContact?: string;
  nextContact?: string;
  createdAt: string;
  updatedAt?: string;
  convertedAt?: string;
  convertedToClientId?: string;
}

export interface Opportunity {
  id: string;
  name: string;
  clientId?: string;
  clientName: string;
  prospectId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: string;
  createdAt: string;
  updatedAt?: string;
  description?: string;
  products?: string[];
  source?: string;
  notes?: string;
  assignedTo?: string;
  ownerName?: string;
  nextContact?: string;
  title?: string;
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
  industry?: string;
  website?: string;
  address?: string;
  size?: string;
  estimatedValue?: number | string;
  notes?: string;
  lastContact?: string;
}

export interface ClientFormData {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  sector: string;
  status: string;
  revenue: string;
  address?: string;
  website?: string;
  notes?: string;
}

export interface OpportunityFormData {
  name: string;
  clientId?: string;
  clientName: string;
  prospectId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  value: number | string;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: string;
  description?: string;
  products?: string[];
  source?: string;
  notes?: string;
  assignedTo?: string;
  ownerName?: string;
  nextContact?: string;
  title?: string;
}

export interface ReminderData {
  title: string;
  date: string;
  notes: string;
}
