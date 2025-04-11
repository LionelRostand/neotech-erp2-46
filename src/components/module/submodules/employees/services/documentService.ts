
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { toast } from 'sonner';
import { getEmployee } from './employeeService';

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  date: string;
  employeeId: string;
  fileSize?: number;
  fileType?: string;
  uploadProgress?: number;
}

const DOCUMENTS_COLLECTION = 'employee_documents';

// Récupérer tous les documents d'un employé
export const getEmployeeDocuments = async (employeeId: string): Promise<EmployeeDocument[]> => {
  try {
    // Vérifier si l'employé existe d'abord
    const employee = await getEmployee(employeeId);
    if (!employee) {
      console.warn(`Aucun employé trouvé avec l'ID: ${employeeId}`);
      return [];
    }
    
    const q = query(
      collection(db, DOCUMENTS_COLLECTION),
      where('employeeId', '==', employeeId)
    );
    
    const querySnapshot = await getDocs(q);
    const documents: EmployeeDocument[] = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      } as EmployeeDocument);
    });
    
    return documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    toast.error("Erreur lors du chargement des documents");
    return [];
  }
};

// Téléverser un document pour un employé
export const uploadEmployeeDocument = async (
  file: File,
  employeeId: string,
  documentType: string,
  onProgress?: (progress: number) => void
): Promise<EmployeeDocument | null> => {
  try {
    // Vérifier si l'employé existe d'abord
    const employee = await getEmployee(employeeId);
    if (!employee) {
      throw new Error(`Employé avec ID ${employeeId} non trouvé`);
    }

    // Créer un nom de fichier unique avec timestamp pour éviter les problèmes de cache
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `employees/${employeeId}/documents/${uniqueId}_${safeFileName}`;
    
    // Créer une référence au fichier dans Firebase Storage
    const storageRef = ref(storage, storagePath);
    
    // Convertir le fichier en ArrayBuffer pour un téléversement binaire
    const arrayBuffer = await file.arrayBuffer();
    
    // Définir les métadonnées pour le fichier (IMPORTANT pour CORS)
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      }
    };
    
    // Téléverser le fichier avec suivi de progression
    const uploadTask = uploadBytesResumable(storageRef, arrayBuffer, metadata);
    
    // Créer une promesse qui sera résolue lorsque le téléversement sera terminé
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculer et reporter la progression
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`Progression du téléversement: ${progress}%`);
          
          // Appeler le callback de progression si fourni
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Gérer les erreurs de téléversement
          console.error("Erreur lors du téléversement du document:", error);
          reject(error);
        },
        async () => {
          try {
            // Téléversement terminé, obtenir l'URL de téléchargement
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Créer l'entrée du document dans Firestore
            const docData: Omit<EmployeeDocument, 'id'> = {
              name: file.name,
              type: documentType,
              fileUrl: downloadURL,
              date: new Date().toISOString(),
              employeeId: employeeId,
              fileSize: file.size,
              fileType: file.type
            };
            
            // Ajouter le document à Firestore
            const docRef = await addDoc(collection(db, DOCUMENTS_COLLECTION), docData);
            
            // Construire l'objet document complet
            const newDocument: EmployeeDocument = {
              id: docRef.id,
              ...docData
            };
            
            toast.success(`Document "${file.name}" téléversé avec succès`);
            resolve(newDocument);
          } catch (error) {
            console.error("Erreur lors de la finalisation du téléversement:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Erreur lors du téléversement du document:", error);
    toast.error("Erreur lors du téléversement du document");
    throw error;
  }
};

// Supprimer un document d'employé
export const deleteEmployeeDocument = async (documentId: string, employeeId: string): Promise<boolean> => {
  try {
    // Récupérer le document pour obtenir le chemin de stockage
    const q = query(
      collection(db, DOCUMENTS_COLLECTION),
      where('employeeId', '==', employeeId)
    );
    
    const querySnapshot = await getDocs(q);
    let documentToDelete: EmployeeDocument | null = null;
    
    querySnapshot.forEach((doc) => {
      if (doc.id === documentId) {
        documentToDelete = {
          id: doc.id,
          ...doc.data()
        } as EmployeeDocument;
      }
    });
    
    if (!documentToDelete) {
      throw new Error(`Document avec ID ${documentId} non trouvé`);
    }
    
    // Supprimer le fichier de Firebase Storage
    try {
      // Extraire le chemin du stockage à partir de l'URL
      const fileUrl = documentToDelete.fileUrl;
      const fileName = fileUrl.split('/').pop();
      const storagePath = `employees/${employeeId}/documents/${fileName}`;
      
      // Créer une référence au fichier et le supprimer
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (storageError) {
      console.warn("Impossible de supprimer le fichier du stockage:", storageError);
      // Continuer pour supprimer l'entrée de la base de données
    }
    
    // Supprimer l'entrée de la base de données
    await deleteDoc(collection(db, DOCUMENTS_COLLECTION).doc(documentId));
    
    toast.success("Document supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    toast.error("Erreur lors de la suppression du document");
    return false;
  }
};
