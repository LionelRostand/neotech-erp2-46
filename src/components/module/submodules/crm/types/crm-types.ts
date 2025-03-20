
import { Timestamp } from 'firebase/firestore';

export interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'hot' | 'warm' | 'cold';
  source: string;
  createdAt: string;
  lastContact: string;
  notes: string;
}

export interface ProspectFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'hot' | 'warm' | 'cold';
  source: string;
  lastContact: string;
  notes: string;
}

export interface ReminderData {
  type: string;
  date: string;
  note: string;
}

export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  createdAt: string;
  convertedAt?: string;
}

// Nouvelles interfaces pour les opportunités
export type OpportunityStage = 
  | 'new'
  | 'negotiation'
  | 'quote_sent'
  | 'pending'
  | 'won'
  | 'lost';

export interface Opportunity {
  id: string;
  title: string;
  clientId?: string;
  clientName: string;
  prospectId?: string;
  amount: number;
  probability: number;
  stage: OpportunityStage;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  expectedCloseDate: string;
  notes?: string;
  products?: OpportunityProduct[];
}

export interface OpportunityProduct {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OpportunityFormData {
  title: string;
  clientId?: string;
  clientName: string;
  prospectId?: string;
  amount: number;
  probability: number;
  stage: OpportunityStage;
  assignedTo?: string;
  expectedCloseDate: string;
  notes?: string;
  products?: OpportunityProduct[];
}

export interface ActivityLog {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  relatedTo: {
    type: 'client' | 'prospect' | 'opportunity';
    id: string;
    name: string;
  };
  createdBy: string;
  createdAt: string;
  scheduledAt?: string;
  completed?: boolean;
  completedAt?: string;
}
