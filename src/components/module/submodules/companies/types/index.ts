
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
  industry: string;
  employees: number;
  revenue: string;
  founded: number;
  website: string;
  description: string;
  status: 'active' | 'inactive' | 'lead';
  address: string;
  city: string;
  country: string;
  postalCode: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}
