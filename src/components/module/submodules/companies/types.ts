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
  website: string;
  industry: string;
  size: string;
  status: 'active' | 'inactive' | 'pending';
  employeesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyContact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  isMain: boolean;
  isMainContact: boolean;
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
