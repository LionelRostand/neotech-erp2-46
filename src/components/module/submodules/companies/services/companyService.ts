import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Update import 
import { Company, CompanyFilters } from '../types';

const COMPANIES_COLLECTION = 'companies';

class CompanyService {
  async getCompanies(filters?: CompanyFilters): Promise<{ companies: Company[] }> {
    try {
      let q = collection(db, COMPANIES_COLLECTION);

      if (filters) {
        if (filters.name) {
          q = query(q, where('name', '==', filters.name));
        }
        if (filters.industry) {
          q = query(q, where('industry', '==', filters.industry));
        }
        if (filters.location) {
          q = query(q, where('location', '==', filters.location));
        }
        // Add sorting
        if (filters.sortBy) {
          const sortOrder: 'asc' | 'desc' = filters.sortOrder === 'desc' ? 'desc' : 'asc';
          q = query(q, orderBy(filters.sortBy, sortOrder));
        }
      }

      const querySnapshot = await getDocs(q);
      const companies: Company[] = [];
      querySnapshot.forEach((doc) => {
        companies.push({ id: doc.id, ...doc.data() } as Company);
      });
      return { companies };
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
