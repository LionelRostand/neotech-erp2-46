
import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  getDoc, 
  arrayUnion,
  Timestamp,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocumentToEmployee } from './employeeService';

export interface EmployeeDocument {
  id?: string;
  name: string;
  date: string;
  type: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  employeeId?: string;
  uploadedBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Vérifie si un employé existe dans la base de données
 */
export const checkEmployeeExists = async (employeeId: string): Promise<boolean> => {
  try {
    if (!employeeId) {
      console.error("Erreur: ID d'employé manquant");
      return false;
    }
    
    const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
    }
    
    return docSnap.exists();
  } catch (error) {
    console.error("Erreur lors de la vérification de l'employé:", error);
    return false;
  }
};

/**
 * Récupère les documents d'un employé depuis la collection hr_documents
 */
export const getEmployeeDocuments = async (employeeId: string): Promise<EmployeeDocument[]> => {
  try {
    console.log(`Récupération des documents pour l'employé: ${employeeId}`);
    
    if (!employeeId) {
      console.error("ID d'employé manquant");
      toast.error("Erreur: ID d'employé manquant");
      return [];
    }
    
    // 1. Vérifier d'abord si l'employé existe
    const employeeExists = await checkEmployeeExists(employeeId);
    if (!employeeExists) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      toast.error(`Erreur: Employé avec ID ${employeeId} non trouvé`);
      return [];
    }
    
    // 2. Récupérer les documents de l'employé dans la collection hr_documents
    const documentsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
    const q = query(documentsRef, where("employeeId", "==", employeeId));
    
    const querySnapshot = await getDocs(q);
    const documents: EmployeeDocument[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      documents.push({
        id: doc.id,
        name: data.name || 'Document sans nom',
        date: data.date || new Date().toISOString(),
        type: data.type || 'autre',
        fileUrl: data.fileUrl || '',
        fileType: data.fileType || '',
        fileSize: data.fileSize || 0,
        employeeId: data.employeeId || employeeId,
        uploadedBy: data.uploadedBy || 'Système'
      });
    });
    
    console.log(`${documents.length} documents récupérés pour l'employé ${employeeId}`);
    return documents;
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    toast.error("Erreur lors de la récupération des documents");
    return [];
  }
};

/**
 * Téléverse un document pour un employé
 */
export const uploadEmployeeDocument = async (
  employeeId: string,
  file: File,
  documentName: string,
  documentType: string
): Promise<EmployeeDocument | null> => {
  try {
    console.log(`Téléversement de document pour l'employé: ${employeeId}`);
    
    if (!employeeId) {
      console.error("ID d'employé manquant");
      toast.error("Erreur: ID d'employé manquant");
      return null;
    }
    
    // 1. Vérifier d'abord si l'employé existe
    const employeeExists = await checkEmployeeExists(employeeId);
    if (!employeeExists) {
      console.error(`Employé avec ID ${employeeId} non trouvé`);
      toast.error(`Erreur: Employé avec ID ${employeeId} non trouvé`);
      return null;
    }
    
    // 2. Téléverser le fichier sur Firebase Storage
    const storageRef = ref(storage, `employees/${employeeId}/documents/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    
    // 3. Créer un nouveau document dans la collection hr_documents
    const now = new Date().toISOString();
    const documentData: EmployeeDocument = {
      name: documentName,
      type: documentType,
      date: now,
      fileUrl: fileUrl,
      fileType: file.type,
      fileSize: file.size,
      employeeId: employeeId,
      uploadedBy: 'Utilisateur',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Option 1: Utiliser addDoc pour laisser Firebase générer un ID
    const docRef = await addDoc(collection(db, COLLECTIONS.HR.DOCUMENTS), documentData);
    const newDocumentId = docRef.id;
    
    // 4. Ajouter également le document à l'array documents de l'employé
    const success = await addDocumentToEmployee(
      employeeId, 
      newDocumentId, 
      {
        name: documentName,
        type: documentType,
        date: now,
        fileUrl: fileUrl
      }
    );
    
    if (!success) {
      console.warn(`Document créé dans hr_documents mais non ajouté à l'employé ${employeeId}`);
    }
    
    // 5. Retourner le document créé avec son ID
    return {
      ...documentData,
      id: newDocumentId
    };
  } catch (error) {
    console.error("Erreur lors du téléversement du document:", error);
    toast.error("Erreur lors du téléversement du document");
    return null;
  }
};

/**
 * Supprime un document d'un employé
 */
export const deleteEmployeeDocument = async (documentId: string, employeeId: string, fileUrl?: string): Promise<boolean> => {
  try {
    if (!documentId) {
      console.error("ID de document manquant");
      return false;
    }
    
    // 1. Supprimer le document de la collection hr_documents
    const documentRef = doc(db, COLLECTIONS.HR.DOCUMENTS, documentId);
    await setDoc(documentRef, { deleted: true, updatedAt: serverTimestamp() }, { merge: true });
    
    // 2. Si l'URL du fichier est fournie, supprimer le fichier du stockage
    if (fileUrl) {
      try {
        // Extraire le chemin de storage à partir de l'URL
        const storagePath = decodeURIComponent(fileUrl.split('/o/')[1].split('?')[0]);
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      } catch (storageError) {
        console.error("Erreur lors de la suppression du fichier du stockage:", storageError);
        // Continuer même si la suppression du fichier échoue
      }
    }
    
    // 3. Si l'ID de l'employé est fourni, mettre à jour l'employé pour marquer le document comme supprimé
    if (employeeId) {
      const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
      const employeeDoc = await getDoc(employeeRef);
      
      if (employeeDoc.exists()) {
        const employeeData = employeeDoc.data();
        const documents = employeeData.documents || [];
        
        // Filtrer le document supprimé des documents de l'employé
        const updatedDocuments = documents.map((doc: any) => 
          doc.id === documentId ? { ...doc, deleted: true } : doc
        );
        
        await updateDoc(employeeRef, { 
          documents: updatedDocuments,
          updatedAt: serverTimestamp()
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    return false;
  }
};
