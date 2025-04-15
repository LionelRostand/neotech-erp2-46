import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company, CompanyFilters } from '../types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

// Helper function to determine company size based on employee count
const determineCompanySize = (employeesCount: number): string => {
  if (employeesCount <= 10) return 'Très petite entreprise';
  if (employeesCount <= 50) return 'Petite entreprise';
  if (employeesCount <= 250) return 'Moyenne entreprise';
  return 'Grande entreprise';
};

class CompanyService {
  async getCompanies(filters?: CompanyFilters): Promise<{ companies: Company[] }> {
    try {
      let q = collection(db, COLLECTIONS.COMPANIES);
      
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
      
      const querySnapshot = await getDocs(queryRef || q);
      const companies: Company[] = [];
      
      // For each company, count its employees
      for (const doc of querySnapshot.docs) {
        // Get employee count for this company
        const employeesQuery = query(
          collection(db, COLLECTIONS.HR.EMPLOYEES),
          where('company', '==', doc.id)
        );
        const employeesSnapshot = await getDocs(employeesQuery);
        const employeesCount = employeesSnapshot.size;
        
        // Update company size if needed
        const companyData = doc.data();
        const size = determineCompanySize(employeesCount);
        
        if (companyData.size !== size || companyData.employeesCount !== employeesCount) {
          await updateDoc(doc.ref, {
            size,
            employeesCount,
            updatedAt: serverTimestamp()
          });
        }
        
        companies.push({
          id: doc.id,
          ...companyData,
          size,
          employeesCount
        } as Company);
      }
      
      return { companies };
    } catch (error: any) {
      console.error("Error fetching companies:", error);
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }
  }

  async getCompany(id: string): Promise<Company | null> {
    try {
      const companyDoc = await getDoc(doc(db, COLLECTIONS.COMPANIES, id));
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
      const docRef = await addDoc(collection(db, COLLECTIONS.COMPANIES), company);
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
      const employeesQuery = query(
        collection(db, COLLECTIONS.HR.EMPLOYEES),
        where('company', '==', id)
      );
      const employeesSnapshot = await getDocs(employeesQuery);
      const employeesCount = employeesSnapshot.size;
      
      const updatedData = {
        ...updates,
        employeesCount,
        size: determineCompanySize(employeesCount),
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, COLLECTIONS.COMPANIES, id), updatedData);
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
      await deleteDoc(doc(db, COLLECTIONS.COMPANIES, id));
    } catch (error: any) {
      console.error("Error deleting company:", error);
      throw new Error(`Failed to delete company: ${error.message}`);
    }
  }
}

export const companyService = new CompanyService();
