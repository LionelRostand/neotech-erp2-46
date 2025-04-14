import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { DocumentFile, SearchParams } from '../types/document-types';

export const useSearchService = () => {
  const {
    getAll: getAllDocuments,
  } = useFirestore(COLLECTIONS.DOCUMENT_COLLECTIONS.DOCUMENTS);

  const getAllUserDocuments = async (userId: string, status: 'active' | 'archived' | 'all' = 'active'): Promise<DocumentFile[]> => {
    try {
      // In a real implementation, we would use constraints to filter by userId and status
      const allDocs = await getAllDocuments();
      
      // Fixed: Cast the documents properly to DocumentFile
      return allDocs.filter(doc => {
        const typedDoc = doc as unknown as DocumentFile;
        if (status === 'all') {
          return true;
        }
        return typedDoc.status === status && 
               (typedDoc.createdBy === userId || 
                typedDoc.permissions.some(p => p.userId === userId));
      }) as DocumentFile[];
    } catch (error) {
      console.error('Error getting documents:', error);
      toast.error('Erreur lors de la récupération des documents');
      return [];
    }
  };

  const searchDocuments = async (params: SearchParams): Promise<DocumentFile[]> => {
    try {
      // In a real implementation, we would use a proper search engine
      // For now, we'll do a simple client-side filtering
      const allDocs = await getAllUserDocuments(params.userId || 'current-user', 'all');
      
      return allDocs.filter(doc => {
        // Filter by search term in name
        if (params.query && !doc.name.toLowerCase().includes(params.query.toLowerCase())) {
          return false;
        }
        
        // Filter by status
        if (params.status && doc.status !== params.status) {
          return false;
        }
        
        // Filter by format
        if (params.format && doc.format !== params.format) {
          return false;
        }
        
        // Filter by tags
        if (params.tag && !doc.tags.includes(params.tag)) {
          return false;
        }
        
        // Filter by date range
        if (params.dateFrom && new Date(doc.createdAt) < new Date(params.dateFrom)) {
          return false;
        }
        
        if (params.dateTo && new Date(doc.createdAt) > new Date(params.dateTo)) {
          return false;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error searching documents:', error);
      toast.error('Erreur lors de la recherche de documents');
      return [];
    }
  };

  return {
    getAllUserDocuments,
    searchDocuments
  };
};
