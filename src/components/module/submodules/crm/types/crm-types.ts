
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
}

export interface ReminderData {
  date: string;
  title: string;
  description: string;
}
