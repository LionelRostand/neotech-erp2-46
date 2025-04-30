
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { createPhotoMeta } from '../utils/photoUtils';

interface PhotoUploadFieldProps {
  defaultPhotoUrl?: string;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({ defaultPhotoUrl = '' }) => {
  const { setValue, watch } = useFormContext();
  const photoValue = watch('photo') || defaultPhotoUrl;
  const [photoUrl, setPhotoUrl] = useState<string>(defaultPhotoUrl);
  
  useEffect(() => {
    // Update photo URL when photo value changes
    if (photoValue) {
      setPhotoUrl(photoValue);
    } else {
      setPhotoUrl(defaultPhotoUrl);
    }
  }, [photoValue, defaultPhotoUrl]);
  
  // Function to handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        // Set photo URL and photo value in form
        setPhotoUrl(dataUrl);
        setValue('photo', dataUrl);
        
        // Create and set photo metadata
        const photoMeta = createPhotoMeta(dataUrl);
        setValue('photoMeta', photoMeta);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={photoUrl} />
        <AvatarFallback>Photo</AvatarFallback>
      </Avatar>
      
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Téléverser une photo
        </Button>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PhotoUploadField;
