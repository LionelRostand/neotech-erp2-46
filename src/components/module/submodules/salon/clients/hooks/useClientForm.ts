
import { useState } from 'react';
import { SalonClient } from '../../types/salon-types';

export interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  preferences: string;
  notes: string;
  preferredStylist: string;
}

export interface ClientFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

const defaultFormData: ClientFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  address: '',
  preferences: '',
  notes: '',
  preferredStylist: ''
};

export const useClientForm = (initialData?: SalonClient) => {
  const [formData, setFormData] = useState<ClientFormData>(
    initialData ? {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      phone: initialData.phone,
      birthDate: initialData.birthDate || '',
      address: initialData.address || '',
      preferences: initialData.preferences || '',
      notes: initialData.notes || '',
      preferredStylist: initialData.preferredStylist || ''
    } : defaultFormData
  );
  
  const [formErrors, setFormErrors] = useState<ClientFormErrors>({});
  
  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error on field change
    if (formErrors[field as keyof ClientFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof ClientFormErrors];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: ClientFormErrors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Le téléphone est requis';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const resetForm = () => {
    setFormData(defaultFormData);
    setFormErrors({});
  };
  
  return {
    formData,
    formErrors,
    setFormData,
    updateFormField,
    validateForm,
    resetForm
  };
};
