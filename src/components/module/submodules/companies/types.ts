
export interface Company {
  id: string;
  name: string;
  siret?: string;
  registrationNumber?: string;
  status?: 'active' | 'inactive' | 'pending';
  type?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
  contactName?: string;
  createdAt: any;
  updatedAt: any;
  website?: string;
  description?: string;
}

export interface CompanyContact {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  isMain?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface CompanyDocument {
  id: string;
  companyId: string;
  name: string;
  type: string; 
  fileUrl: string;
  fileSize?: number;
  uploadedBy?: string;
  createdAt: any;
  updatedAt: any;
  tags?: string[];
}

export interface CompanyFilters {
  status?: 'active' | 'inactive' | 'pending';
  startDate?: Date;
  endDate?: Date;
}
