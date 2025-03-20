
import { useProspectState } from './prospect/useProspectState';
import { useProspectData } from './prospect/useProspectData';
import { useProspectForm } from './prospect/useProspectForm';
import { useProspectActions } from './prospect/useProspectActions';
import { useProspectDialogs } from './prospect/useProspectDialogs';
import { useProspectUtils } from './prospect/useProspectUtils';

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
  const { prospectCollection } = useProspectData(setProspects, setLoading);

  // Form handling
  const { handleInputChange, handleSelectChange, resetForm } = useProspectForm(setFormData);

  // CRUD operations and other actions
  const {
    handleCreateProspect,
    handleUpdateProspect,
    handleDeleteProspect,
    handleConvertToClient,
    handleScheduleReminder
  } = useProspectActions(
    prospectCollection,
    prospects,
    setProspects,
    formData,
    reminderData,
    selectedProspect,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsConvertDialogOpen,
    setIsReminderDialogOpen,
    setSelectedProspect,
    resetForm
  );

  // Dialog management
  const {
    openEditDialog,
    openDeleteDialog,
    openConvertDialog,
    viewProspectDetails,
    openReminderDialog
  } = useProspectDialogs(
    setSelectedProspect,
    setFormData,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsConvertDialogOpen,
    setIsViewDetailsOpen,
    setIsReminderDialogOpen
  );

  // Utility functions
  const { getStatusBadgeClass, getStatusText, filterProspects } = useProspectUtils();

  // Filter prospects based on search term and status filter
  const filteredProspects = filterProspects(prospects, searchTerm, statusFilter);

  return {
    prospects,
    filteredProspects,
    loading,
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
    handleCreateProspect,
    handleUpdateProspect,
    handleDeleteProspect,
    handleConvertToClient,
    handleScheduleReminder,
    openEditDialog,
    openDeleteDialog,
    openConvertDialog,
    viewProspectDetails,
    openReminderDialog,
    getStatusBadgeClass,
    getStatusText
  };
};
