
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { 
  DocumentFile, 
  DocumentPermission, 
  DocumentVersion,
  DocumentSettings,
  SearchParams
} from '../types/document-types';

export const useDocumentService = () => {
  const {
    getAll: getAllDocuments,
    getById: getDocumentById,
    add: addDocument,
    update: updateDocument,
    remove: deleteDocument,
    set: setDocument,
  } = useFirestore(COLLECTIONS.DOCUMENTS);

  // File Management
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
      
      const result = await addDocument(newDoc);
      toast.success(`Document "${file.name}" téléversé avec succès`);
      return result as DocumentFile;
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

  const getAllUserDocuments = async (userId: string, status: 'active' | 'archived' | 'all' = 'active'): Promise<DocumentFile[]> => {
    try {
      // In a real implementation, we would use constraints to filter by userId and status
      const allDocs = await getAllDocuments();
      return allDocs.filter(doc => {
        if (status === 'all') {
          return true;
        }
        return doc.status === status && 
               (doc.createdBy === userId || 
                doc.permissions.some(p => p.userId === userId));
      }) as DocumentFile[];
    } catch (error) {
      console.error('Error getting documents:', error);
      toast.error('Erreur lors de la récupération des documents');
      return [];
    }
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

  // Archive Management
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

  // Search
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

  // Settings
  const getDocumentSettings = async (): Promise<DocumentSettings | null> => {
    try {
      const settings = await getDocumentById('settings') as DocumentSettings;
      if (!settings) {
        // Create default settings if none exist
        const defaultSettings: DocumentSettings = {
          id: 'settings',
          autoArchiveDays: 90,
          maxStoragePerUser: 1024 * 1024 * 1024, // 1GB
          allowedFormats: ['pdf', 'docx', 'xlsx', 'jpg', 'png'],
          encryptionEnabled: true,
          emailNotifications: true,
          updatedAt: new Date()
        };
        
        await setDocument('settings', defaultSettings);
        return defaultSettings;
      }
      
      return settings;
    } catch (error) {
      console.error('Error getting document settings:', error);
      toast.error('Erreur lors de la récupération des paramètres');
      return null;
    }
  };

  const updateDocumentSettings = async (settings: Partial<DocumentSettings>): Promise<DocumentSettings | null> => {
    try {
      const currentSettings = await getDocumentSettings();
      if (!currentSettings) {
        toast.error('Paramètres non trouvés');
        return null;
      }
      
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        updatedAt: new Date()
      };
      
      await setDocument('settings', updatedSettings);
      toast.success('Paramètres mis à jour avec succès');
      return updatedSettings;
    } catch (error) {
      console.error('Error updating document settings:', error);
      toast.error('Erreur lors de la mise à jour des paramètres');
      return null;
    }
  };

  // Permissions
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
    uploadDocument,
    uploadMultipleDocuments,
    getAllUserDocuments,
    getDocumentById,
    createVersion,
    archiveDocument,
    restoreDocument,
    searchDocuments,
    getDocumentSettings,
    updateDocumentSettings,
    updateDocumentPermissions,
    deleteDocument
  };
};
