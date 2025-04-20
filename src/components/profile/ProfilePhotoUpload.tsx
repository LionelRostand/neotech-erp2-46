
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const ProfilePhotoUpload = () => {
  const { userData, currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

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
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        // Save photo metadata to Firestore
        const photoDoc = {
          userId: currentUser.uid,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          data: base64Data,
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, COLLECTIONS.USERS.PHOTOS, currentUser.uid), photoDoc);
        toast.success('Photo de profil mise à jour');
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error('Erreur lors du chargement de l\'image');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Erreur lors de la mise à jour de la photo:', error);
      toast.error('Erreur lors de la mise à jour de la photo');
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-lg font-semibold">Photo de profil</h2>
      
      <Avatar className="h-32 w-32">
        <AvatarImage src={userData?.profileImageUrl} alt={userData?.firstName} />
        <AvatarFallback>
          <User className="h-16 w-16" />
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="relative"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Chargement...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Changer la photo
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploading}
          />
        </Button>
      </div>
    </div>
  );
};
