import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company, CompanyFilters } from '../types';

const COMPANIES_COLLECTION = 'companies';

class CompanyService {
  async getCompanies(filters?: CompanyFilters): Promise<{ companies: Company[] }> {
    try {
      let q = collection(db, COMPANIES_COLLECTION);
      
      if (filters) {
        // Build query with filters
        let queryRef = query(q);
        
        // Apply filters one by one
        if (filters.status) {
          queryRef = query(queryRef, where('status', '==', filters.status));
        }
        if (filters.industry) {
          queryRef = query(queryRef, where('industry', '==', filters.industry));
        }
        if (filters.name) {
          queryRef = query(queryRef, where('name', '==', filters.name));
        }
        if (filters.location) {
          queryRef = query(queryRef, where('address.city', '==', filters.location));
        }
        
        // Apply sorting if specified
        if (filters.sortBy) {
          const sortOrder = filters.sortOrder === 'desc' ? 'desc' : 'asc';
          queryRef = query(queryRef, orderBy(filters.sortBy, sortOrder));
        }
        
        // Execute the query
        const querySnapshot = await getDocs(queryRef);
        const companies: Company[] = [];
        querySnapshot.forEach((doc) => {
          companies.push({ id: doc.id, ...doc.data() } as Company);
        });
        return { companies };
      } else {
        // No filters, get all companies
        const querySnapshot = await getDocs(q);
        const companies: Company[] = [];
        querySnapshot.forEach((doc) => {
          companies.push({ id: doc.id, ...doc.data() } as Company);
        });
        return { companies };
      }
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }
  }

  async getCompany(id: string): Promise<Company | null> {
    try {
      const companyDoc = await getDoc(doc(db, COMPANIES_COLLECTION, id));
      if (companyDoc.exists()) {
        return { id: companyDoc.id, ...companyDoc.data() } as Company;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching company:", error);
      throw new Error(`Failed to fetch company: ${error.message}`);
    }
  }

  async createCompany(company: Omit<Company, 'id'>): Promise<Company> {
    try {
      const docRef = await addDoc(collection(db, COMPANIES_COLLECTION), company);
      const newCompany = await this.getCompany(docRef.id);
      if (newCompany) {
        return newCompany;
      } else {
        throw new Error("Failed to retrieve newly created company");
      }
    } catch (error: any) {
      console.error("Error creating company:", error);
      throw new Error(`Failed to create company: ${error.message}`);
    }
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
    try {
      await updateDoc(doc(db, COMPANIES_COLLECTION, id), updates);
      const updatedCompany = await this.getCompany(id);
      if (updatedCompany) {
        return updatedCompany;
      } else {
        throw new Error("Failed to retrieve updated company");
      }
    } catch (error: any) {
      console.error("Error updating company:", error);
      throw new Error(`Failed to update company: ${error.message}`);
    }
  }

  async deleteCompany(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COMPANIES_COLLECTION, id));
    } catch (error: any) {
      console.error("Error deleting company:", error);
      throw new Error(`Failed to delete company: ${error.message}`);
    }
  }
}

export const companyService = new CompanyService();
