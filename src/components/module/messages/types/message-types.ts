import { Timestamp } from "firebase/firestore";

export type MessageStatus = 'unread' | 'read' | 'archived' | 'scheduled';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';
export type MessageCategory = 'general' | 'commercial' | 'support' | 'technical' | 'administrative' | 'other';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string; // ID du contact expéditeur
  recipients: string[]; // IDs des contacts destinataires
  status: MessageStatus;
  priority: MessagePriority;
  category?: MessageCategory;
  tags?: string[];
  hasAttachments: boolean;
  attachments?: Attachment[];
  isFavorite?: boolean;
  isArchived?: boolean;
  isScheduled?: boolean;
  scheduledAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readAt?: Timestamp;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: string;
  notes?: string;
  tags?: string[];
  isSynchronized?: boolean;
  syncSource?: 'odoo' | 'hubspot' | 'crm' | 'manual';
  syncId?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastContactedAt?: Timestamp;
  messagesCount?: number;
}

export interface MessageMetrics {
  id?: string;
  totalMessages: number;
  unreadMessages: number;
  archivedMessages: number;
  scheduledMessages: number;
  messagesSentToday: number;
  messagesReceivedToday: number;
  contactsCount: number;
  topContacts: {
    contactId: string;
    contactName: string;
    messagesCount: number;
  }[];
  dailyActivity: {
    date: string;
    sent: number;
    received: number;
  }[];
  updateTimestamp?: any;
}

export interface MessageFormData {
  subject: string;
  content: string;
  recipients: string[];
  priority: MessagePriority;
  category?: MessageCategory;
  tags?: string[];
  attachments?: File[];
  isScheduled?: boolean;
  scheduledAt?: Date;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: File;
  notes?: string;
  tags?: string[];
  syncSource?: 'odoo' | 'hubspot' | 'crm' | 'manual';
}
