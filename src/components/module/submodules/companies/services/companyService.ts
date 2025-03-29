
import { Company, CompanyContact, CompanyDocument, CompanyFilters } from '../types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { 
  where, 
  orderBy, 
  limit, 
  query, 
  startAfter,
  getDocs,
  QueryConstraint,
  serverTimestamp
} from 'firebase/firestore';
import { addDocument } from '@/hooks/firestore/create-operations';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

// Données fictives pour simuler les entreprises
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Tech Solutions',
    siret: '12345678901234',
    registrationNumber: 'RCS123456',
    status: 'active',
    contactEmail: 'contact@techsolutions.com',
    contactName: 'Jean Dupont',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Industrie Générale',
    siret: '98765432109876',
    registrationNumber: 'RCS654321',
    status: 'inactive',
    contactEmail: 'info@industriegenerale.fr',
    contactName: 'Marie Martin',
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-03-20')
  },
  {
    id: '3',
    name: 'Service Pro',
    siret: '45678912345678',
    registrationNumber: 'RCS789456',
    status: 'pending',
    contactEmail: 'service@servicepro.com',
    contactName: 'Thomas Bernard',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10')
  },
  {
    id: '4',
    name: 'Digital Express',
    siret: '78945612378945',
    registrationNumber: 'RCS456123',
    status: 'active',
    contactEmail: 'info@digitalexpress.fr',
    contactName: 'Laura Petit',
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-05')
  },
  {
    id: '5',
    name: 'Constructions Modernes',
    siret: '32165498732165',
    registrationNumber: 'RCS987654',
    status: 'active',
    contactEmail: 'contact@constructionsmodernes.com',
    contactName: 'Pierre Lefort',
    createdAt: new Date('2023-07-18'),
    updatedAt: new Date('2023-07-18')
  }
];

export const useCompanyService = () => {
  const companiesFirestore = useFirestore(COLLECTIONS.COMPANIES);
  const contactsFirestore = useFirestore(COLLECTIONS.CONTACTS);
  const documentsFirestore = useFirestore(COLLECTIONS.DOCUMENTS);

  // Récupérer toutes les entreprises avec pagination
  const getCompanies = async (
    page = 1, 
    pageSize = 10, 
    filters: CompanyFilters = {}, 
    searchTerm = ''
  ): Promise<{ companies: Company[], hasMore: boolean }> => {
    try {
      // Simuler un délai pour éviter les appels trop fréquents
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // En mode de développement, utilisons les données fictives
      let filteredCompanies = [...mockCompanies];
      
      // Appliquer les filtres
      if (filters) {
        if (filters.status) {
          filteredCompanies = filteredCompanies.filter(company => 
            company.status === filters.status
          );
        }
        
        if (filters.startDate && filters.endDate) {
          filteredCompanies = filteredCompanies.filter(company => {
            const createdAt = company.createdAt instanceof Date ? company.createdAt : new Date(company.createdAt);
            return createdAt >= filters.startDate! && createdAt <= filters.endDate!;
          });
        }
      }
      
      // Appliquer la recherche
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredCompanies = filteredCompanies.filter(company => 
          company.name?.toLowerCase().includes(term) || 
          company.siret?.toLowerCase().includes(term) ||
          company.registrationNumber?.toLowerCase().includes(term)
        );
      }
      
      // Trier par date de création décroissante
      filteredCompanies.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      // Paginer les résultats
      const startIndex = (page - 1) * pageSize;
      const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + pageSize);
      
      // Vérifier s'il y a plus de données
      const hasMore = startIndex + pageSize < filteredCompanies.length;
      
      console.log('Retrieved companies:', paginatedCompanies);
      return { companies: paginatedCompanies, hasMore };
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Erreur lors du chargement des entreprises");
      return { companies: [], hasMore: false };
    }
  };

  // Créer une nouvelle entreprise
  const createCompany = async (companyData: Partial<Company>): Promise<Company | null> => {
    try {
      console.log('Creating company with data:', companyData);
      
      // Simuler la création d'une entreprise
      const newCompany: Company = {
        id: `new-${Date.now()}`,
        ...companyData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Company;
      
      // Ajouter aux données fictives
      mockCompanies.unshift(newCompany);
      
      console.log('Company created successfully:', newCompany);
      toast.success(`Entreprise ${companyData.name} créée avec succès`);
      
      return newCompany;
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Erreur lors de la création de l'entreprise");
      return null;
    }
  };

  // Récupérer une entreprise par son ID
  const getCompanyById = async (id: string) => mockCompanies.find(c => c.id === id) || null;

  // Mettre à jour une entreprise
  const updateCompany = async (id: string, companyData: Partial<Company>): Promise<boolean> => {
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCompanies[index] = { ...mockCompanies[index], ...companyData, updatedAt: new Date() };
      toast.success(`Entreprise mise à jour avec succès`);
      return true;
    }
    toast.error("Erreur lors de la mise à jour de l'entreprise");
    return false;
  };

  // Supprimer une entreprise
  const deleteCompany = async (id: string): Promise<boolean> => {
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockCompanies.splice(index, 1);
      toast.success("Entreprise supprimée avec succès");
      return true;
    }
    toast.error("Erreur lors de la suppression de l'entreprise");
    return false;
  };

  // Contacts
  const getCompanyContacts = async (companyId: string): Promise<CompanyContact[]> => {
    try {
      const contacts = await contactsFirestore.getAll([
        where('companyId', '==', companyId),
        orderBy('createdAt', 'desc')
      ]) as CompanyContact[];
      return contacts;
    } catch (error) {
      console.error("Error fetching company contacts:", error);
      toast.error("Erreur lors du chargement des contacts");
      return [];
    }
  };

  const createContact = async (contactData: Partial<CompanyContact>): Promise<CompanyContact | null> => {
    try {
      const result = await contactsFirestore.add(contactData) as CompanyContact;
      toast.success("Contact ajouté avec succès");
      return result;
    } catch (error) {
      console.error("Error creating contact:", error);
      toast.error("Erreur lors de la création du contact");
      return null;
    }
  };

  const updateContact = async (id: string, contactData: Partial<CompanyContact>): Promise<boolean> => {
    try {
      await contactsFirestore.update(id, contactData);
      toast.success("Contact mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Error updating contact:", error);
      toast.error("Erreur lors de la mise à jour du contact");
      return false;
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      await contactsFirestore.remove(id);
      toast.success("Contact supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Erreur lors de la suppression du contact");
      return false;
    }
  };

  // Documents
  const getCompanyDocuments = async (companyId: string): Promise<CompanyDocument[]> => {
    try {
      const documents = await documentsFirestore.getAll([
        where('companyId', '==', companyId),
        where('type', '==', 'company_document'),
        orderBy('createdAt', 'desc')
      ]) as CompanyDocument[];
      return documents;
    } catch (error) {
      console.error("Error fetching company documents:", error);
      toast.error("Erreur lors du chargement des documents");
      return [];
    }
  };

  const uploadDocument = async (documentData: Partial<CompanyDocument>): Promise<CompanyDocument | null> => {
    try {
      // Ici, nous n'implémentons pas l'upload de fichier réel, juste l'enregistrement des métadonnées
      const result = await documentsFirestore.add({
        ...documentData,
        type: 'company_document'
      }) as CompanyDocument;
      toast.success("Document ajouté avec succès");
      return result;
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Erreur lors de l'ajout du document");
      return null;
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      await documentsFirestore.remove(id);
      toast.success("Document supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erreur lors de la suppression du document");
      return false;
    }
  };

  return {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyContacts,
    createContact,
    updateContact,
    deleteContact,
    getCompanyDocuments,
    uploadDocument,
    deleteDocument
  };
};
