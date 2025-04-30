
import { useFirestore } from '@/hooks/use-firestore';
import { DOCUMENT_COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { DocumentFile } from '../types/document-types';

export const useArchiveService = () => {
  const {
    getById: getDocumentById,
    update: updateDocument,
  } = useFirestore(DOCUMENT_COLLECTIONS.DOCUMENTS);

  const archiveDocument = async (documentId: string): Promise<boolean> => {
    try {
      const document = await getDocumentById(documentId) as DocumentFile;
      if (!document) {
        toast.error('Document non trouvé');
        return false;
      }

      document.status = 'archived';
      document.archivedAt = new Date();
      document.updatedAt = new Date();
      
      await updateDocument(documentId, document);
      toast.success(`Document "${document.name}" archivé avec succès`);
      return true;
    } catch (error) {
      console.error('Error archiving document:', error);
      toast.error('Erreur lors de l\'archivage du document');
      return false;
    }
  };

  const restoreDocument = async (documentId: string): Promise<boolean> => {
    try {
      const document = await getDocumentById(documentId) as DocumentFile;
      if (!document) {
        toast.error('Document non trouvé');
        return false;
      }

      document.status = 'active';
      document.archivedAt = undefined;
      document.updatedAt = new Date();
      
      await updateDocument(documentId, document);
      toast.success(`Document "${document.name}" restauré avec succès`);
      return true;
    } catch (error) {
      console.error('Error restoring document:', error);
      toast.error('Erreur lors de la restauration du document');
      return false;
    }
  };

  return {
    archiveDocument,
    restoreDocument
  };
};
