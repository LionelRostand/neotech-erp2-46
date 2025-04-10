
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/components/module/submodules/companies/types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

/**
 * Récupère la liste des entreprises depuis Firestore
 */
export const getCompanies = async (): Promise<Company[]> => {
  try {
    console.log('Récupération des entreprises depuis Firestore...');
    
    const companiesRef = collection(db, COLLECTIONS.COMPANIES);
    const q = query(companiesRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const companies = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Sans nom',
        industry: data.industry || '',
        status: data.status || 'active',
        logo: data.logo || '',
        logoUrl: data.logoUrl || '',
        website: data.website || '',
        phone: data.phone || '',
        email: data.email || '',
        siret: data.siret || '',
        employeesCount: data.employeesCount || 0,
        size: data.size || '',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
        address: data.address || {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        }
      } as Company;
    });
    
    console.log(`${companies.length} entreprises récupérées`);
    return companies;
  } catch (error) {
    console.error('Erreur lors de la récupération des entreprises:', error);
    throw error;
  }
};

/**
 * Ajoute une nouvelle entreprise à Firestore
 */
export const addCompany = async (company: Partial<Company>): Promise<Company> => {
  try {
    console.log('Ajout d\'une entreprise dans Firestore:', company);
    
    const companyData = {
      ...company,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.COMPANIES), companyData);
    
    toast.success('Entreprise ajoutée avec succès');
    
    return {
      id: docRef.id,
      ...company
    } as Company;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'entreprise:', error);
    throw error;
  }
};

/**
 * Met à jour une entreprise existante dans Firestore
 */
export const updateCompany = async (id: string, updates: Partial<Company>): Promise<boolean> => {
  try {
    console.log(`Mise à jour de l'entreprise ${id} dans Firestore:`, updates);
    
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(doc(db, COLLECTIONS.COMPANIES, id), updatedData);
    
    toast.success('Entreprise mise à jour avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
    throw error;
  }
};

/**
 * Supprime une entreprise de Firestore
 */
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    console.log(`Suppression de l'entreprise ${id} de Firestore`);
    
    await deleteDoc(doc(db, COLLECTIONS.COMPANIES, id));
    
    toast.success('Entreprise supprimée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entreprise:', error);
    throw error;
  }
};
