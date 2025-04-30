
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
  createdAt: Date;
  updatedAt: Date;
  name?: string; // For backward compatibility
}

export interface Sender {
  id?: string;
  email: string;
  name: string;
}

export type MessagePriority = 'normal' | 'high' | 'low';
export type MessageStatus = 'read' | 'unread' | 'draft' | 'sent' | 'scheduled' | 'archived';

export interface Message {
  id: string;
  subject: string;
  content: string;
  sender: Sender;
  recipient?: Sender;
  recipients?: Sender[];
  createdAt: Date;
  updatedAt?: Date;
  status?: MessageStatus;
  type?: 'sent' | 'received' | 'draft' | 'scheduled';
  category?: string;
  tags?: string[];
  hasAttachments?: boolean;
  attachments?: MessageAttachment[];
  scheduledAt?: Date;
  scheduledFor?: Date;
  archivedAt?: Date;
  isImportant?: boolean;
  isFavorite?: boolean;
  isRead?: boolean;
  priority?: MessagePriority;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
  emailAddress: string; // The email address to use
  email?: string; // Backward compatibility
}

export type MessageFilter = 'all' | 'unread' | 'read' | 'important' | 'favorite';
export type MessageCategory = 'inbox' | 'sent' | 'drafts' | 'archive' | 'scheduled';

export interface MessageFormData {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  content: string;
  attachments: File[];
  isDraft: boolean;
  isScheduled: boolean;
  scheduledFor?: Date;
  priority?: MessagePriority;
}

export interface MessageMetrics {
  total: number;
  unread: number;
  sentToday: number;
  receivedToday: number;
  highPriority: number;
}
