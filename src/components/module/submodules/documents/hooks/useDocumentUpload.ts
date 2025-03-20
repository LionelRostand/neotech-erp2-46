
import { useState, useCallback, useRef } from 'react';
import { DocumentFile, FileUploadState } from '../../documents/types/document-types';
import { useDocumentService } from '../../documents/services';
import { toast } from 'sonner';

export const useDocumentUpload = (
  onSuccess: (uploadedDocs: DocumentFile[]) => void
) => {
  const { uploadMultipleDocuments } = useDocumentService();
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadState[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const fileStates: FileUploadState[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));
    
    setUploadingFiles(fileStates);
    
    const updateProgress = (index: number, progress: number) => {
      setUploadingFiles(prev => {
        const newState = [...prev];
        newState[index] = { ...newState[index], progress, status: 'uploading' };
        return newState;
      });
    };
    
    const progressIntervals = Array.from(files).map((_, index) => {
      return setInterval(() => {
        updateProgress(index, Math.min(95, Math.random() * 20 + (fileStates[index]?.progress || 0)));
      }, 300);
    });
    
    try {
      const uploadedDocs = await uploadMultipleDocuments(Array.from(files));
      
      progressIntervals.forEach(clearInterval);
      
      setUploadingFiles(prev => prev.map((file, index) => ({
        ...file,
        progress: 100,
        status: uploadedDocs[index] ? 'success' : 'error',
        errorMessage: uploadedDocs[index] ? undefined : 'Erreur lors du téléversement'
      })));
      
      onSuccess(uploadedDocs.filter(Boolean) as DocumentFile[]);
      
      setTimeout(() => {
        setUploadingFiles([]);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Erreur lors du téléversement des fichiers');
      
      progressIntervals.forEach(clearInterval);
      
      setUploadingFiles(prev => prev.map(file => ({
        ...file,
        progress: 100,
        status: 'error',
        errorMessage: 'Erreur lors du téléversement'
      })));
    }
  }, [uploadMultipleDocuments, onSuccess]);

  return {
    uploadingFiles,
    fileInputRef,
    triggerFileInput,
    handleFileUpload
  };
};
