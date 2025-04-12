
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  DocumentReference,
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Document } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Récupérer les documents d'un employé
export const getEmployeeDocuments = async (employeeId: string): Promise<Document[]> => {
  try {
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (employeeDoc.exists()) {
      const employeeData = employeeDoc.data();
      // Si les documents existent et sont un tableau, les retourner, sinon retourner un tableau vide
      return employeeData.documents && Array.isArray(employeeData.documents) 
        ? employeeData.documents 
        : [];
    }
    
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    throw error;
  }
};

// Ajouter un document à un employé et à la collection hr_documents
export const addEmployeeDocument = async (employeeId: string, document: Document): Promise<void> => {
  try {
    console.log(`Ajout d'un document pour l'employé ${employeeId}:`, document);
    
    // Vérifier d'abord si l'employé existe
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId) as DocumentReference<any>;
    const employeeDoc = await getDoc(employeeRef);
    
    if (!employeeDoc.exists()) {
      throw new Error(`L'employé avec l'ID ${employeeId} n'existe pas`);
    }
    
    // Ajouter un identifiant unique au document s'il n'en a pas déjà un
    if (!document.id) {
      document.id = `doc_${Date.now()}`;
    }
    
    // Ajouter la date actuelle si elle n'existe pas
    if (!document.date) {
      document.date = new Date().toISOString();
    }
    
    // Si nous n'avons pas d'URL de fichier (à cause des problèmes CORS) mais que nous avons les données
    // locales, indiquez-le dans le type de document
    if (!document.fileUrl && (document.fileHex || document.fileData)) {
      document.type = document.type + ' (stocké localement)';
    }
    
    // Ajouter l'ID de l'employé au document
    document.employeeId = employeeId;
    
    // Récupérer les documents existants pour vérifier si un document avec le même ID existe déjà
    const existingDocs = await getEmployeeDocuments(employeeId);
    const documentExists = existingDocs.some(doc => doc.id === document.id);
    
    if (documentExists) {
      console.log(`Document avec ID ${document.id} existe déjà, mise à jour skippée`);
      return;
    }
    
    // Ajouter le document au tableau des documents de l'employé sans modifier d'autres champs
    await updateDoc(employeeRef, {
      documents: arrayUnion(document),
      updatedAt: new Date().toISOString() // Mettre à jour la date de modification
    });
    
    // Également enregistrer une référence dans la collection hr_documents
    try {
      const hrDocumentsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
      await addDoc(hrDocumentsRef, {
        ...document,
        employeeId,
        employeeName: `${employeeDoc.data().firstName} ${employeeDoc.data().lastName}`,
        department: employeeDoc.data().department || '',
        uploadDate: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      console.log(`Document ajouté à la collection hr_documents pour l'employé ${employeeId}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout dans hr_documents:", error);
      // On continue même en cas d'erreur pour ne pas bloquer l'ajout au profil employé
    }
    
    console.log(`Document ajouté avec succès pour l'employé ${employeeId}`);
  } catch (error) {
    console.error("Erreur lors de l'ajout du document:", error);
    throw error;
  }
};

// Supprimer un document d'un employé
export const removeEmployeeDocument = async (employeeId: string, documentId: string): Promise<void> => {
  try {
    const employeeRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employeeId);
    const employeeDoc = await getDoc(employeeRef);
    
    if (employeeDoc.exists()) {
      const employeeData = employeeDoc.data();
      
      if (employeeData.documents && Array.isArray(employeeData.documents)) {
        const documentToRemove = employeeData.documents.find((doc: Document) => doc.id === documentId);
        
        if (documentToRemove) {
          // Supprimer le document du tableau des documents de l'employé
          await updateDoc(employeeRef, {
            documents: arrayRemove(documentToRemove),
            updatedAt: new Date().toISOString() // Mettre à jour la date de modification
          });
          
          // Essayer de supprimer également de la collection hr_documents
          try {
            // Rechercher le document dans hr_documents par son ID
            const docsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
            const q = await collection(db, COLLECTIONS.HR.DOCUMENTS)
              .where('id', '==', documentId)
              .where('employeeId', '==', employeeId)
              .get();
            
            if (!q.empty) {
              // Supprimer chaque résultat correspondant
              for (const docRef of q.docs) {
                await deleteDoc(doc(db, COLLECTIONS.HR.DOCUMENTS, docRef.id));
              }
              console.log(`Document ${documentId} supprimé de hr_documents`);
            }
          } catch (error) {
            console.error("Erreur lors de la suppression dans hr_documents:", error);
            // On continue malgré l'erreur
          }
          
          console.log(`Document ${documentId} supprimé avec succès pour l'employé ${employeeId}`);
        } else {
          console.warn(`Document ${documentId} non trouvé pour l'employé ${employeeId}`);
        }
      }
    } else {
      console.warn(`Employé avec ID ${employeeId} non trouvé lors de la suppression du document`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    throw error;
  }
};

// Récupérer les types de documents disponibles
export const getDocumentTypes = async (): Promise<string[]> => {
  // Pour l'instant, nous utilisons une liste statique
  // Plus tard, cela pourrait venir de la base de données
  return [
    'Contrat de travail',
    'Avenant',
    'Certificat de travail',
    'Diplôme',
    'Attestation',
    'Facture',
    'Note de frais',
    'Fiche de paie',
    'CV',
    'Lettre de motivation',
    "Pièce d'identité",
    'Permis de conduire',
    'Visa',
    'Carte de séjour',
    'Autre'
  ];
};
