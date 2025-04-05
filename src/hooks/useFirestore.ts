
import { useState } from 'react';
import { addDocument, updateDocument, deleteDocument, setDocument } from './firestore/firestore-utils';
import { toast } from 'sonner';

/**
 * Hook that provides access to Firestore operations with loading and error states
 */
export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  return {
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    setDocument
  };
};

// Export default for backward compatibility
export default useFirestore;
