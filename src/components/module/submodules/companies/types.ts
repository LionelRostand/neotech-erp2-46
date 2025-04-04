
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
  industry?: string;
  size?: string;
  employeesCount?: number;
  createdAt: string;
  updatedAt: string;
}
