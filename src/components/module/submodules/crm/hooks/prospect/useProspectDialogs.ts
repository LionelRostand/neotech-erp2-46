
import { Prospect, ProspectFormData } from '../../types/crm-types';

export const useProspectDialogs = (
  setSelectedProspect: React.Dispatch<React.SetStateAction<Prospect | null>>,
  setFormData: React.Dispatch<React.SetStateAction<ProspectFormData>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsViewDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsConvertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsReminderDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Open the add dialog
  const openAddDialog = () => {
    setSelectedProspect(null);
    setIsAddDialogOpen(true);
  };

  // Open the edit dialog for a prospect
  const openEditDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setFormData({
      company: prospect.company,
      contactName: prospect.contactName,
      contactEmail: prospect.contactEmail,
      contactPhone: prospect.contactPhone,
      source: prospect.source || 'Site web',
      status: prospect.status || 'new',
      notes: prospect.notes || '',
      industry: prospect.industry || '',
      website: prospect.website || '',
      address: prospect.address || '',
      size: prospect.size || '',
      estimatedValue: prospect.estimatedValue || ''
    });
    setIsEditDialogOpen(true);
  };

  // Open the delete dialog for a prospect
  const openDeleteDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsDeleteDialogOpen(true);
  };

  // View details of a prospect
  const openViewDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsViewDetailsOpen(true);
  };

  // Open the convert to client dialog
  const openConvertDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsConvertDialogOpen(true);
  };

  // Open the reminder dialog
  const openReminderDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsReminderDialogOpen(true);
  };

  // Close all dialogs
  const closeAllDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsViewDetailsOpen(false);
    setIsConvertDialogOpen(false);
    setIsReminderDialogOpen(false);
    setSelectedProspect(null);
  };

  return {
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDetails,
    openConvertDialog,
    openReminderDialog,
    closeAllDialogs
  };
};
