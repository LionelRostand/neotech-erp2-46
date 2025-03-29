
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
      const operationId = `get-companies-${page}-${pageSize}`;
      return await executeWithNetworkRetry(async () => {
        const constraints: QueryConstraint[] = [];
        
        // Appliquer les filtres
        if (filters) {
          if (filters.status) {
            constraints.push(where('status', '==', filters.status));
          }
          
          if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            constraints.push(where('createdAt', '>=', startDate));
            constraints.push(where('createdAt', '<=', endDate));
          }
        }
        
        // Toujours trier par date de création décroissante
        constraints.push(orderBy('createdAt', 'desc'));
        
        // Limiter les résultats selon la pagination
        constraints.push(limit(pageSize));
        
        // Si ce n'est pas la première page, utiliser startAfter
        if (page > 1) {
          // Récupérer le dernier document de la page précédente
          const prevPageConstraints = [...constraints];
          prevPageConstraints.pop(); // Supprimer la limite
          prevPageConstraints.push(limit((page - 1) * pageSize));
          
          const prevPageDocs = await companiesFirestore.getAll(prevPageConstraints);
          if (prevPageDocs.length > 0) {
            const lastDoc = prevPageDocs[prevPageDocs.length - 1] as Company;
            constraints.push(startAfter(lastDoc.createdAt));
          }
        }
        
        // Récupérer les données
        console.log('Fetching companies with constraints:', constraints);
        const data = await companiesFirestore.getAll(constraints) as Company[];
        console.log('Retrieved companies:', data);
        
        // Si recherche par terme, filtrer les résultats côté client
        let filteredData = data;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredData = data.filter(company => 
            company.name?.toLowerCase().includes(term) || 
            company.siret?.toLowerCase().includes(term) ||
            company.registrationNumber?.toLowerCase().includes(term)
          );
        }
        
        // Vérifier s'il y a plus de données
        const hasMore = data.length === pageSize;
        
        return { companies: filteredData, hasMore };
      }, 3, operationId);
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
      
      // Use rate-limited network retry for company creation
      const result = await executeWithNetworkRetry(async () => {
        return await addDocument(COLLECTIONS.COMPANIES, {
          ...companyData,
          createdAt: new Date(),
          updatedAt: new Date()
        }) as Company;
      }, 3, 'create-company');
      
      console.log('Company created successfully:', result);
      toast.success(`Entreprise ${companyData.name} créée avec succès`);
      
      return result;
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("Erreur lors de la création de l'entreprise");
      return null;
    }
  };

  // Récupérer une entreprise par son ID
  const getCompanyById = async (id: string): Promise<Company | null> => {
    try {
      const company = await companiesFirestore.getById(id) as Company;
      return company;
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Erreur lors du chargement de l'entreprise");
      return null;
    }
  };

  // Mettre à jour une entreprise
  const updateCompany = async (id: string, companyData: Partial<Company>): Promise<boolean> => {
    try {
      await companiesFirestore.update(id, companyData);
      toast.success(`Entreprise mise à jour avec succès`);
      return true;
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Erreur lors de la mise à jour de l'entreprise");
      return false;
    }
  };

  // Supprimer une entreprise
  const deleteCompany = async (id: string): Promise<boolean> => {
    try {
      await companiesFirestore.remove(id);
      toast.success("Entreprise supprimée avec succès");
      return true;
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Erreur lors de la suppression de l'entreprise");
      return false;
    }
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
