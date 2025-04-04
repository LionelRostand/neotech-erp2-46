
import { toast } from 'sonner';
import { Company, CompanyContact, CompanyDocument, CompanyFilters } from '../types';

// Mock companies data
const mockCompanies: Company[] = [
  {
    id: 'comp1',
    name: 'TechInnovation',
    siret: '123 456 789 00012',
    address: {
      street: '15 Rue de l\'Innovation',
      city: 'Paris',
      postalCode: '75001',
      country: 'France'
    },
    industry: 'Technology',
    size: '50-250',
    employeesCount: 120,
    email: 'contact@techinnovation.com',
    phone: '+33 1 23 45 67 89',
    status: 'active',
    website: 'https://techinnovation.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'comp2',
    name: 'GreenCo',
    siret: '987 654 321 00098',
    address: {
      street: '42 Avenue Verte',
      city: 'Lyon',
      postalCode: '69000',
      country: 'France'
    },
    industry: 'Energy',
    size: '10-50',
    employeesCount: 35,
    email: 'info@greenco.fr',
    phone: '+33 4 56 78 90 12',
    status: 'active',
    website: 'https://greenco.fr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'comp3',
    name: 'Enterprise Solutions',
    siret: '456 789 123 00045',
    address: {
      street: '8 Boulevard des Affaires',
      city: 'Bordeaux',
      postalCode: '33000',
      country: 'France'
    },
    industry: 'Consulting',
    size: '>250',
    employeesCount: 310,
    email: 'contact@enterprise-solutions.com',
    phone: '+33 5 67 89 01 23',
    status: 'active',
    website: 'https://enterprise-solutions.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'comp4',
    name: 'BioMed Innovations',
    siret: '234 567 891 00078',
    address: {
      street: '27 Rue Pasteur',
      city: 'Lille',
      postalCode: '59000',
      country: 'France'
    },
    industry: 'Healthcare',
    size: '50-250',
    employeesCount: 87,
    email: 'contact@biomed-innovations.com',
    phone: '+33 3 45 67 89 01',
    status: 'inactive',
    website: 'https://biomed-innovations.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'comp5',
    name: 'Digital Media Group',
    siret: '345 678 912 00056',
    address: {
      street: '14 Rue des Arts',
      city: 'Marseille',
      postalCode: '13000',
      country: 'France'
    },
    industry: 'Media',
    size: '10-50',
    employeesCount: 42,
    email: 'info@digitalmediagroup.fr',
    phone: '+33 4 91 23 45 67',
    status: 'pending',
    website: 'https://digitalmediagroup.fr',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Filter companies based on criteria
export const filterCompanies = (companies: Company[], filters: CompanyFilters | null) => {
  if (!filters || Object.keys(filters).length === 0) {
    return companies;
  }

  return companies.filter(company => {
    // Filter by status
    if (filters.status && company.status !== filters.status) {
      return false;
    }

    // Filter by industry
    if (filters.industry && company.industry !== filters.industry) {
      return false;
    }

    // Filter by size
    if (filters.size && company.size !== filters.size) {
      return false;
    }

    // Search by name or registration number
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = company.name.toLowerCase().includes(searchLower);
      const regMatch = company.registrationNumber && company.registrationNumber.toLowerCase().includes(searchLower);
      
      if (!nameMatch && !regMatch) {
        return false;
      }
    }

    // Filter by creation date range
    if (filters.startDate && filters.endDate) {
      const companyDate = new Date(company.createdAt).getTime();
      const startDate = new Date(filters.startDate).getTime();
      const endDate = new Date(filters.endDate).getTime();
      
      if (companyDate < startDate || companyDate > endDate) {
        return false;
      }
    }

    return true;
  });
};

// Get all companies
export const getCompanies = async (): Promise<Company[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockCompanies]);
    }, 500);
  });
};

// Get a single company by ID
export const getCompanyById = async (id: string): Promise<Company | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const company = mockCompanies.find(c => c.id === id) || null;
      resolve(company ? { ...company } : null);
    }, 300);
  });
};

// Create a new company
export const createCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCompany: Company = {
        id: `comp${mockCompanies.length + 1}`,
        ...companyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockCompanies.push(newCompany);
      resolve({ ...newCompany });
      toast.success('Entreprise créée avec succès');
    }, 500);
  });
};

// Update an existing company
export const updateCompany = async (id: string, companyData: Partial<Company>): Promise<Company | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockCompanies.findIndex(c => c.id === id);
      if (index === -1) {
        resolve(null);
        toast.error('Entreprise non trouvée');
        return;
      }
      
      mockCompanies[index] = {
        ...mockCompanies[index],
        ...companyData,
        updatedAt: new Date().toISOString()
      };
      
      resolve({ ...mockCompanies[index] });
      toast.success('Entreprise mise à jour avec succès');
    }, 500);
  });
};

// Delete a company
export const deleteCompany = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockCompanies.findIndex(c => c.id === id);
      if (index === -1) {
        resolve(false);
        toast.error('Entreprise non trouvée');
        return;
      }
      
      mockCompanies.splice(index, 1);
      resolve(true);
      toast.success('Entreprise supprimée avec succès');
    }, 500);
  });
};

// Custom hook to use the company service
export const useCompanyService = () => {
  // Get companies with pagination and filters
  const getCompanies = async (page: number = 1, limit: number = 10, filters: CompanyFilters = {}, searchTerm: string = '') => {
    try {
      // In a real app, we would call an API with pagination, filters, and search
      // Here we simulate it by filtering and slicing the data
      
      // Clone the mock data
      let filteredCompanies = [...mockCompanies];
      
      // Apply search if provided
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filteredCompanies = filteredCompanies.filter(company => 
          company.name.toLowerCase().includes(term) || 
          company.siret?.toLowerCase().includes(term) ||
          company.email?.toLowerCase().includes(term)
        );
      }
      
      // Apply filters
      if (Object.keys(filters).length > 0) {
        filteredCompanies = filterCompanies(filteredCompanies, filters);
      }
      
      // Calculate total pages
      const totalItems = filteredCompanies.length;
      const totalPages = Math.ceil(totalItems / limit);
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);
      
      return {
        companies: paginatedCompanies,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages
        }
      };
    } catch (error) {
      toast.error('Erreur lors de la récupération des entreprises');
      console.error('Error fetching companies:', error);
      return { 
        companies: [],
        pagination: {
          page,
          limit,
          totalItems: 0,
          totalPages: 0
        }
      };
    }
  };

  return {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
  };
};
