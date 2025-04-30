
import { Company } from '../types';

// Mock data for the company service if needed
const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'Entreprise ABC',
    industry: 'Technology',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-2',
    name: 'Entreprise XYZ',
    industry: 'Finance',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-3', 
    name: 'Société 123',
    industry: 'Manufacturing',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Define the company service
export const companyService = {
  // Get a list of companies
  getCompanies: async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock data
      return {
        companies: mockCompanies,
        total: mockCompanies.length
      };
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },
  
  // Get a single company by ID
  getCompanyById: async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find company by ID
      const company = mockCompanies.find(c => c.id === id);
      
      if (!company) {
        throw new Error('Company not found');
      }
      
      return company;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw error;
    }
  }
};
