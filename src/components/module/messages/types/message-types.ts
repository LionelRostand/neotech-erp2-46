
// Suppose que ce fichier existe déjà, mais nous ajoutons le type 'draft' au MessageStatus

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MessagePriority = 'high' | 'normal' | 'low';
export type MessageCategory = 'business' | 'personal' | 'marketing' | 'support' | 'other';
export type MessageStatus = 'draft' | 'sent' | 'received' | 'read' | 'scheduled' | 'archived';
export type EmailStatus = 'pending' | 'sent' | 'failed';

export interface MessageFormData {
  subject: string;
  content: string;
  recipients: string[];
  priority: MessagePriority;
  category?: MessageCategory;
  tags: string[];
  attachments: File[];
  isScheduled: boolean;
  scheduledDate?: Date;
}

export interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  recipients: string[];
  status: MessageStatus;
  priority: MessagePriority;
  category?: MessageCategory;
  tags: string[];
  hasAttachments: boolean;
  isArchived: boolean;
  isRead?: boolean;
  isScheduled?: boolean;
  scheduledAt?: any; // Timestamp type from Firestore
  createdAt: any; // Timestamp type from Firestore
  updatedAt: any; // Timestamp type from Firestore
  emailStatus?: EmailStatus;
}

export interface MessageMetrics {
  totalMessages: number;
  unreadMessages: number;
  archivedMessages: number;
  scheduledMessages: number;
  sentMessagesCount: number;
  receivedMessagesCount: number;
  messagesByCategory: Record<string, number>;
  messagesByPriority: Record<string, number>;
  dailyActivity: Array<{date: string; count: number}>;
  topContacts: Array<{id: string; name: string; count: number}>;
  // Add the missing properties
  messagesSentToday: number;
  contactsCount: number;
}
