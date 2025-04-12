
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
        const result = e.target?.result as string;
        // Store both the base64 data and file metadata
        onChange({
          data: result,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          updatedAt: new Date().toISOString()
        });
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
    <FormField
      name="photo"
      render={({ field }) => (
        <FormItem className="text-center">
          <FormLabel className="block mb-2">Photo de profil</FormLabel>
          <FormControl>
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
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, field.onChange)}
                    disabled={isUploading}
                  />
                </Button>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhotoUploadField;
