
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
    handleAddProspect,
    handleUpdateProspect,
    handleDeleteProspect,
    handleAddReminder,
    handleConvertToClient,
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

  // Wrap action handlers for components
  const handleCreateProspect = (data) => {
    handleAddProspect(data);
    setIsAddDialogOpen(false);
  };

  const handleScheduleReminder = (prospectId, data) => {
    handleAddReminder(prospectId, data);
    setIsReminderDialogOpen(false);
  };

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
