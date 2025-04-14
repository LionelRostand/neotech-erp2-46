import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { DocumentFile, DocumentPermission } from '../types/document-types';

export const usePermissionService = () => {
  const {
    getById: getDocumentById,
    update: updateDocument,
  } = useFirestore(COLLECTIONS.DOCUMENT_COLLECTIONS.DOCUMENTS);

  const updateDocumentPermissions = async (documentId: string, permissions: DocumentPermission[]): Promise<boolean> => {
    try {
      const document = await getDocumentById(documentId) as DocumentFile;
      if (!document) {
        toast.error('Document non trouvé');
        return false;
      }
      
      document.permissions = permissions;
      document.updatedAt = new Date();
      
      await updateDocument(documentId, document);
      toast.success('Permissions mises à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating document permissions:', error);
      toast.error('Erreur lors de la mise à jour des permissions');
      return false;
    }
  };

  return {
    updateDocumentPermissions
  };
};
