
import { useState } from 'react';
import { Prospect, ProspectFormData, ReminderData } from '../../types/crm-types';

export const useProspectState = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<ProspectFormData>({
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    name: '',
    email: '',
    phone: '',
    status: 'new', // Changed from 'warm' to 'new' to match allowed values
    source: 'Site web',
    lastContact: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Fixed ReminderData to match the interface
  const [reminderData, setReminderData] = useState<ReminderData>({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    completed: false,
    notes: '',
    prospectId: '',
    type: 'email', // For backward compatibility
    note: '' // For backward compatibility
  });

  // Constants
  const sourcesOptions = ['Site web', 'LinkedIn', 'Salon', 'Recommandation', 'Appel entrant', 'Email', 'Autre'];

  return {
    // State
    prospects,
    setProspects,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
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
    selectedProspect,
    setSelectedProspect,
    loading,
    setLoading,
    formData,
    setFormData,
    reminderData,
    setReminderData,
    // Constants
    sourcesOptions
  };
};
