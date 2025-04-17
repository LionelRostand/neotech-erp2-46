
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '../types';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const createCompany = async (data: Partial<Company>): Promise<Company> => {
  try {
    const companyData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      employeesCount: 0
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.COMPANIES), companyData);
    
    return {
      id: docRef.id,
      ...companyData,
    } as Company;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};
