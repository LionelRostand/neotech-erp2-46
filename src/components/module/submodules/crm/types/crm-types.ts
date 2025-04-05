
export type OpportunityStage = 
  'lead' | 
  'qualified' | 
  'needs-analysis' | 
  'proposal' | 
  'negotiation' | 
  'closed-won' | 
  'closed-lost' |
  'new' |
  'quote_sent' |
  'pending' |
  'won' |
  'lost';

export interface Opportunity {
  id: string;
  name: string;
  title?: string; // Adding title for backward compatibility
  clientId?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  value: number;
  amount?: number; // Adding amount for backward compatibility
  currency?: string;
  probability?: number;
  stage: OpportunityStage;
  startDate: string;
  closeDate?: string;
  expectedCloseDate?: string; // Adding expectedCloseDate for backward compatibility
  description?: string;
  source?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  products?: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }> | string[];
  notes?: string;
  status?: 'active' | 'closed' | 'lost';
}

export interface Prospect {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  // Adding name, email, phone for backward compatibility
  name?: string;
  email?: string;
  phone?: string;
  source: string;
  industry?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'hot' | 'warm' | 'cold';
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

export interface ProspectFormData {
  company: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  // Adding name, email, phone for backward compatibility
  name?: string;
  email?: string;
  phone?: string;
  source: string;
  industry?: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'hot' | 'warm' | 'cold';
  notes?: string;
  website?: string;
  address?: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  estimatedValue?: number;
  lastContact?: string;
}

export interface ReminderData {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes?: string;
  prospectId: string;
  // Adding type, note for backward compatibility
  type?: string;
  note?: string;
}

export interface OpportunityFormData {
  name: string;
  title?: string; // Adding title for backward compatibility
  clientId?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  value: number;
  amount?: number; // Adding amount for backward compatibility
  currency?: string;
  probability?: number;
  stage: OpportunityStage;
  startDate: string;
  closeDate?: string;
  expectedCloseDate?: string; // Adding for backward compatibility
  description?: string;
  source?: string;
  assignedTo?: string;
  products?: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }> | string[];
  notes?: string;
}
