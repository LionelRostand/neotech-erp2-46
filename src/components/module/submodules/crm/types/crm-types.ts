
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
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
  notes?: string;
  lastContact?: string;
  nextContact?: string;
  createdAt: string;
  convertedToClientId?: string;
  convertedAt?: string;
}

export interface ProspectFormData {
  name?: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  email?: string;
  phone?: string;
  status: string;
  source: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
  notes?: string;
  lastContact?: string;
}

export interface ReminderData {
  title: string;
  date: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: 'active' | 'inactive' | 'lead';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  description?: string;
  notes?: string;
  createdAt: string;
  customerSince?: string;
}

export interface ClientFormData {
  name: string;
  sector: string;
  revenue: string;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  description?: string;
  notes?: string;
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
  stage: 'lead' | 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  value: number;
  probability: number;
  expectedCloseDate: string;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
  closedAt?: string;
  closedReason?: string;
  products?: string[];
  tags?: string[];
  source?: string;
  lastContact?: string;
  nextContact?: string;
  currency?: string;
}

export interface OpportunityFormData {
  name: string;
  clientId?: string;
  clientName: string;
  prospectId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  stage: string;
  value: number | string;
  probability: number | string;
  expectedCloseDate: string;
  notes?: string;
  assignedTo?: string;
  products?: string[];
  tags?: string[];
  source?: string;
  currency?: string;
}
