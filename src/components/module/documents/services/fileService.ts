import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { DocumentFile, DocumentVersion } from '../types/document-types';

export const useFileService = () => {
  const {
    getById: getDocumentById,
    add: addDocument,
    update: updateDocument,
  } = useFirestore(COLLECTIONS.DOCUMENT_COLLECTIONS.DOCUMENTS);

  const uploadDocument = async (file: File, metadata: Partial<DocumentFile>): Promise<DocumentFile | null> => {
    try {
      // In a real implementation, this would upload to S3/MinIO
      // For now, we'll simulate the upload and save metadata to Firestore
      const newDoc: DocumentFile = {
        id: '',
        name: file.name,
        type: file.type,
        size: file.size,
        format: file.name.split('.').pop() || '',
        path: `/documents/${file.name}`, // Simulated path
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user', // Would be actual user ID
        isEncrypted: metadata.isEncrypted || false,
        status: 'active',
        versions: [],
        permissions: metadata.permissions || [],
        tags: metadata.tags || [],
        ...metadata
      };
      
      // Add document to Firestore and get the result
      const result = await addDocument(newDoc);
      
      // Create a proper DocumentFile object by merging the original newDoc with the id from result
      const uploadedDocument: DocumentFile = {
        ...newDoc,
        id: result.id,
      };
      
      toast.success(`Document "${file.name}" téléversé avec succès`);
      return uploadedDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Erreur lors du téléversement du document');
      return null;
    }
  };

  const uploadMultipleDocuments = async (files: File[], commonMetadata: Partial<DocumentFile> = {}): Promise<(DocumentFile | null)[]> => {
    const uploadPromises = Array.from(files).map(file => 
      uploadDocument(file, commonMetadata)
    );
    return Promise.all(uploadPromises);
  };

  const createVersion = async (documentId: string, file: File): Promise<DocumentVersion | null> => {
    try {
      const document = await getDocumentById(documentId) as DocumentFile;
      if (!document) {
        toast.error('Document non trouvé');
        return null;
      }

      const newVersion: DocumentVersion = {
        id: `v${(document.versions.length + 1).toString().padStart(2, '0')}`,
        size: file.size,
        createdAt: new Date(),
        createdBy: 'current-user', // Would be actual user ID
        path: `/documents/versions/${documentId}/${file.name}`, // Simulated path
        notes: '',
      };

      document.versions.push(newVersion);
      document.updatedAt = new Date();
      
      await updateDocument(documentId, document);
      toast.success(`Nouvelle version créée (${newVersion.id})`);
      return newVersion;
    } catch (error) {
      console.error('Error creating version:', error);
      toast.error('Erreur lors de la création de la version');
      return null;
    }
  };

  return {
    uploadDocument,
    uploadMultipleDocuments,
    createVersion
  };
};
