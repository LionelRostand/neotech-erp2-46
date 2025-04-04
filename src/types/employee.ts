
import { Company } from '@/components/module/submodules/companies/types';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  photo?: string;
  photoURL?: string;
  hireDate?: string;
  startDate?: string;
  status?: 'active' | 'inactive' | 'onLeave';
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  contract?: string;
  socialSecurityNumber?: string;
  birthDate?: string;
  documents?: string[];
  company?: string | Company;
  role?: string;
}
