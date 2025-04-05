
// Define Company types
export interface Company {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  siret: string;
  logo?: string;
  logoUrl?: string;
  phone: string;
  email: string;
  website?: string;
  industry?: string;
  size?: string;
  status: 'active' | 'inactive' | 'pending';
  employeesCount: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  contactPerson?: string;
}

// Define CompanyContact types
export interface CompanyContact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  isMain: boolean;
  isMainContact?: boolean; // Added this field to fix type errors
  createdAt: string;
  updatedAt: string;
  notes?: string;
  department?: string;
}

// Define CompanyPermission types
export interface CompanyPermission {
  id: string;
  name: string;
  description: string;
  value: boolean;
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

// Define CompanyUserPermission types
export interface CompanyUserPermission {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  permissions: CompanyPermission[];
}

// Define CompanyDocument types - moved from companies.ts to here
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

// Define CompanyFilters types - moved from companies.ts to here
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
