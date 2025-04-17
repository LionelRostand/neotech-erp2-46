
import { collection, addDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '../types';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const createCompany = async (data: Partial<Company>): Promise<Company> => {
  try {
    // Prepare company data with server timestamp
    const companyData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      employeesCount: 0
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, COLLECTIONS.COMPANIES), companyData);
    
    // Return the created company with properly formatted data for client-side use
    // Convert serverTimestamp to string for client usage
    return {
      id: docRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      employeesCount: 0,
      status: data.status || 'active'
    } as Company;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};
