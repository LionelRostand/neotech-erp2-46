
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
  fileHex?: string;  // Hexadecimal data for the file
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

  // Fonction pour convertir le fichier en format hexadécimal
  const convertFileToHex = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
        const hexCodes = [...bytes].map(byte => byte.toString(16).padStart(2, '0'));
        resolve(hexCodes.join(''));
      };
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
      
      // Convertir le fichier en Hexadécimal pour un stockage alternatif
      const hexData = await convertFileToHex(file);
      console.log('Fichier converti en Hexadécimal pour stockage alternatif');

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
              // En cas d'erreur CORS, nous pouvons toujours retourner les données hexadécimales et base64
              // qui ont été converties localement et n'ont pas besoin d'un accès réseau
              toast.warning('Impossible de téléverser sur Firebase Storage à cause des restrictions CORS. Utilisation du stockage local.');
              
              resolve({
                fileUrl: '', // Pas d'URL disponible
                filePath: filePath,
                fileName: fileName,
                fileType: file.type,
                fileSize: file.size,
                fileData: base64Data,
                fileHex: hexData
              });
            } else {
              toast.error(`Erreur de téléversement: ${errorMessage}`);
              setUploadError(error);
              setIsUploading(false);
              reject(error);
            }
          },
          async () => {
            // Téléversement terminé avec succès
            try {
              let downloadURL = '';
              
              try {
                // Essayer de récupérer l'URL de téléchargement
                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              } catch (urlError) {
                console.warn('Erreur lors de la récupération de l\'URL, utilisation des données locales:', urlError);
                // En cas d'échec de getDownloadURL, nous utiliserons uniquement les données locales
                downloadURL = ''; // Pas d'URL disponible
              }
              
              console.log('Téléversement terminé, données disponibles en local et via URL:', downloadURL ? 'Oui' : 'Non');
              
              setIsUploading(false);
              
              resolve({
                fileUrl: downloadURL,
                filePath,
                fileName,
                fileType: file.type,
                fileSize: file.size,
                fileData: base64Data, // Données binaires en Base64
                fileHex: hexData     // Données en format hexadécimal
              });
            } catch (error) {
              console.error('Erreur finale:', error);
              
              // Même en cas d'erreur finale, retourner les données locales
              toast.info('Le fichier a été stocké localement mais n\'est pas accessible via URL.');
              
              setIsUploading(false);
              resolve({
                fileUrl: '',
                filePath,
                fileName,
                fileType: file.type,
                fileSize: file.size,
                fileData: base64Data,
                fileHex: hexData
              });
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
