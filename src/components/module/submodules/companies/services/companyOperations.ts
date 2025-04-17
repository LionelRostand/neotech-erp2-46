
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

    // Add to Firestore - Fix the collection path issue by using the string directly
    const collectionPath = COLLECTIONS.COMPANIES;
    console.log("Using collection path:", collectionPath); // Debug log
    
    // Check if collection path is valid before proceeding
    if (!collectionPath || collectionPath === '') {
      throw new Error('Invalid collection path for companies');
    }
    
    const docRef = await addDoc(collection(db, collectionPath), companyData);
    
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
