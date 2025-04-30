
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EmployeeFormValues } from './employeeFormSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalInfoFields = () => {
  const { register, formState: { errors } } = useFormContext<EmployeeFormValues>();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations personnelles</h3>
      
      {/* Photo upload */}
      <div className="mb-4">
        <Label htmlFor="photo">Photo</Label>
        <Input id="photo" type="file" accept="image/*" {...register('photo')} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
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
        
        {/* Prénom */}
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
        
        {/* Email */}
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
        
        {/* Téléphone */}
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone" 
            placeholder="Téléphone" 
            {...register('phone')} 
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Adresse</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Numéro de rue */}
          <div>
            <Label htmlFor="streetNumber">Numéro de rue</Label>
            <Input 
              id="streetNumber" 
              placeholder="Numéro" 
              {...register('streetNumber')} 
            />
          </div>
          
          {/* Nom de rue */}
          <div>
            <Label htmlFor="streetName">Nom de rue</Label>
            <Input 
              id="streetName" 
              placeholder="Rue" 
              {...register('streetName')} 
            />
          </div>
          
          {/* Code postal */}
          <div>
            <Label htmlFor="zipCode">Code postal</Label>
            <Input 
              id="zipCode" 
              placeholder="Code postal" 
              {...register('zipCode')} 
            />
          </div>
          
          {/* Ville */}
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input 
              id="city" 
              placeholder="Ville" 
              {...register('city')} 
            />
          </div>
          
          {/* Région */}
          <div>
            <Label htmlFor="region">Région</Label>
            <Input 
              id="region" 
              placeholder="Région" 
              {...register('region')} 
            />
          </div>
          
          {/* Pays */}
          <div>
            <Label htmlFor="country">Pays</Label>
            <Input 
              id="country" 
              placeholder="Pays" 
              {...register('country')} 
              defaultValue="France"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoFields;
