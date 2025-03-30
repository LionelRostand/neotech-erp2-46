
export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  category?: string;
  isImportant?: boolean;
}
