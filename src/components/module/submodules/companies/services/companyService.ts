
import { Company, CompanyFilters } from '../types';
import { addDoc, collection, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Helper function to generate company ID
const generateCompanyId = () => {
  return `COMP-${Math.floor(100000 + Math.random() * 900000)}`;
};

// Get companies with pagination and filters
const getCompanies = async (
  page = 1,
  pageLimit = 10,
  filters?: CompanyFilters,
  searchTerm?: string
) => {
  try {
    // In a real implementation, this would query Firestore with filters
    const mockCompanies: Company[] = [
      {
        id: 'COMP-123456',
        name: 'Acme Corporation',
        address: {
          street: '123 Main St',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        siret: '12345678901234',
        email: 'contact@acme.com',
        phone: '+33123456789',
        industry: 'Technology',
        size: 'Medium',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      // Add more mock companies as needed
    ];
    
    // Apply filters if provided
    let filteredCompanies = [...mockCompanies];
    
    if (filters) {
      if (filters.status) {
        filteredCompanies = filteredCompanies.filter(company => 
          company.status === filters.status
        );
      }
      
      if (filters.industry) {
        filteredCompanies = filteredCompanies.filter(company => 
          company.industry === filters.industry
        );
      }
      
      if (filters.size) {
        filteredCompanies = filteredCompanies.filter(company => 
          company.size === filters.size
        );
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCompanies = filteredCompanies.filter(company => 
          company.name.toLowerCase().includes(searchLower) ||
          company.email?.toLowerCase().includes(searchLower) ||
          company.phone?.toLowerCase().includes(searchLower)
        );
      }
      
      // Date range filtering would go here
    }
    
    // Apply text search if provided
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredCompanies = filteredCompanies.filter(company => 
        company.name.toLowerCase().includes(searchLower) ||
        company.email?.toLowerCase().includes(searchLower) ||
        company.phone?.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate pagination
    const totalItems = filteredCompanies.length;
    const totalPages = Math.ceil(totalItems / pageLimit);
    const startIndex = (page - 1) * pageLimit;
    const endIndex = startIndex + pageLimit;
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);
    
    return {
      companies: paginatedCompanies,
      pagination: {
        page,
        limit: pageLimit,
        totalItems,
        totalPages
      }
    };
  } catch (error) {
    console.error("Error getting companies:", error);
    throw error;
  }
};

// Get a company by ID
const getCompanyById = async (id: string) => {
  try {
    // In a real implementation, this would query Firestore for a specific company
    const mockCompany: Company = {
      id,
      name: 'Acme Corporation',
      address: {
        street: '123 Main St',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      siret: '12345678901234',
      email: 'contact@acme.com',
      phone: '+33123456789',
      industry: 'Technology',
      size: 'Medium',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return mockCompany;
  } catch (error) {
    console.error("Error getting company:", error);
    throw error;
  }
};

// Create a new company
const createCompany = async (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Generate a unique ID
    const id = generateCompanyId();
    
    // Create the company object
    const newCompany: Company = {
      ...companyData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would add the company to Firestore
    
    return newCompany;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

// Update a company
const updateCompany = async (id: string, companyData: Partial<Company>) => {
  try {
    // In a real implementation, this would update the company in Firestore
    
    return {
      ...companyData,
      id,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

// Delete a company
const deleteCompany = async (id: string) => {
  try {
    // In a real implementation, this would delete the company from Firestore
    
    return true;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

export const companyService = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
