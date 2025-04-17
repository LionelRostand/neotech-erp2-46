
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { useStorageUpload } from '@/hooks/storage/useStorageUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, User } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadFieldProps {
  defaultPhotoUrl?: string;
}

const PhotoUploadField = ({ defaultPhotoUrl }: PhotoUploadFieldProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(defaultPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useStorageUpload();
  // Get the form context to ensure we're inside a form
  const form = useFormContext();

  // Mettre à jour le prévisualisation quand defaultPhotoUrl change
  useEffect(() => {
    if (defaultPhotoUrl) {
      setPreviewUrl(defaultPhotoUrl);
    }
  }, [defaultPhotoUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Process for storage in form data
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        if (base64Data) {
          // Stocker à la fois les données base64 et les métadonnées
          console.log("Photo convertie en base64 avec succès - Stockage dans les champs photo et photoData");
          
          // Mettre à jour plusieurs champs du formulaire
          form.setValue('photo', base64Data);
          form.setValue('photoURL', base64Data);
          form.setValue('photoData', base64Data);
          
          onChange(base64Data);
        } else {
          // En cas d'échec, on stocke au moins les métadonnées
          onChange(null);
          console.error('Échec de conversion en base64');
        }
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        console.error('Erreur lors de la lecture du fichier');
        toast.error('Erreur lors du traitement de l\'image');
        onChange(null);
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file); // Convertir en base64 URL
      
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      toast.error('Erreur lors du traitement de l\'image');
      onChange(null);
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-2 font-medium">Photo de profil</div>
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={previewUrl}
            alt="Photo de profil" 
          />
          <AvatarFallback className="bg-primary text-white text-xl">
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        
        <div className="relative">
          <Button 
            type="button"
            variant="outline"
            className="relative"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Téléversement...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Choisir une photo
              </>
            )}
            <input
              type="file"
              name="photo"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => {
                // If we're in a form context, use the form setValue method
                if (form) {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  
                  handleFileChange(e, (value) => {
                    form.setValue('photo', value);
                  });
                }
              }}
              disabled={isUploading}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadField;
