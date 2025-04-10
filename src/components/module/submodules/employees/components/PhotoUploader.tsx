
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { updateEmployee } from '../services/employeeService';
import { Camera, Upload, X } from 'lucide-react';

interface PhotoUploaderProps {
  employeeId: string;
  currentPhoto?: string;
  employeeName: string;
  onPhotoUpdated: (photoURL: string) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  employeeId,
  currentPhoto,
  employeeName,
  onPhotoUpdated
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  
  // S'assurer que le previewPhoto est initialisé avec currentPhoto
  useEffect(() => {
    if (currentPhoto && !previewPhoto) {
      setPreviewPhoto(currentPhoto);
    }
  }, [currentPhoto, previewPhoto]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setIsUploading(true);
      
      try {
        // Créer une URL pour la prévisualisation
        const photoURL = URL.createObjectURL(file);
        setPreviewPhoto(photoURL);
        
        console.log(`Mise à jour de la photo pour l'employé ID: ${employeeId}`);
        
        // Dans un environnement réel, on téléverserait le fichier sur un stockage (Firebase Storage)
        // et on récupérerait l'URL du fichier
        
        // Mettre à jour l'employé dans Firestore avec la nouvelle URL de photo
        const success = await updateEmployee(employeeId, { 
          photo: photoURL,
          photoURL: photoURL
        });
        
        if (success) {
          console.log('Photo mise à jour avec succès');
          toast.success('Photo mise à jour avec succès');
          onPhotoUpdated(photoURL);
        } else {
          console.error('Erreur lors de la mise à jour de la photo');
          toast.error('Erreur lors de la mise à jour de la photo');
          setPreviewPhoto(currentPhoto);
        }
      } catch (error) {
        console.error('Erreur lors du téléversement de la photo:', error);
        toast.error('Erreur lors du téléversement de la photo');
        setPreviewPhoto(currentPhoto);
      } finally {
        setIsUploading(false);
        // Réinitialiser l'input file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemovePhoto = async () => {
    if (isUploading) return;
    
    setIsUploading(true);
    
    try {
      console.log(`Suppression de la photo pour l'employé ID: ${employeeId}`);
      
      // Mettre à jour l'employé dans Firestore sans photo
      const success = await updateEmployee(employeeId, { 
        photo: '',
        photoURL: ''
      });
      
      if (success) {
        console.log('Photo supprimée avec succès');
        toast.success('Photo supprimée avec succès');
        setPreviewPhoto(null);
        onPhotoUpdated('');
      } else {
        console.error('Erreur lors de la suppression de la photo');
        toast.error('Erreur lors de la suppression de la photo');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la photo:', error);
      toast.error('Erreur lors de la suppression de la photo');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Obtenir les initiales de l'employé pour le fallback
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };
  
  // Photo actuelle à afficher (priorité au preview)
  const displayPhoto = previewPhoto || currentPhoto || '';
  
  return (
    <div className="space-y-2">
      <Avatar className="w-24 h-24 relative group">
        <AvatarImage src={displayPhoto} alt={employeeName} />
        <AvatarFallback className="text-xl">{getInitials(employeeName)}</AvatarFallback>
        
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white h-8 w-8 p-0"
            onClick={handleButtonClick}
            disabled={isUploading}
          >
            <Camera className="h-5 w-5" />
          </Button>
          
          {displayPhoto && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white h-8 w-8 p-0"
              onClick={handleRemovePhoto}
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </Avatar>
      
      <div className="flex flex-col items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <Upload className="h-3 w-3 mr-1" />
          {displayPhoto ? 'Changer' : 'Ajouter'} la photo
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PhotoUploader;
