
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
