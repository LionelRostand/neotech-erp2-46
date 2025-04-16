
import { Prospect } from '../types/crm-types';

// Add mock prospects data
const mockProspectsData: Prospect[] = [
  {
    id: "mock-prospect-1",
    name: "TechInnovate",
    company: "TechInnovate SAS",
    contactName: "Jean Martin",
    contactEmail: "jmartin@techinnovate.fr",
    contactPhone: "01 23 45 67 89",
    email: "contact@techinnovate.fr",
    phone: "01 23 45 67 88",
    status: "new",
    source: "website",
    industry: "tech",
    website: "www.techinnovate.fr",
    address: "15 rue de l'Innovation, 75001 Paris",
    size: "50-100",
    notes: "Intéressé par nos solutions de CRM",
    lastContact: "2023-04-15",
    estimatedValue: 15000,
    createdAt: "2023-04-10"
  },
  {
    id: "mock-prospect-2",
    name: "GreenEnergy",
    company: "GreenEnergy SA",
    contactName: "Sophie Dubois",
    contactEmail: "sophie.dubois@greenenergy.com",
    contactPhone: "01 23 45 67 90",
    email: "info@greenenergy.com",
    phone: "01 23 45 67 91",
    status: "contacted",
    source: "referral",
    industry: "energy",
    website: "www.greenenergy.com",
    address: "8 avenue Verte, 75008 Paris",
    size: "100-500",
    notes: "Rendez-vous prévu pour le mois prochain",
    lastContact: "2023-05-20",
    estimatedValue: 50000,
    createdAt: "2023-05-15"
  },
  {
    id: "mock-prospect-3",
    name: "HealthPlus",
    company: "HealthPlus SARL",
    contactName: "Pierre Lambert",
    contactEmail: "pierre.lambert@healthplus.fr",
    contactPhone: "01 23 45 67 92",
    email: "contact@healthplus.fr",
    phone: "01 23 45 67 93",
    status: "qualified",
    source: "tradeshow",
    industry: "healthcare",
    website: "www.healthplus.fr",
    address: "25 rue de la Santé, 69002 Lyon",
    size: "10-50",
    notes: "A participé à notre dernier webinaire",
    lastContact: "2023-06-05",
    estimatedValue: 25000,
    createdAt: "2023-05-30"
  }
];

export default mockProspectsData;
