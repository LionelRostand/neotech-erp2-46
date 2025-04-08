
import { Opportunity, OpportunityStage } from '../types/crm-types';

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Déploiement CRM Enterprise',
    clientName: 'Tech Innovations',
    clientId: 'client-1',
    contactName: 'Pierre Dupont',
    contactEmail: 'pierre@techinnovations.fr',
    contactPhone: '01 23 45 67 89',
    value: 25000,
    stage: OpportunityStage.PROPOSAL,
    probability: 50,
    expectedCloseDate: '2023-06-30',
    description: 'Déploiement complet de notre solution CRM pour une entreprise de 50 employés',
    products: ['CRM Basic', 'Module Analytics', 'Support Premium'],
    source: 'website',
    notes: 'Client très intéressé par nos fonctionnalités d\'analytique',
    assignedTo: 'user-1',
    ownerName: 'Sophie Martin',
    createdAt: '2023-01-20',
    updatedAt: '2023-02-15',
    nextContact: '2023-03-01',
    title: 'Proposition commerciale'
  },
  {
    id: '2',
    name: 'Migration de données',
    clientName: 'Green Solutions',
    clientId: 'client-2',
    contactName: 'Marie Lambert',
    contactEmail: 'marie@greensolutions.fr',
    contactPhone: '01 98 76 54 32',
    value: 15000,
    stage: OpportunityStage.NEGOTIATION,
    probability: 70,
    expectedCloseDate: '2023-05-15',
    description: 'Migration depuis un système legacy vers notre plateforme',
    products: ['CRM Pro', 'Service Migration', 'Formation'],
    source: 'linkedin',
    notes: 'Besoin urgent de migrer avant la fin du trimestre',
    assignedTo: 'user-2',
    ownerName: 'Thomas Petit',
    createdAt: '2023-02-05',
    updatedAt: '2023-02-28',
    nextContact: '2023-03-10',
    title: 'Offre de migration'
  },
  {
    id: '3',
    name: 'Solution analytique',
    clientName: 'Global Finance',
    clientId: 'client-3',
    contactName: 'Julien Martin',
    contactEmail: 'julien@globalfinance.fr',
    contactPhone: '01 45 67 89 01',
    value: 50000,
    stage: OpportunityStage.DISCOVERY,
    probability: 30,
    expectedCloseDate: '2023-08-20',
    description: 'Mise en place d\'une solution d\'analytique avancée pour le département financier',
    products: ['CRM Enterprise', 'Module BI', 'API Custom'],
    source: 'referral',
    notes: 'Client exigeant avec des besoins spécifiques en termes de sécurité',
    assignedTo: 'user-3',
    ownerName: 'Claire Dupuis',
    createdAt: '2023-03-01',
    updatedAt: '2023-03-15',
    nextContact: '2023-04-01',
    title: 'Analyse des besoins'
  }
];

// This data can be used to seed the Firestore collection
// Example code to seed Firestore (to be run once):
/*
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const seedOpportunitiesToFirestore = async () => {
  try {
    const opportunitiesCollection = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
    
    for (const opportunity of mockOpportunities) {
      const { id, ...opportunityData } = opportunity;
      await addDoc(opportunitiesCollection, {
        ...opportunityData,
        createdAt: new Date(opportunityData.createdAt),
        updatedAt: new Date(opportunityData.updatedAt),
        expectedCloseDate: new Date(opportunityData.expectedCloseDate),
        nextContact: new Date(opportunityData.nextContact)
      });
    }
    
    console.log('Seeded opportunities to Firestore successfully');
  } catch (error) {
    console.error('Error seeding opportunities to Firestore:', error);
  }
};
*/
