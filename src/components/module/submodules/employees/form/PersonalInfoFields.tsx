
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div>
          <Label htmlFor="lastName">Nom *</Label>
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
          <Label htmlFor="firstName">Prénom *</Label>
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
        
        {/* Email personnel */}
        <div>
          <Label htmlFor="email">Email personnel *</Label>
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
            type="tel" 
            placeholder="+33 XX XX XX XX XX" 
            {...register('phone')} 
          />
        </div>
        
        {/* Date de naissance */}
        <div>
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input 
            id="birthDate" 
            type="date" 
            {...register('birthDate')} 
          />
        </div>
      </div>

      <h4 className="text-md font-medium mt-4">Adresse</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Numéro et nom de rue */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="streetNumber">Numéro</Label>
            <Input 
              id="streetNumber"
              placeholder="123" 
              {...register('streetNumber')}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="streetName">Rue</Label>
            <Input 
              id="streetName"
              placeholder="Nom de rue" 
              {...register('streetName')}
            />
          </div>
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
        
        {/* Code postal */}
        <div>
          <Label htmlFor="zipCode">Code postal</Label>
          <Input 
            id="zipCode" 
            placeholder="75000" 
            {...register('zipCode')} 
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

      {/* Photo de l'employé */}
      <div className="mt-4">
        <Label htmlFor="photo">Photo</Label>
        <Input 
          id="photo" 
          type="file" 
          accept="image/*" 
          className="cursor-pointer"
          {...register('photo')}
        />
      </div>
    </div>
  );
};

export default PersonalInfoFields;
