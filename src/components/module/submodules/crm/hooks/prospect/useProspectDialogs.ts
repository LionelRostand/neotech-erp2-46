
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
  // Open the add prospect dialog
  const openAddDialog = () => {
    setSelectedProspect(null);
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
    setIsAddDialogOpen(true);
  };
  
  // Open the edit prospect dialog
  const openEditDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setFormData({
      company: prospect.company,
      contactName: prospect.contactName,
      contactEmail: prospect.contactEmail,
      contactPhone: prospect.contactPhone,
      name: prospect.name,
      email: prospect.email,
      phone: prospect.phone,
      status: prospect.status,
      source: prospect.source,
      industry: prospect.industry,
      website: prospect.website,
      address: prospect.address,
      size: prospect.size,
      estimatedValue: prospect.estimatedValue,
      notes: prospect.notes,
      lastContact: prospect.lastContact || new Date().toISOString().split('T')[0]
    });
    setIsEditDialogOpen(true);
  };
  
  // Open the delete prospect dialog
  const openDeleteDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsDeleteDialogOpen(true);
  };
  
  // Open the view prospect details dialog
  const openViewDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsViewDetailsOpen(true);
  };
  
  // Open the convert to client dialog
  const openConvertDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsConvertDialogOpen(true);
  };
  
  // Open the add reminder dialog
  const openReminderDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsReminderDialogOpen(true);
  };
  
  return {
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDetails,
    openConvertDialog,
    openReminderDialog
  };
};
