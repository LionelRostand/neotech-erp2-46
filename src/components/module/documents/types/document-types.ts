
// Document Types
export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  format: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isEncrypted: boolean;
  status: 'active' | 'archived' | 'deleted';
  archivedAt?: Date;
  versions: DocumentVersion[];
  permissions: DocumentPermission[];
  tags: string[];
  description?: string;
  department?: string;
  category?: string;
}

export interface DocumentVersion {
  id: string; // e.g., v01, v02
  size: number;
  createdAt: Date;
  createdBy: string;
  path: string;
  notes: string;
}

export interface DocumentPermission {
  userId: string;
  userName: string;
  accessLevel: 'view' | 'edit' | 'full';
  grantedAt: Date;
  grantedBy: string;
}

export interface DocumentSettings {
  id: string;
  autoArchiveDays: number;
  maxStoragePerUser: number; // In bytes
  allowedFormats: string[];
  encryptionEnabled: boolean;
  emailNotifications: boolean;
  updatedAt: Date;
}

export interface SearchParams {
  query?: string;
  userId?: string;
  status?: 'active' | 'archived' | 'deleted';
  format?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
}

// File Upload Types
export interface FileUploadState {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

// Documents Module Types
export interface UserStorageStats {
  usedStorage: number;
  totalStorage: number;
  documentCount: number;
  archivedCount: number;
}
