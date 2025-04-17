
export interface CompanyContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  companyId: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
  isMainContact: boolean;
  isMain?: boolean; // Added for backward compatibility
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  employees?: number;
  revenue?: string;
  founded?: number;
  website?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'lead' | 'pending';
  email?: string;
  phone?: string;
  employeesCount?: number;
  size?: string; // Added for compatibility
  siret?: string; // Added for compatibility
  logo?: string; // Added for compatibility
  logoUrl?: string; // Added for compatibility
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDocument {
  id: string;
  companyId: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  fileSize?: number;
  contentType: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFilters {
  status?: string;
  industry?: string;
  size?: string;
  name?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
