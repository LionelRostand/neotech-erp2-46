
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, AlertCircle } from "lucide-react";
import { useProspects } from './hooks/useProspects';
import { useProspectState } from './hooks/prospect/useProspectState';
import { useProspectForm } from './hooks/prospect/useProspectForm';
import { useProspectDialogs } from './hooks/prospect/useProspectDialogs';
import { Prospect, ProspectFormData, ReminderData } from './types/crm-types';
import ProspectSearch from './prospects/ProspectSearch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProspectsTable from './prospects/ProspectsTable';
import ProspectsGrid from './prospects/ProspectsGrid';
import ReminderDialog from './reminders/ReminderDialog';
import { toast } from 'sonner';
import AddProspectDialog from './prospects/AddProspectDialog';
import EditProspectDialog from './prospects/EditProspectDialog';
import ViewProspectDetails from './prospects/ViewProspectDetails';
import DeleteProspectDialog from './prospects/DeleteProspectDialog';
import ConvertToClientDialog from './prospects/ConvertToClientDialog';

const CrmProspects: React.FC = () => {
  const {
    prospects,
    isLoading,
    error,
    sourceOptions,
    statusOptions,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedProspect,
    setSelectedProspect,
    addProspect,
    updateProspect,
    deleteProspect,
    convertToClient,
    addReminder
  } = useProspects();

  const {
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
    resetForm
  } = useProspectState();

  const {
    handleInputChange,
    handleSelectChange
  } = useProspectForm(setFormData);

  const {
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    openViewDetails,
    openConvertDialog,
    openReminderDialog
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

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleReminderChange = (field: string, value: string) => {
    setReminderData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProspect = async (data: ProspectFormData): Promise<boolean> => {
    try {
      await addProspect(data);
      resetForm();
      setIsAddDialogOpen(false);
      toast.success('Prospect ajouté avec succès');
      return true;
    } catch (error) {
      console.error('Error adding prospect:', error);
      toast.error('Erreur lors de l\'ajout du prospect');
      return false;
    }
  };

  const handleUpdateProspect = async (data: ProspectFormData): Promise<boolean> => {
    if (!selectedProspect) return false;
    
    try {
      await updateProspect(selectedProspect.id, data);
      setIsEditDialogOpen(false);
      toast.success('Prospect mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating prospect:', error);
      toast.error('Erreur lors de la mise à jour du prospect');
      return false;
    }
  };

  const handleDeleteProspect = async (): Promise<void> => {
    if (!selectedProspect) return;
    
    try {
      await deleteProspect(selectedProspect.id);
      setIsDeleteDialogOpen(false);
      toast.success('Prospect supprimé avec succès');
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast.error('Erreur lors de la suppression du prospect');
    }
  };

  const handleConvertToClient = async (): Promise<void> => {
    if (!selectedProspect) return;
    
    try {
      const clientId = await convertToClient(selectedProspect);
      setIsConvertDialogOpen(false);
      toast.success('Prospect converti en client avec succès');
    } catch (error) {
      console.error('Error converting prospect to client:', error);
      toast.error('Erreur lors de la conversion du prospect en client');
    }
  };

  const handleAddReminder = async (): Promise<void> => {
    if (!selectedProspect) return;
    
    try {
      await addReminder(selectedProspect.id, reminderData);
      setIsReminderDialogOpen(false);
      toast.success('Rappel ajouté avec succès');
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Erreur lors de l\'ajout du rappel');
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
    const matchesSearch = !searchTerm || 
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-neotech-background">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Prospects</h1>
          <Button onClick={openAddDialog} className="md:ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un prospect
          </Button>
        </div>
        
        <ProspectSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={statusOptions}
        />
        
        <Tabs defaultValue="table" value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'grid')} className="mt-6">
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="table">Tableau</TabsTrigger>
              <TabsTrigger value="grid">Grille</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="table">
            <ProspectsTable 
              prospects={filteredProspects}
              isLoading={isLoading}
              error={error}
              onViewDetails={openViewDetails}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onConvert={openConvertDialog}
              onReminder={openReminderDialog}
            />
          </TabsContent>
          
          <TabsContent value="grid">
            <ProspectsGrid 
              prospects={filteredProspects}
              isLoading={isLoading}
              error={error}
              onViewDetails={openViewDetails}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onConvert={openConvertDialog}
              onAddReminder={openReminderDialog}
            />
          </TabsContent>
        </Tabs>
        
        <AddProspectDialog 
          isOpen={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)} 
          onAdd={handleAddProspect}
          sourceOptions={sourceOptions}
          statusOptions={statusOptions}
        />
        
        {selectedProspect && (
          <>
            <EditProspectDialog 
              isOpen={isEditDialogOpen} 
              onClose={() => setIsEditDialogOpen(false)} 
              prospect={selectedProspect}
              onUpdate={handleUpdateProspect}
              sourceOptions={sourceOptions}
              statusOptions={statusOptions}
            />
            
            <ViewProspectDetails 
              isOpen={isViewDetailsOpen} 
              onClose={() => setIsViewDetailsOpen(false)} 
              prospect={selectedProspect} 
              onEdit={() => {
                setIsViewDetailsOpen(false);
                openEditDialog(selectedProspect);
              }}
            />
            
            <DeleteProspectDialog 
              isOpen={isDeleteDialogOpen} 
              onClose={() => setIsDeleteDialogOpen(false)} 
              prospect={selectedProspect} 
              onDelete={handleDeleteProspect} 
            />
            
            <ConvertToClientDialog 
              isOpen={isConvertDialogOpen} 
              onClose={() => setIsConvertDialogOpen(false)} 
              prospect={selectedProspect} 
              onConvert={handleConvertToClient} 
            />
            
            <ReminderDialog 
              isOpen={isReminderDialogOpen}
              onClose={() => setIsReminderDialogOpen(false)}
              reminderData={reminderData}
              onChange={handleReminderChange}
              onSave={handleAddReminder}
              relatedTo={{
                type: 'prospect',
                id: selectedProspect.id,
                name: selectedProspect.company
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CrmProspects;
