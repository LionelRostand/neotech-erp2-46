
// CRM types file
export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: 'active' | 'inactive' | 'paused';
  customerSince: string;
  createdAt: string;
  updatedAt?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  notes?: string;
  website?: string;
  assignedTo?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  source: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
}

export interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'meeting' | 'proposal' | 'negotiation' | 'converted' | 'lost';
  source: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
  lastContact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProspectFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  industry?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
  lastContact?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  amount: number;
  stage: 'lead' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  probability: number;
  expectedCloseDate: string;
  description?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityFormData {
  title: string;
  company: string;
  amount: number;
  stage: 'lead' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  probability: number;
  expectedCloseDate: string;
  description?: string;
  assignedTo?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  type: 'call' | 'meeting' | 'email' | 'task' | 'other';
  status: 'pending' | 'completed' | 'cancelled';
  relatedTo?: {
    type: 'prospect' | 'opportunity' | 'client' | 'lead';
    id: string;
    name: string;
  };
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Deal {
  id: string;
  name: string;
  client: string | { id: string; name: string };
  amount: number;
  stage: 'initial' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  closeDate: string;
  probability: number;
  description?: string;
  products?: Array<{ id: string; name: string; quantity: number; price: number }>;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}
