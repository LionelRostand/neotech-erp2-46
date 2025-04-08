
import { Prospect } from '../types/crm-types';

export const mockProspects: Prospect[] = [
  {
    id: '1',
    name: 'Tech Innovations',
    company: 'Tech Innovations',
    contactName: 'Pierre Dupont',
    contactEmail: 'pierre@techinnovations.fr',
    contactPhone: '01 23 45 67 89',
    email: 'info@techinnovations.fr',
    phone: '01 23 45 67 89',
    status: 'new',
    source: 'website',
    industry: 'technology',
    website: 'www.techinnovations.fr',
    address: '123 Boulevard de l\'Innovation, Paris',
    size: 'medium',
    estimatedValue: 25000,
    notes: 'Prospect intéressé par notre solution CRM',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Green Solutions',
    company: 'Green Solutions',
    contactName: 'Marie Lambert',
    contactEmail: 'marie@greensolutions.fr',
    contactPhone: '01 98 76 54 32',
    email: 'contact@greensolutions.fr',
    phone: '01 98 76 54 32',
    status: 'contacted',
    source: 'linkedin',
    industry: 'environmental',
    website: 'www.greensolutions.fr',
    address: '456 Rue de l\'Écologie, Lyon',
    size: 'small',
    estimatedValue: 15000,
    notes: 'Premier contact effectué, en attente de retour',
    createdAt: '2023-02-20'
  },
  {
    id: '3',
    name: 'Global Finance',
    company: 'Global Finance',
    contactName: 'Julien Martin',
    contactEmail: 'julien@globalfinance.fr',
    contactPhone: '01 45 67 89 01',
    email: 'info@globalfinance.fr',
    phone: '01 45 67 89 01',
    status: 'meeting',
    source: 'referral',
    industry: 'finance',
    website: 'www.globalfinance.fr',
    address: '789 Avenue des Finances, Bordeaux',
    size: 'large',
    estimatedValue: 50000,
    notes: 'Rendez-vous programmé pour la semaine prochaine',
    createdAt: '2023-03-10'
  }
];

// This data can be used to seed the Firestore collection
// Example code to seed Firestore (to be run once):
/*
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const seedProspectsToFirestore = async () => {
  try {
    const prospectsCollection = collection(db, COLLECTIONS.CRM.PROSPECTS);
    
    for (const prospect of mockProspects) {
      const { id, ...prospectData } = prospect;
      await addDoc(prospectsCollection, {
        ...prospectData,
        createdAt: new Date(prospectData.createdAt),
        updatedAt: new Date()
      });
    }
    
    console.log('Seeded prospects to Firestore successfully');
  } catch (error) {
    console.error('Error seeding prospects to Firestore:', error);
  }
};
*/
