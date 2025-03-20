
import { Prospect, ProspectFormData } from '../../types/crm-types';

export const useProspectDialogs = (
  setSelectedProspect: React.Dispatch<React.SetStateAction<Prospect | null>>,
  setFormData: React.Dispatch<React.SetStateAction<ProspectFormData>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsConvertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsViewDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsReminderDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const openEditDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setFormData({
      name: prospect.name,
      company: prospect.company,
      email: prospect.email,
      phone: prospect.phone,
      status: prospect.status,
      source: prospect.source,
      lastContact: prospect.lastContact,
      notes: prospect.notes
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsDeleteDialogOpen(true);
  };

  const openConvertDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsConvertDialogOpen(true);
  };

  const viewProspectDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsViewDetailsOpen(true);
  };

  const openReminderDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsReminderDialogOpen(true);
  };

  return {
    openEditDialog,
    openDeleteDialog,
    openConvertDialog,
    viewProspectDetails,
    openReminderDialog
  };
};
