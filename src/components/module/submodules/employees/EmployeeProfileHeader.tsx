
import React, { useState } from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useStorageUpload } from '@/hooks/storage/useStorageUpload';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee, onEmployeeUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile } = useStorageUpload();
  
  // Format address to display
  const formatAddress = (address: string | EmployeeAddress): string => {
    if (typeof address === 'string') {
      return address;
    } else {
      const { street, city, postalCode, country } = address;
      return `${street}, ${postalCode} ${city}, ${country}`;
    }
  };

  // Get employee initials for avatar fallback
  const getInitials = (): string => {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  };

  // Get status color for badge
  const getStatusColor = (): string => {
    switch (employee.status) {
      case 'active':
      case 'Actif':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'inactive':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'onLeave':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Sélectionner la meilleure source d'image disponible
  const getPhotoSource = (): string | undefined => {
    // Priorité: 1. photoData (base64), 2. photoURL ou photo
    if (employee.photoData) {
      return employee.photoData;
    } else if (employee.photoURL) {
      return employee.photoURL;
    } else if (employee.photo) {
      return employee.photo;
    }
    return undefined;
  };

  // Handle photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Show toast indicating upload start
      toast.loading('Téléversement de la photo de profil en cours...', {
        id: 'photo-upload',
        duration: 3000
      });
      
      // Upload to Firebase Storage
      const uploadPath = `hr_employees/${employee.id}/profile`;
      const result = await uploadFile(file, uploadPath, 'profile_photo');
      
      console.log('Résultat du téléversement:', result);
      
      // Mise à jour directe du document dans Firestore avec l'URL ET les données binaires
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, {
        photoURL: result.fileUrl,
        photo: result.fileUrl,
        // Stocker les données binaires dans un champ dédié
        photoData: result.fileData,
        photoMeta: {
          fileName: result.fileName,
          fileType: result.fileType,
          fileSize: result.fileSize,
          updatedAt: new Date().toISOString()
        }
      });
      
      console.log('Photo et données binaires mises à jour dans Firestore:', result.fileUrl);
      
      // Update local state if callback provided
      if (onEmployeeUpdate) {
        onEmployeeUpdate({
          ...employee,
          photoURL: result.fileUrl,
          photo: result.fileUrl,
          photoData: result.fileData
        });
      }
      
      toast.success('Photo de profil mise à jour avec succès', {
        id: 'photo-upload'
      });
    } catch (error) {
      console.error('Erreur lors du téléversement de la photo:', error);
      toast.error('Erreur lors du téléversement de la photo', {
        id: 'photo-upload'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={getPhotoSource()} 
                alt={`${employee.firstName} ${employee.lastName}`} 
              />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
            
            <label 
              htmlFor="profile-photo-upload" 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-white" />
              )}
            </label>
            <input 
              id="profile-photo-upload" 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              disabled={isUploading}
              className="hidden" 
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
            <p className="text-muted-foreground">{employee.position || employee.title}</p>
            
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="outline" className={getStatusColor()}>
                {employee.status === 'active' || employee.status === 'Actif' ? 'Actif' : 
                 employee.status === 'inactive' ? 'Inactif' : 
                 employee.status === 'onLeave' ? 'En congé' : employee.status}
              </Badge>
              <Badge variant="outline">{employee.department}</Badge>
              <Badge variant="outline">{employee.contract || 'CDI'}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{employee.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{employee.phone}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formatAddress(employee.address)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileHeader;
