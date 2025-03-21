
import { useState } from 'react';
import { SalonStylist } from '../../types/salon-types';

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  specialists: string[];
}

interface ServiceFormErrors {
  name?: string;
  price?: string;
  duration?: string;
  category?: string;
}

export const useServiceForm = () => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    category: '',
    specialists: []
  });

  const [formErrors, setFormErrors] = useState<ServiceFormErrors>({});

  // Mock stylists data that would come from an API
  const stylists: SalonStylist[] = [
    { id: "1", firstName: "Alexandra", lastName: "Dupont", email: "alexandra@salon.com", phone: "06 12 34 56 78", specialties: ["Coloration", "Coupe Femme"], schedule: [] },
    { id: "2", firstName: "Nicolas", lastName: "Martin", email: "nicolas@salon.com", phone: "06 23 45 67 89", specialties: ["Barbe", "Coupe Homme"], schedule: [] },
    { id: "3", firstName: "Sophie", lastName: "Petit", email: "sophie@salon.com", phone: "06 34 56 78 90", specialties: ["Chignon", "Mariage"], schedule: [] },
    { id: "4", firstName: "Thomas", lastName: "Dubois", email: "thomas@salon.com", phone: "06 45 67 89 01", specialties: ["Techniques", "Extensions"], schedule: [] }
  ];

  const handleChange = (field: keyof ServiceFormData, value: string | string[]) => {
    const updatedData = { ...formData };
    
    if (field === 'price' || field === 'duration') {
      const numValue = value === '' ? 0 : parseFloat(value as string);
      updatedData[field] = numValue;
    } else if (field === 'specialists') {
      // Ensure specialists is always treated as an array
      updatedData.specialists = Array.isArray(value) ? value : [];
    } else {
      // For other string fields
      updatedData[field as 'name' | 'description' | 'category'] = value as string;
    }

    setFormData(updatedData);
    validate(field, updatedData[field]);
  };

  const validate = (field: keyof ServiceFormData, value: any): boolean => {
    const errors = { ...formErrors };
    let isValid = true;

    switch (field) {
      case 'name':
        if (!value || value.trim() === '') {
          errors.name = 'Le nom du service est requis';
          isValid = false;
        } else {
          delete errors.name;
        }
        break;
        
      case 'price':
        if (value === 0 || value === '') {
          errors.price = 'Le prix est requis';
          isValid = false;
        } else if (isNaN(value) || value <= 0) {
          errors.price = 'Le prix doit être un nombre positif';
          isValid = false;
        } else {
          delete errors.price;
        }
        break;
        
      case 'duration':
        if (value === 0 || value === '') {
          errors.duration = 'La durée est requise';
          isValid = false;
        } else if (isNaN(value) || value <= 0) {
          errors.duration = 'La durée doit être un nombre positif';
          isValid = false;
        } else {
          delete errors.duration;
        }
        break;
        
      case 'category':
        if (!value || value === '') {
          errors.category = 'La catégorie est requise';
          isValid = false;
        } else {
          delete errors.category;
        }
        break;
        
      default:
        break;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateAll = (): boolean => {
    const fields: (keyof ServiceFormData)[] = ['name', 'price', 'duration', 'category'];
    let isValid = true;
    
    fields.forEach(field => {
      if (!validate(field, formData[field])) {
        isValid = false;
      }
    });
    
    return isValid;
  };

  const handleSubmit = (): boolean => {
    if (validateAll()) {
      console.log('Form submitted:', formData);
      // Here would be an API call to save the service
      // For now, we're just logging it
      return true;
    }
    return false;
  };

  const isValid = !formErrors.name && !formErrors.price && !formErrors.duration && !formErrors.category && 
                  formData.name !== '' && formData.price > 0 && formData.duration > 0 && formData.category !== '';

  return {
    formData,
    formErrors,
    stylists,
    handleChange,
    handleSubmit,
    isValid
  };
};
