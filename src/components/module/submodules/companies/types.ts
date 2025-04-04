
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
  search?: string; // Adding this property for search functionality
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

// Companies filters props
export interface CompaniesFiltersProps {
  filters: CompanyFilters;
  onFilterChange: (newFilters: CompanyFilters) => void;
  onResetFilters: () => void;
}

// Company service interface
export interface CompanyServiceInterface {
  getCompanies: (page?: number, limit?: number, filters?: CompanyFilters, searchTerm?: string) => Promise<{
    companies: Company[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  }>;
  getCompanyById: (id: string) => Promise<Company>;
  createCompany: (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Company>;
  updateCompany: (id: string, companyData: Partial<Company>) => Promise<Company>;
  deleteCompany: (id: string) => Promise<boolean>;
  
  // Additional methods for contacts and documents
  getCompanyContacts: (companyId: string) => Promise<CompanyContact[]>;
  createContact: (contact: Omit<CompanyContact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CompanyContact>;
  updateContact: (id: string, contact: Partial<CompanyContact>) => Promise<CompanyContact>;
  deleteContact: (id: string) => Promise<boolean>;
  
  getCompanyDocuments: (companyId: string) => Promise<CompanyDocument[]>;
  uploadDocument: (document: Omit<CompanyDocument, 'id' | 'createdAt' | 'updatedAt'>, file: File) => Promise<CompanyDocument>;
  deleteDocument: (id: string) => Promise<boolean>;
}
