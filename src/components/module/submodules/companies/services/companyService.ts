
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
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
import { createCompany as createCompanyOp } from './companyOperations';

const determineCompanySize = (employeesCount: number): string => {
  if (employeesCount <= 10) return 'Très petite entreprise';
  if (employeesCount <= 50) return 'Petite entreprise';
  if (employeesCount <= 250) return 'Moyenne entreprise';
  return 'Grande entreprise';
};

class CompanyService {
  async getCompanies(filters?: CompanyFilters): Promise<{ companies: Company[] }> {
    try {
      const q = collection(db, COLLECTIONS.COMPANIES);
      
      // Start with a basic query
      let queryRef = query(q);
      
      // Handle potentially undefined filters
      if (filters) {
        // Only add valid filters
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
        
        if (filters.sortBy) {
          const sortOrder = filters.sortOrder === 'desc' ? 'desc' : 'asc';
          queryRef = query(queryRef, orderBy(filters.sortBy, sortOrder));
        }
      } else {
        // Default sorting if no filters provided
        queryRef = query(queryRef, orderBy('name', 'asc'));
      }
      
      const querySnapshot = await getDocs(queryRef);
      const companies: Company[] = [];
      
      for (const doc of querySnapshot.docs) {
        try {
          const employeesQuery = query(
            collection(db, COLLECTIONS.HR.EMPLOYEES),
            where('company', '==', doc.id)
          );
          const employeesSnapshot = await getDocs(employeesQuery);
          const employeesCount = employeesSnapshot.size;
          
          const companyData = doc.data();
          const size = determineCompanySize(employeesCount);
          
          // Only update if the data exists
          if (companyData) {
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
        } catch (docError) {
          console.error(`Error processing company document ${doc.id}:`, docError);
          // Continue with other documents even if one fails
        }
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

  async createCompany(company: Partial<Company>): Promise<Company> {
    return await createCompanyOp(company);
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
