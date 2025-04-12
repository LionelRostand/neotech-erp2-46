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
  serverTimestamp,
  deleteDoc,
  query,
  where,
  getDocs
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
    
    // Ajouter l'ID de l'employé au document
    document.employeeId = employeeId;
    
    // Récupérer les documents existants pour vérifier si un document avec le même ID existe déjà
    const existingDocs = await getEmployeeDocuments(employeeId);
    const documentExists = existingDocs.some(doc => doc.id === document.id);
    
    if (documentExists) {
      console.log(`Document avec ID ${document.id} existe déjà, mise à jour skippée`);
      return;
    }
    
    // Stocker d'abord les données complètes dans hr_documents (avec les données binaires)
    let documentRef;
    try {
      const hrDocumentsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
      const documentData = {
        ...document,
        employeeId,
        employeeName: `${employeeDoc.data().firstName} ${employeeDoc.data().lastName}`,
        department: employeeDoc.data().department || '',
        uploadDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        binaryData: true,
        storedInHrDocuments: true
      };
      
      // Ajouter le document complet dans hr_documents
      documentRef = await addDoc(hrDocumentsRef, documentData);
      console.log(`Document complet ajouté à hr_documents avec ID: ${documentRef.id}`);
      
      // Stocker l'ID du document hr_documents dans l'objet document
      document.documentId = documentRef.id;
      document.storedInHrDocuments = true;
      
    } catch (error) {
      console.error("Erreur lors de l'ajout dans hr_documents:", error);
      // On continue même en cas d'erreur pour ne pas bloquer l'ajout au profil employé
    }
    
    // Créer une version allégée du document sans les données binaires pour hr_employees
    const documentReference: Document = {
      id: document.id,
      name: document.name,
      type: document.type,
      date: document.date,
      fileType: document.fileType,
      fileSize: document.fileSize,
      filePath: document.filePath,
      fileUrl: document.fileUrl,
      storedInFirebase: document.storedInFirebase,
      employeeId: employeeId,
      documentId: documentRef?.id, // Référence à hr_documents
      storedInHrDocuments: true
    };
    
    // Ajouter la référence de document au tableau des documents de l'employé
    await updateDoc(employeeRef, {
      documents: arrayUnion(documentReference),
      updatedAt: new Date().toISOString() // Mettre à jour la date de modification
    });
    
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
          
          // Supprimer également de la collection hr_documents si référencé
          if (documentToRemove.documentId) {
            try {
              // Supprimer directement par l'ID hr_documents
              await deleteDoc(doc(db, COLLECTIONS.HR.DOCUMENTS, documentToRemove.documentId));
              console.log(`Document ${documentToRemove.documentId} supprimé de hr_documents`);
            } catch (error) {
              console.error("Erreur lors de la suppression directe dans hr_documents:", error);
            }
          } else {
            // Rechercher le document dans hr_documents par son ID
            try {
              const docsRef = collection(db, COLLECTIONS.HR.DOCUMENTS);
              const q = query(docsRef, 
                where('id', '==', documentId),
                where('employeeId', '==', employeeId)
              );
              
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                // Supprimer chaque résultat correspondant
                querySnapshot.forEach(async (docRef) => {
                  await deleteDoc(doc(db, COLLECTIONS.HR.DOCUMENTS, docRef.id));
                });
                console.log(`Document ${documentId} supprimé de hr_documents`);
              }
            } catch (error) {
              console.error("Erreur lors de la suppression dans hr_documents:", error);
            }
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
    "Pièce d'identité',
    'Permis de conduire',
    'Visa',
    'Carte de séjour',
    'Autre'
  ];
};
