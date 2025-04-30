
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormValues } from './employeeFormSchema';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const PersonalInfoFields = () => {
  const { register, formState: { errors }, setValue, watch } = useFormContext<EmployeeFormValues>();
  const photoPreview = watch('photo');
  
  // Gérer le téléversement d'image
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Limiter la taille du fichier à 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('La taille du fichier doit être inférieure à 2MB');
      return;
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Seules les images sont acceptées');
      return;
    }
    
    // Lire le fichier et stocker en base64
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setValue('photo', event.target.result as string);
        
        // Enregistrer les métadonnées du fichier
        setValue('photoMeta', {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          updatedAt: new Date().toISOString(),
          data: event.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations personnelles</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Photo de l'employé */}
        <div className="sm:col-span-2 flex flex-col items-center space-y-3">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center relative">
            {photoPreview ? (
              <img src={photoPreview} alt="Photo de profil" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-2xl font-light">Photo</div>
            )}
          </div>
          
          <div>
            <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Téléverser une photo
            </Button>
            <input 
              id="photo-upload" 
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
        
        {/* Nom et prénom */}
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input 
            id="lastName" 
            placeholder="Nom" 
            {...register('lastName')} 
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input 
            id="firstName" 
            placeholder="Prénom" 
            {...register('firstName')} 
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        {/* Email et téléphone */}
        <div>
          <Label htmlFor="email">Email personnel</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="email@exemple.com" 
            {...register('email')} 
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone" 
            placeholder="Téléphone" 
            {...register('phone')} 
          />
        </div>
        
        {/* Adresse */}
        <div className="sm:col-span-2">
          <Label htmlFor="streetName">Adresse</Label>
          <Input 
            id="streetName" 
            placeholder="Adresse" 
            {...register('streetName')} 
          />
        </div>
        
        {/* Ville et code postal */}
        <div>
          <Label htmlFor="city">Ville</Label>
          <Input 
            id="city" 
            placeholder="Ville" 
            {...register('city')} 
          />
        </div>
        
        <div>
          <Label htmlFor="zipCode">Code postal</Label>
          <Input 
            id="zipCode" 
            placeholder="Code postal" 
            {...register('zipCode')} 
          />
        </div>
        
        {/* Région et pays */}
        <div>
          <Label htmlFor="region">Région</Label>
          <Input 
            id="region" 
            placeholder="Région" 
            {...register('region')} 
          />
        </div>
        
        <div>
          <Label htmlFor="country">Pays</Label>
          <Input 
            id="country" 
            placeholder="Pays" 
            {...register('country')} 
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
