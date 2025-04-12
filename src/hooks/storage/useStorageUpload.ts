
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
  fileData?: string; // Base64 data for the file
}

export const useStorageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  // Fonction pour convertir le fichier en Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

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

      // Convertir le fichier en Base64 pour le stockage dans Firestore
      const base64Data = await convertFileToBase64(file);
      console.log('Fichier converti en Base64 pour stockage binaire');

      // Créer une référence au fichier dans Storage
      const storageRef = ref(storage, filePath);
      
      // Convertir le fichier en ArrayBuffer pour l'upload binaire
      const fileBuffer = await file.arrayBuffer();
      
      // Définir les métadonnées avec les en-têtes CORS appropriés
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
          'Cache-Control': 'public, max-age=31536000',
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
            
            // Détecter si c'est une erreur CORS
            const errorMessage = error.message || '';
            if (errorMessage.includes('CORS') || error.code === 'storage/unauthorized') {
              console.error('Erreur CORS détectée:', error);
              toast.error('Erreur d\'accès au stockage. Problème de CORS détecté.');
            } else {
              toast.error(`Erreur de téléversement: ${errorMessage}`);
            }
            
            setUploadError(error);
            setIsUploading(false);
            reject(error);
          },
          async () => {
            // Téléversement terminé avec succès
            try {
              // Utiliser une technique différente pour contourner les erreurs CORS lors de la récupération de l'URL
              let downloadURL = '';
              try {
                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              } catch (urlError) {
                console.warn('Erreur lors de la récupération de l\'URL standard, utilisation de l\'URL générée:', urlError);
                // Créer manuellement l'URL en cas d'échec de getDownloadURL
                const bucket = storage.bucket || 'neotech-erp.appspot.com';
                downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filePath)}?alt=media`;
              }
              
              console.log('Fichier disponible à:', downloadURL);
              
              setIsUploading(false);
              
              resolve({
                fileUrl: downloadURL,
                filePath,
                fileName,
                fileType: file.type,
                fileSize: file.size,
                fileData: base64Data // Ajouter les données binaires en Base64
              });
            } catch (error) {
              console.error('Erreur lors de la récupération de l\'URL:', error);
              
              if (error instanceof Error && error.message.includes('CORS')) {
                toast.error('Erreur d\'accès au fichier téléversé. Problème de CORS détecté.');
              } else {
                toast.error('Erreur lors de la récupération de l\'URL du fichier');
              }
              
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
