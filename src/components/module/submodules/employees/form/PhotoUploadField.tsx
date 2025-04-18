
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
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
  const form = useFormContext();

  useEffect(() => {
    if (defaultPhotoUrl) {
      setPreviewUrl(defaultPhotoUrl);
    }
  }, [defaultPhotoUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        if (base64Data) {
          setPreviewUrl(base64Data);
          
          // Set the photo value as a string (base64)
          form.setValue('photo', base64Data);
          
          // Also set the photoMeta with all required fields
          form.setValue('photoMeta', {
            fileName: file.name || `photo_${Date.now()}.jpg`,         // Required field
            fileType: file.type || 'image/jpeg',         // Required field
            fileSize: file.size || 100000,         // Required field
            updatedAt: new Date().toISOString(), // Required field
            data: base64Data            // Optional field
          });
        }
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        console.error('Erreur lors de la lecture du fichier');
        toast.error('Erreur lors du traitement de l\'image');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      toast.error('Erreur lors du traitement de l\'image');
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
          <AvatarFallback className="bg-primary/10">
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
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadField;
