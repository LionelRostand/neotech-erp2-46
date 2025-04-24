
export interface Message {
  id: string;
  subject: string;
  body: string;
  sender?: string;
  senderName?: string;
  recipient?: string;
  recipientName?: string;
  timestamp: any; // Can be a Firebase timestamp or Date
  read: boolean;
  type: 'sent' | 'received' | 'draft' | 'archived' | 'scheduled';
  attachments?: string[];
  labels?: string[];
  priority?: 'high' | 'normal' | 'low';
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  labels?: string[];
  lastContact?: any; // Can be a Firebase timestamp or Date
  avatar?: string;
}
