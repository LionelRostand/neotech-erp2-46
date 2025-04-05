
export type OpportunityStage = 
  'lead' | 
  'qualified' | 
  'needs-analysis' | 
  'proposal' | 
  'negotiation' | 
  'closed-won' | 
  'closed-lost';

export interface Opportunity {
  id: string;
  name: string;
  clientId?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  value: number;
  currency?: string;
  probability?: number;
  stage: OpportunityStage;
  startDate: string;
  closeDate?: string;
  description?: string;
  source?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  products?: string[];
  notes?: string;
  status?: 'active' | 'closed' | 'lost';
}

export interface Prospect {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  source: string;
  industry?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  lastContact?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
}

export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: 'active' | 'inactive' | 'paused';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  logo?: string;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedBy?: string;
  customerSince?: string;
}

// Add missing types to fix the build errors
export interface ProspectFormData {
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  source: string;
  industry?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  notes?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
}

export interface ReminderData {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
  prospectId: string;
}

export interface OpportunityFormData {
  name: string;
  clientId?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  value: number;
  currency?: string;
  probability?: number;
  stage: OpportunityStage;
  startDate: string;
  closeDate?: string;
  description?: string;
  source?: string;
  assignedTo?: string;
  products?: string[];
  notes?: string;
}
