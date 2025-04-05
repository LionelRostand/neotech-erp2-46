
import { Prospect, ProspectFormData } from '../../types/crm-types';

export const useProspectDialogs = (
  setFormData: React.Dispatch<React.SetStateAction<ProspectFormData>>,
  selectedProspect: Prospect | null,
  setSelectedProspect: React.Dispatch<React.SetStateAction<Prospect | null>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsViewDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsConvertDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const openAddDialog = () => {
    setFormData({
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      name: '',
      email: '',
      phone: '',
      source: 'Site web',
      status: 'new',
      lastContact: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setSelectedProspect(null);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (prospect: Prospect) => {
    setFormData({
      company: prospect.company,
      contactName: prospect.contactName,
      contactEmail: prospect.contactEmail,
      contactPhone: prospect.contactPhone || '',
      name: prospect.name || prospect.contactName,
      email: prospect.email || prospect.contactEmail,
      phone: prospect.phone || prospect.contactPhone || '',
      source: prospect.source,
      status: prospect.status,
      lastContact: prospect.lastContact || new Date().toISOString().split('T')[0],
      notes: prospect.notes || '',
      industry: prospect.industry,
      website: prospect.website,
      address: prospect.address,
      size: prospect.size,
      estimatedValue: prospect.estimatedValue
    });
    setSelectedProspect(prospect);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsDeleteDialogOpen(true);
  };

  const openViewDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsViewDetailsOpen(true);
  };

  const openConvertDialog = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setIsConvertDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsViewDetailsOpen(false);
    setIsConvertDialogOpen(false);
  };

  return {
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDetails,
    openConvertDialog,
    closeAllDialogs
  };
};
