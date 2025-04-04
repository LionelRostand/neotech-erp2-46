
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
  startDate?: string;
  endDate?: string;
}

export interface CompanyContact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  position?: string;
  companyId: string;
  isMain?: boolean;
}

export interface CompanyDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  fileSize?: number;
  uploadDate: string;
  url: string;
  companyId: string;
  createdAt?: string;
}

export interface CompanyPermission {
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface CompanyUserPermission {
  userId: string;
  userName: string;
  userEmail: string;
  permissions: CompanyPermission[];
}
