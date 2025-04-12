
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export interface UploadResult {
  fileUrl: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export const useStorageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const uploadFile = async (
    file: File, 
    path: string,
    customFileName?: string
  ): Promise<UploadResult> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // Créer un nom de fichier unique
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = customFileName 
        ? `${customFileName}.${fileExtension}` 
        : `${uuidv4().substring(0, 8)}_${file.name}`;
      
      const filePath = `${path}/${fileName}`;
      console.log(`Téléversement du fichier vers ${filePath}`);

      // Créer une référence au fichier dans Storage
      const storageRef = ref(storage, filePath);
      
      // Convertir le fichier en ArrayBuffer pour l'upload binaire
      const fileBuffer = await file.arrayBuffer();
      
      // On ajoute les métadonnées CORS pour s'assurer que le fichier est accessible
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'original-filename': file.name
        }
      };
      
      // Téléverser le fichier avec les métadonnées
      const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Mettre à jour la progression
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress(progress);
            console.log(`Progression: ${progress}%`);
          },
          (error) => {
            // Gérer les erreurs
            console.error('Erreur de téléversement:', error);
            setUploadError(error);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            // Téléversement terminé avec succès
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Fichier disponible à:', downloadURL);
              
              setIsUploading(false);
              
              resolve({
                fileUrl: downloadURL,
                filePath,
                fileName,
                fileType: file.type,
                fileSize: file.size
              });
            } catch (error) {
              console.error('Erreur lors de la récupération de l\'URL:', error);
              setUploadError(error instanceof Error ? error : new Error('Erreur inconnue'));
              setIsUploading(false);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du téléversement:', error);
      setUploadError(error instanceof Error ? error : new Error('Erreur inconnue'));
      setIsUploading(false);
      throw error;
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadProgress,
    uploadError,
    resetUploadState: () => {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError(null);
    }
  };
};
