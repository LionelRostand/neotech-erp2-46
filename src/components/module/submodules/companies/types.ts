
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
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  size?: string;
  status?: string;
  registrationNumber?: string;
  contactName?: string;
  contactEmail?: string;
  employeesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFilters {
  status?: string;
  industry?: string;
  size?: string;
  search?: string;
}

export interface CompanyContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  companyId: string;
}

export interface CompanyDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
  companyId: string;
}

export interface CompanyPermission {
  id: string;
  name: string;
  description: string;
}

export interface CompanyUserPermission {
  userId: string;
  userName: string;
  userEmail: string;
  permissions: string[];
}
