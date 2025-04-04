
import { useState } from 'react';
import { DocumentFile, DocumentPermission } from '../types/document-types';
import { toast } from 'sonner';

// This is a mock implementation. In a real application, this would connect to a backend service.
export const useDocumentService = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getAllUserDocuments = async (userId: string): Promise<DocumentFile[]> => {
    setIsLoading(true);
    try {
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const documents: DocumentFile[] = [
        {
          id: 'doc-1',
          name: 'Contrat de travail',
          type: 'application/pdf',
          size: 2500000,
          createdAt: new Date('2024-03-15'),
          updatedAt: new Date('2024-03-15'),
          createdBy: userId, // Changed from userId to createdBy
          isEncrypted: false,
          status: 'active', // Changed from isArchived to status
          path: '/mock/contrat.pdf', // Changed from fileUrl to path
          format: 'pdf', // Added format property
          versions: [], // Added versions property
          permissions: [
            {
              userId: 'user-1',
              userName: 'John Doe',
              accessLevel: 'full',
              grantedAt: new Date(),
              grantedBy: 'system',
            }
          ],
          tags: ['contrat', 'rh'],
          description: 'Contrat de travail standard', // Added description
          department: 'RH', // Added department
        },
        {
          id: 'doc-2',
          name: 'Attestation de formation',
          type: 'application/pdf',
          size: 1200000,
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date('2024-02-20'),
          createdBy: userId, // Changed from userId to createdBy
          isEncrypted: true,
          status: 'active', // Changed from isArchived to status
          path: '/mock/attestation.pdf', // Changed from fileUrl to path
          format: 'pdf', // Added format property
          versions: [], // Added versions property
          permissions: [
            {
              userId: 'user-1',
              userName: 'John Doe',
              accessLevel: 'full',
              grantedAt: new Date(),
              grantedBy: 'system',
            }
          ],
          tags: ['formation', 'attestation'],
          description: 'Attestation de formation professionnelle', // Added description
          department: 'Formation', // Added department
        }
      ];
      
      return documents;
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Une erreur est survenue lors de la récupération des documents');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const getDocumentById = async (documentId: string): Promise<DocumentFile | null> => {
    try {
      // Mock data fetch
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: documentId,
        name: 'Document requested',
        type: 'application/pdf',
        size: 1500000,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user-1', // Changed from userId to createdBy
        isEncrypted: false,
        status: 'active', // Changed from isArchived to status
        path: '/mock/document.pdf', // Changed from fileUrl to path
        format: 'pdf', // Added format property
        versions: [], // Added versions property
        permissions: [],
        tags: [],
        description: 'Document demandé', // Added description
        department: 'General', // Added department
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      toast.error('Une erreur est survenue lors de la récupération du document');
      return null;
    }
  };
  
  const uploadDocument = async (file: File, metadata: any): Promise<DocumentFile | null> => {
    setIsLoading(true);
    try {
      // In a real application, we would upload the file to storage here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful upload
      const newDocument: DocumentFile = {
        id: `doc-${Date.now()}`,
        name: metadata.title || file.name,
        type: file.type,
        size: file.size,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user', // Changed from userId to createdBy
        isEncrypted: false,
        status: 'active', // Changed from isArchived to status
        path: URL.createObjectURL(file), // Changed from fileUrl to path
        format: file.name.split('.').pop() || 'unknown', // Added format based on file extension
        versions: [], // Added versions property
        permissions: [{
          userId: 'current-user',
          userName: 'Current User',
          accessLevel: 'full',
          grantedAt: new Date(),
          grantedBy: 'system',
        }],
        tags: [metadata.documentType || 'document'],
        description: metadata.description || '', // Added description
        department: metadata.department || '', // Added department
      };
      
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Une erreur est survenue lors du téléversement du document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteDocument = async (documentId: string): Promise<boolean> => {
    try {
      // In a real application, we would delete the file from storage here
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful delete
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Une erreur est survenue lors de la suppression du document');
      return false;
    }
  };
  
  const updateDocumentPermissions = async (documentId: string, permissions: DocumentPermission[]): Promise<boolean> => {
    try {
      // In a real application, we would update the permissions in the database
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful update
      return true;
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Une erreur est survenue lors de la mise à jour des permissions');
      return false;
    }
  };
  
  return {
    isLoading,
    getAllUserDocuments,
    getDocumentById,
    uploadDocument,
    deleteDocument,
    updateDocumentPermissions
  };
};
