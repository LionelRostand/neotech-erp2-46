
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { storage, db } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { updateEmployee, getEmployeeById } from '../services/employeeService';

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

  // Initialiser à la valeur fournie en prop
  useEffect(() => {
    if (currentPhoto && currentPhoto !== photoURL) {
      setPhotoURL(currentPhoto);
    }
    if (employeeId) {
      setEmployeeIdDisplay(employeeId);
    }
  }, [currentPhoto, employeeId, photoURL]);

  // Vérifier que l'employé existe avant de tenter des opérations
  const checkEmployeeExists = async (empId: string) => {
    try {
      if (!empId) {
        console.error("ID d'employé manquant");
        toast.error("Erreur: ID d'employé manquant");
        return false;
      }
      
      const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, empId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.error(`Employé avec ID ${empId} non trouvé`);
        toast.error(`Erreur: Employé avec ID ${empId} non trouvé`);
        return false;
      }
      
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

    // Vérifier l'existence de l'employé d'abord
    const exists = await checkEmployeeExists(employeeId);
    if (!exists) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse. Taille maximum: 5MB");
      return;
    }

    setIsUploading(true);
    // Conserver l'URL actuelle au cas où l'upload échoue
    const previousURL = photoURL;
    let newPhotoURL = '';

    try {
      console.log(`Téléversement de la photo pour l'employé ID: ${employeeId}`);
      // Créer une référence pour le stockage Firebase
      const photoRef = ref(storage, `employees/${employeeId}/profile-photo`);
      
      // Téléverser l'image
      await uploadBytes(photoRef, file);
      
      // Obtenir l'URL de téléchargement
      newPhotoURL = await getDownloadURL(photoRef);
      console.log("Photo téléversée avec succès, URL:", newPhotoURL);
      
      // Mettre à jour l'employé dans Firestore
      // 1. Mise à jour dans la collection hr_employees
      await updateEmployee(employeeId, {
        photoURL: newPhotoURL,
        photo: newPhotoURL
      });
      
      // 2. Ajouter également dans hr_documents
      const docData = {
        employeeId: employeeId,
        fileUrl: newPhotoURL,
        name: `Photo de profil - ${employeeName}`,
        type: 'photo',
        date: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size,
        uploadedBy: 'Système',
      };
      
      try {
        // Créer ou mettre à jour le document dans hr_documents
        const documentRef = doc(db, COLLECTIONS.HR.DOCUMENTS, `photo_${employeeId}`);
        await setDoc(documentRef, docData);
      } catch (error) {
        console.error("Erreur lors de l'ajout du document photo:", error);
        // Continuer même si cette partie échoue
      }
      
      // Mettre à jour l'état et notifier parent
      setPhotoURL(newPhotoURL);
      onPhotoUpdated(newPhotoURL);
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la photo:", error);
      console.log(`ID de l'employé concerné: ${employeeId}`);
      // Conserver l'ancienne URL en cas d'échec
      setPhotoURL(previousURL);
      toast.error(`Erreur lors de la mise à jour de la photo. ID employé: ${employeeId}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    // Vérifier l'existence de l'employé d'abord
    const exists = await checkEmployeeExists(employeeId);
    if (!exists) return;

    if (!photoURL) return;

    setIsUploading(true);
    const previousURL = photoURL;

    try {
      console.log(`Suppression de la photo pour l'employé ID: ${employeeId}`);
      // Supprimer l'image du stockage Firebase
      const photoRef = ref(storage, `employees/${employeeId}/profile-photo`);
      await deleteObject(photoRef).catch(error => {
        console.warn("L'image n'existait peut-être pas dans le stockage:", error);
      });
      
      // Mettre à jour l'employé dans Firestore
      await updateEmployee(employeeId, {
        photoURL: '',
        photo: ''
      });
      
      // Supprimer également de hr_documents si présent
      try {
        const docRef = doc(db, COLLECTIONS.HR.DOCUMENTS, `photo_${employeeId}`);
        await updateDoc(docRef, { deleted: true });
      } catch (error) {
        console.warn("Le document photo n'existait peut-être pas:", error);
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
