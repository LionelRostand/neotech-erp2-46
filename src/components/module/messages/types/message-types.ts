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
  createdAt: any; // Timestamp type from Firestore
  updatedAt: any; // Timestamp type from Firestore
}

export type MessagePriority = 'high' | 'normal' | 'low' | 'urgent';
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
  isFavorite?: boolean;
  scheduledAt?: any; // Timestamp type from Firestore
  createdAt: any; // Timestamp type from Firestore
  updatedAt: any; // Timestamp type from Firestore
  emailStatus?: EmailStatus;
  type?: 'sent' | 'received' | 'draft'; // Adding the type property for filtering
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
  messagesSentToday: number;
  contactsCount: number;
}

// Message template interface
export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category?: MessageCategory;
  tags: string[];
  createdAt: any; // Timestamp type from Firestore
  updatedAt: any; // Timestamp type from Firestore
  createdBy: string;
  isDefault: boolean;
}

// Message attachment interface
export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  createdAt: any; // Timestamp type from Firestore
}

// Message group interface
export interface MessageGroup {
  id: string;
  name: string;
  description?: string;
  members: string[]; // Array of contact IDs
  createdAt: any; // Timestamp type from Firestore
  updatedAt: any; // Timestamp type from Firestore
  createdBy: string;
}

// Message tag interface
export interface MessageTag {
  id: string;
  name: string;
  color: string;
  createdAt: any; // Timestamp type from Firestore
  updatedAt: any; // Timestamp type from Firestore
}

// Message category interface
export interface MessageCategoryType {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: any; // Timestamp type from Firestore
  updatedAt: any; // Timestamp type from Firestore
}

// Message settings interface
export interface MessageSettings {
  id: string;
  autoReply: boolean;
  autoReplyMessage?: string;
  signature?: string;
  defaultPriority: MessagePriority;
  defaultCategory?: MessageCategory;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  updatedAt: any; // Timestamp type from Firestore
}
