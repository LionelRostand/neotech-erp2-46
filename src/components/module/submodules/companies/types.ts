
// Company main types
export interface Company {
  id: string;
  name: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  siret?: string;
  logo?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  size?: string;
  status: 'active' | 'inactive' | 'pending';
  employeesCount?: number;
  createdAt: string;
  updatedAt: string;
  registrationNumber?: string;
  contactName?: string;
  contactEmail?: string;
}

// Company contacts
export interface CompanyContact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  isMainContact?: boolean;
  isMain?: boolean; // Adding this for backwards compatibility
  createdAt: string;
  updatedAt: string;
}

// Company documents
export interface CompanyDocument {
  id: string;
  companyId: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  fileSize?: number; // Adding this for backwards compatibility
  contentType?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Company filters
export interface CompanyFilters {
  status?: string;
  industry?: string;
  size?: string;
  startDate?: string;
  endDate?: string;
  search?: string; // Adding this property
}

// Company user permissions
export interface CompanyUserPermission {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  permissions: CompanyPermission[];
}

// Company permission
export interface CompanyPermission {
  id: string;
  name: string;
  description: string;
  value: boolean;
  moduleId?: string; // Adding this property
  canView?: boolean; // Adding these properties
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}
