
import { useState, useEffect } from 'react';
import { ProspectFormData, ReminderData } from '../../types/crm-types';

export const useProspectState = () => {
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  
  // Forms data
  const [formData, setFormData] = useState<ProspectFormData>({
    name: '',
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    email: '',
    phone: '',
    status: 'new',
    source: '',
    industry: '',
    website: '',
    address: '',
    notes: ''
  });
  
  const [reminderData, setReminderData] = useState<ReminderData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  // Reset forms
  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      email: '',
      phone: '',
      status: 'new',
      source: '',
      industry: '',
      website: '',
      address: '',
      notes: ''
    });
    
    setReminderData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };
  
  return {
    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    isConvertDialogOpen,
    setIsConvertDialogOpen,
    isReminderDialogOpen,
    setIsReminderDialogOpen,
    
    // Form data
    formData,
    setFormData,
    reminderData,
    setReminderData,
    
    // Form reset
    resetForm
  };
};
