
import { Client } from '../types/crm-types';

const mockClientsData: Client[] = [
  {
    id: 'mock-client-1',
    name: 'TechSolutions Inc',
    contactName: 'Jean Dupont',
    contactEmail: 'jean.dupont@techsolutions.com',
    contactPhone: '01 23 45 67 89',
    sector: 'technology',
    revenue: '500000',
    status: 'active',
    website: 'www.techsolutions.com',
    address: '15 Avenue de la République, 75011 Paris',
    notes: 'Client depuis 2018, intéressé par nos solutions cloud',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerSince: '2018-05-12',
    _offlineCreated: true
  },
  {
    id: 'mock-client-2',
    name: 'Finance Express',
    contactName: 'Marie Martin',
    contactEmail: 'marie.martin@financeexpress.fr',
    contactPhone: '01 23 45 67 90',
    sector: 'finance',
    revenue: '1200000',
    status: 'active',
    website: 'www.financeexpress.fr',
    address: '8 Rue de la Bourse, 75002 Paris',
    notes: 'Gros client, contrat renouvelé récemment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerSince: '2019-11-23',
    _offlineCreated: true
  },
  {
    id: 'mock-client-3',
    name: 'EducaTech',
    contactName: 'Pierre Durand',
    contactEmail: 'pierre.durand@educatech.org',
    contactPhone: '01 23 45 67 91',
    sector: 'education',
    revenue: '350000',
    status: 'inactive',
    website: 'www.educatech.org',
    address: '24 Rue des Écoles, 75005 Paris',
    notes: 'Contrat en attente de renouvellement',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerSince: '2020-01-15',
    _offlineCreated: true
  },
  {
    id: 'mock-client-4',
    name: 'Santé Plus',
    contactName: 'Sophie Lambert',
    contactEmail: 'sophie.lambert@santeplus.fr',
    contactPhone: '01 23 45 67 92',
    sector: 'healthcare',
    revenue: '780000',
    status: 'active',
    website: 'www.santeplus.fr',
    address: '45 Boulevard des Hôpitaux, 75013 Paris',
    notes: 'Expansion prévue au deuxième trimestre',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerSince: '2021-06-30',
    _offlineCreated: true
  },
  {
    id: 'mock-client-5',
    name: 'Mode Express',
    contactName: 'Lucie Dubois',
    contactEmail: 'lucie.dubois@modeexpress.com',
    contactPhone: '01 23 45 67 93',
    sector: 'retail',
    revenue: '420000',
    status: 'lead',
    website: 'www.modeexpress.com',
    address: '12 Rue du Commerce, 75015 Paris',
    notes: 'Prospect intéressé par notre nouvelle offre',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _offlineCreated: true
  }
];

export default mockClientsData;
