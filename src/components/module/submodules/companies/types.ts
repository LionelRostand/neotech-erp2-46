
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
  status: 'active' | 'inactive' | 'lead';
  email?: string;
  phone?: string;
  employeesCount?: number;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}
