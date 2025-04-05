
import { useProspectState } from './prospect/useProspectState';
import { useProspectData } from './prospect/useProspectData';
import { useProspectForm } from './prospect/useProspectForm';
import { useProspectActions } from './prospect/useProspectActions';
import { useProspectDialogs } from './prospect/useProspectDialogs';
import { useProspectUtils } from './prospect/useProspectUtils';
import { ProspectFormData, ReminderData } from '../types/crm-types';

export const useProspects = () => {
  // Get all state variables
  const {
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
    sourcesOptions
  } = useProspectState();

  // Load prospect data from Firestore
  const { prospectCollection, loadProspects } = useProspectData(setProspects, setLoading);

  // Form handling
  const { handleInputChange, handleSelectChange, resetForm } = useProspectForm(setFormData);

  // CRUD operations and other actions
  const {
    handleAddProspect,
    handleUpdateProspect,
    handleDeleteProspect,
    handleAddReminder,
    handleConvertToClient,
    error
  } = useProspectActions(
    prospects,
    setProspects,
    setLoading
  );

  // Dialog management
  const {
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDetails,
    openConvertDialog,
    openReminderDialog,
    closeAllDialogs
  } = useProspectDialogs(
    setSelectedProspect,
    setFormData,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDetailsOpen,
    setIsConvertDialogOpen,
    setIsReminderDialogOpen
  );

  // Utility functions
  const { getStatusBadgeClass, getStatusText, filterProspects } = useProspectUtils();

  // Filter prospects based on search term and status filter
  const filteredProspects = filterProspects(prospects, searchTerm, statusFilter);

  // Add a new prospect wrapper function
  const addProspect = async (data: ProspectFormData) => {
    return await handleAddProspect(data);
  };

  // Update a prospect wrapper function
  const updateProspect = async (id: string, data: ProspectFormData) => {
    return await handleUpdateProspect(id, data);
  };

  // Delete a prospect wrapper function
  const deleteProspect = async (id: string) => {
    return await handleDeleteProspect(id);
  };

  // Convert a prospect to client wrapper function
  const convertToClient = async (prospect) => {
    return await handleConvertToClient(prospect);
  };

  // Add a reminder wrapper function
  const addReminder = async (prospectId: string, data: ReminderData) => {
    return await handleAddReminder(prospectId, data);
  };

  return {
    prospects,
    filteredProspects,
    isLoading: loading,
    error,
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
    formData,
    reminderData,
    setReminderData,
    sourcesOptions,
    handleInputChange,
    handleSelectChange,
    resetForm,
    addProspect,
    updateProspect,
    deleteProspect,
    convertToClient,
    addReminder,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDetails,
    openConvertDialog,
    openReminderDialog,
    getStatusBadgeClass,
    getStatusText
  };
};
