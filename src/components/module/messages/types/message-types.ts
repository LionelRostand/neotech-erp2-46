
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
  
  // Additional fields for extended functionality
  content?: string;
  createdAt?: any;
  category?: string;
  tags?: string[];
  hasAttachments?: boolean;
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
  
  // Additional fields for extended functionality
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export type MessageCategory = 'business' | 'personal' | 'important' | 'promotional' | 'other';
export type MessagePriority = 'high' | 'normal' | 'low' | 'urgent';
export type MessageStatus = 'draft' | 'sent' | 'scheduled' | 'archived' | 'deleted';

export interface MessageFormData {
  subject: string;
  body: string;
  recipients: string[];
  attachments?: File[];
  priority?: MessagePriority;
  category?: MessageCategory;
  scheduledDate?: Date | null;
  labels?: string[];
  tags?: string[];
}

export interface MessageMetrics {
  totalReceived: number;
  totalSent: number;
  unread: number;
  archived: number;
  scheduled: number;
  responseRate: number;
  averageResponseTime: number;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  email: string;
  username: string;
  password: string;
}
