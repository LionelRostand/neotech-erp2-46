import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadEmployeePhoto } from '../services/employeeService';

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
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Reset preview when currentPhoto changes
    if (currentPhoto) {
      setPhotoPreview(null);
    }
  }, [currentPhoto]);
  
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Store selected file
    setSelectedFile(file);
  };
  
  const cancelUpload = () => {
    setPhotoPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const uploadPhoto = async () => {
    if (!selectedFile) return;
    
    try {
      setUploading(true);
      console.log(`Début du téléversement de la photo pour l'employé ${employeeId}`);
      
      const photoURL = await uploadEmployeePhoto(employeeId, selectedFile);
      console.log(`Photo téléversée avec succès, URL: ${photoURL}`);
      
      if (photoURL) {
        onPhotoUpdated(photoURL);
        toast.success('Photo de profil mise à jour');
        
        // Reset state
        setPhotoPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error('Erreur lors du téléversement de la photo');
      }
    } catch (error: any) {
      console.error('Erreur lors du téléversement:', error);
      toast.error(`Erreur: ${error.message || 'Impossible de téléverser la photo'}`);
    } finally {
      setUploading(false);
    }
  };
  
  // Get initials for fallback avatar
  const getInitials = () => {
    if (!employeeName) return 'UN';
    
    const nameParts = employeeName.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return nameParts[0].slice(0, 2).toUpperCase();
  };
  
  // Determine which image to display
  const getImageSource = () => {
    // If there's a preview, show that first
    if (photoPreview) {
      return photoPreview;
    }
    
    // Otherwise show current photo if available
    if (currentPhoto) {
      return currentPhoto;
    }
    
    // No image available
    return null;
  };
  
  // Generate a cache-busting URL to prevent stale images
  const getImageUrl = (url: string) => {
    if (!url) return '';
    
    // Add a timestamp query parameter to force a refresh
    const timestamp = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${timestamp}`;
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Avatar className="h-24 w-24 border border-gray-200">
        <AvatarImage 
          src={getImageUrl(getImageSource() || '')} 
          alt={employeeName} 
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '';
            console.error("Erreur de chargement de l'image:", target.src);
          }}
        />
        <AvatarFallback className="text-xl bg-blue-100 text-blue-600">{getInitials()}</AvatarFallback>
      </Avatar>
      
      {photoPreview ? (
        <div className="mt-3 flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            type="button" 
            onClick={cancelUpload}
            disabled={uploading}
          >
            <X className="h-4 w-4 mr-1" />
            Annuler
          </Button>
          
          <Button 
            size="sm" 
            variant="default" 
            type="button" 
            onClick={uploadPhoto}
            disabled={uploading}
          >
            {uploading ? 'Envoi...' : 'Enregistrer'}
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3" 
          onClick={openFileSelector}
        >
          <Upload className="h-4 w-4 mr-1" />
          Changer photo
        </Button>
      )}
    </div>
  );
};

export default PhotoUploader;
