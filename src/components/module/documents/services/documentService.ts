
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS, DOCUMENT_COLLECTIONS } from '@/lib/firebase-collections';
import { useFileService } from './fileService';
import { useArchiveService } from './archiveService';
import { useSearchService } from './searchService';
import { useSettingsService } from './settingsService';
import { usePermissionService } from './permissionService';

export const useDocumentService = () => {
  const {
    getById: getDocumentById,
    remove: deleteDocument,
  } = useFirestore(DOCUMENT_COLLECTIONS.DOCUMENTS);

  // Import individual services
  const fileService = useFileService();
  const archiveService = useArchiveService();
  const searchService = useSearchService();
  const settingsService = useSettingsService();
  const permissionService = usePermissionService();

  return {
    // Document operations
    getDocumentById,
    deleteDocument,
    
    // File management
    uploadDocument: fileService.uploadDocument,
    uploadMultipleDocuments: fileService.uploadMultipleDocuments,
    createVersion: fileService.createVersion,
    
    // Archive management
    archiveDocument: archiveService.archiveDocument,
    restoreDocument: archiveService.restoreDocument,
    
    // Search operations
    getAllUserDocuments: searchService.getAllUserDocuments,
    searchDocuments: searchService.searchDocuments,
    
    // Settings management
    getDocumentSettings: settingsService.getDocumentSettings,
    updateDocumentSettings: settingsService.updateDocumentSettings,
    
    // Permissions management
    updateDocumentPermissions: permissionService.updateDocumentPermissions
  };
};
