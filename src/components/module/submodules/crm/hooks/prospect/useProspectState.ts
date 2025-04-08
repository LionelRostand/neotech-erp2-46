
import { useState } from 'react';
import { Prospect, ProspectFormData, ReminderData } from '../../types/crm-types';

export const useProspectState = () => {
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  
  // Selected prospect and form data
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [formData, setFormData] = useState<ProspectFormData>({
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    name: '',
    email: '',
    phone: '',
    status: 'new',
    source: 'website',
    lastContact: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  // Reminder data
  const [reminderData, setReminderData] = useState<ReminderData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      name: '',
      email: '',
      phone: '',
      status: 'new',
      source: 'website',
      lastContact: new Date().toISOString().split('T')[0],
      notes: ''
    });
    
    setReminderData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };
  
  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isConvertDialogOpen,
    setIsConvertDialogOpen,
    isReminderDialogOpen,
    setIsReminderDialogOpen,
    formData,
    setFormData,
    reminderData,
    setReminderData,
    selectedProspect,
    setSelectedProspect,
    resetForm
  };
};
