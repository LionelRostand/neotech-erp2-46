
import { useState } from 'react';
import { SalonAppointment } from '../../types/salon-types';

export interface AppointmentFormData {
  clientId: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  duration: string;
  status: string;
  notes: string;
}

export interface AppointmentFormErrors {
  clientId?: string;
  service?: string;
  stylist?: string;
  date?: string;
  time?: string;
  duration?: string;
  status?: string;
}

const defaultFormData: AppointmentFormData = {
  clientId: '',
  service: '',
  stylist: '',
  date: '',
  time: '',
  duration: '',
  status: '',
  notes: ''
};

export const useAppointmentForm = (initialData?: SalonAppointment) => {
  const [formData, setFormData] = useState<AppointmentFormData>(
    initialData ? {
      clientId: initialData.clientId,
      service: initialData.service,
      stylist: initialData.stylist,
      date: initialData.date,
      time: initialData.time,
      duration: initialData.duration.toString(),
      status: initialData.status,
      notes: initialData.notes || ''
    } : defaultFormData
  );
  
  const [formErrors, setFormErrors] = useState<AppointmentFormErrors>({});
  
  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error on field change
    if (formErrors[field as keyof AppointmentFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof AppointmentFormErrors];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: AppointmentFormErrors = {};
    
    if (!formData.clientId) {
      errors.clientId = 'Le client est requis';
    }
    
    if (!formData.service.trim()) {
      errors.service = 'Le service est requis';
    }
    
    if (!formData.stylist.trim()) {
      errors.stylist = 'Le coiffeur est requis';
    }
    
    if (!formData.date.trim()) {
      errors.date = 'La date est requise';
    }
    
    if (!formData.time.trim()) {
      errors.time = 'L\'heure est requise';
    }
    
    if (!formData.duration.trim()) {
      errors.duration = 'La durée est requise';
    } else if (isNaN(parseInt(formData.duration)) || parseInt(formData.duration) <= 0) {
      errors.duration = 'La durée doit être un nombre positif';
    }
    
    if (!formData.status) {
      errors.status = 'Le statut est requis';
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
