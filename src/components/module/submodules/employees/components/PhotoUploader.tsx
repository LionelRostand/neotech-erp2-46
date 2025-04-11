
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { storage, db } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { updateEmployee, getEmployee } from '../services/employeeService';

interface PhotoUploaderProps {
  employeeId: string;
  currentPhoto: string;
  employeeName: string;
  onPhotoUpdated: (photoURL: string) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  employeeId,
  currentPhoto,
  employeeName,
  onPhotoUpdated
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(currentPhoto);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [employeeIdDisplay, setEmployeeIdDisplay] = useState(employeeId);

  useEffect(() => {
    if (currentPhoto && currentPhoto !== photoURL) {
      setPhotoURL(currentPhoto);
    }
    if (employeeId) {
      setEmployeeIdDisplay(employeeId);
    }
  }, [currentPhoto, employeeId, photoURL]);

  const checkEmployeeExists = async (empId: string) => {
    try {
      if (!empId) {
        console.error("ID d'employé manquant");
        toast.error("Erreur: ID d'employé manquant");
        return false;
      }
      
      console.log(`Vérification de l'employé ID ${empId} avant mise à jour de photo`);
      
      // Vérification simplifiée: on va juste essayer d'obtenir l'employé directement
      const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, empId);
      const docSnap = await getDoc(docRef);
      
      const exists = docSnap.exists();
      console.log(`L'employé ${empId} existe: ${exists}`);
      
      // Si l'employé n'existe pas dans la base de données, on retourne false
      if (!exists) {
        console.error(`Employé avec ID ${empId} non trouvé dans la base de données`);
        console.error(`Collection: ${COLLECTIONS.HR.EMPLOYEES}, ID: ${empId}`);
        toast.error(`Erreur: Employé avec ID ${empId} non trouvé. Vérifiez l'ID ou demandez à l'administrateur.`);
        return false;
      }
      
      console.log(`Employé ${empId} trouvé avec succès`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'employé:", error);
      toast.error("Erreur lors de la vérification de l'employé");
      return false;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`Tentative de mise à jour de photo pour l'employé ID: ${employeeId}`);
    
    // Vérifier l'existence de l'employé
    const exists = await checkEmployeeExists(employeeId);
    if (!exists) {
      console.error(`L'employé avec ID ${employeeId} n'existe pas, impossible de téléverser la photo`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse. Taille maximum: 5MB");
      return;
    }

    setIsUploading(true);
    const previousURL = photoURL;
    let newPhotoURL = '';

    try {
      console.log(`Téléversement de la photo pour l'employé ID: ${employeeId}`);
      const photoRef = ref(storage, `employees/${employeeId}/profile-photo`);
      await uploadBytes(photoRef, file);
      newPhotoURL = await getDownloadURL(photoRef);
      console.log("Photo téléversée avec succès, URL:", newPhotoURL);
      
      // Mettre à jour l'employé avec la nouvelle photo
      await updateEmployee(employeeId, {
        photoURL: newPhotoURL,
        photo: newPhotoURL
      });
      
      // Enregistrer le document photo dans la collection hr_documents
      const docData = {
        employeeId: employeeId,
        fileUrl: newPhotoURL,
        name: `Photo de profil - ${employeeName}`,
        type: 'photo',
        date: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: 'Système',
        title: `Photo de profil - ${employeeName}`,
        uploadDate: new Date().toISOString()
      };
      
      const documentRef = doc(db, COLLECTIONS.HR.DOCUMENTS, `photo_${employeeId}`);
      await setDoc(documentRef, docData);
      
      setPhotoURL(newPhotoURL);
      onPhotoUpdated(newPhotoURL);
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la photo:", error);
      console.log(`ID de l'employé concerné: ${employeeId}`);
      setPhotoURL(previousURL);
      toast.error(`Erreur lors de la mise à jour de la photo. ID employé: ${employeeId}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    const exists = await checkEmployeeExists(employeeId);
    if (!exists) return;

    if (!photoURL) return;

    setIsUploading(true);
    const previousURL = photoURL;

    try {
      console.log(`Suppression de la photo pour l'employé ID: ${employeeId}`);
      const photoRef = ref(storage, `employees/${employeeId}/profile-photo`);
      await deleteObject(photoRef).catch(error => {
        console.warn("L'image n'existait peut-être pas dans le stockage:", error);
      });
      
      await updateEmployee(employeeId, {
        photoURL: '',
        photo: ''
      });
      
      // Marquer le document comme supprimé dans la collection hr_documents
      try {
        const docRef = doc(db, COLLECTIONS.HR.DOCUMENTS, `photo_${employeeId}`);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          await updateDoc(docRef, { 
            deleted: true,
            deletedAt: new Date().toISOString()
          });
        }
      } catch (docError) {
        console.warn("Erreur lors de la mise à jour du document photo:", docError);
      }
      
      setPhotoURL('');
      onPhotoUpdated('');
      toast.success("Photo de profil supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo:", error);
      console.log(`ID de l'employé concerné: ${employeeId}`);
      setPhotoURL(previousURL);
      toast.error(`Erreur lors de la suppression de la photo. ID employé: ${employeeId}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    return employeeName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      <div 
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <Avatar className="h-24 w-24 border-2 border-primary">
          {photoURL ? (
            <AvatarImage src={photoURL} alt={employeeName} />
          ) : null}
          <AvatarFallback className="text-lg bg-primary-50 text-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        {isHovering && !isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Camera className="h-8 w-8 text-white" />
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      <div className="mt-2 flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-1" />
          Changer
        </Button>
        
        {photoURL && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDeletePhoto}
            disabled={isUploading}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        )}
      </div>
      
      <div className="mt-1 text-xs text-gray-500">
        ID: {employeeIdDisplay}
      </div>
    </div>
  );
};

export default PhotoUploader;
