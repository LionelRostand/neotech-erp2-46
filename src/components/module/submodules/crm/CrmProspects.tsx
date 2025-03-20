
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useProspects } from './hooks/useProspects';
import ProspectList from './prospects/ProspectList';
import ProspectSearch from './prospects/ProspectSearch';
import ProspectDialogs from './prospects/ProspectDialogs';

const CrmProspects: React.FC = () => {
  const {
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
  } = useProspects();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Prospects</h2>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un prospect
        </Button>
      </div>

      <Card className="p-4">
        <ProspectSearch 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          setSearchTerm={setSearchTerm}
          setStatusFilter={setStatusFilter}
        />

        <ProspectList 
          loading={loading}
          filteredProspects={filteredProspects}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusText={getStatusText}
          onViewDetails={viewProspectDetails}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onReminder={openReminderDialog}
          onConvert={openConvertDialog}
        />
      </Card>

      <ProspectDialogs 
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isViewDetailsOpen={isViewDetailsOpen}
        setIsViewDetailsOpen={setIsViewDetailsOpen}
        isConvertDialogOpen={isConvertDialogOpen}
        setIsConvertDialogOpen={setIsConvertDialogOpen}
        isReminderDialogOpen={isReminderDialogOpen}
        setIsReminderDialogOpen={setIsReminderDialogOpen}
        selectedProspect={selectedProspect}
        formData={formData}
        reminderData={reminderData}
        sourcesOptions={sourcesOptions}
        getStatusBadgeClass={getStatusBadgeClass}
        getStatusText={getStatusText}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleCreateProspect={handleCreateProspect}
        handleUpdateProspect={handleUpdateProspect}
        handleDeleteProspect={handleDeleteProspect}
        handleConvertToClient={handleConvertToClient}
        handleScheduleReminder={handleScheduleReminder}
        setReminderData={setReminderData}
        openEditDialog={openEditDialog}
        openReminderDialog={openReminderDialog}
        openConvertDialog={openConvertDialog}
      />
    </div>
  );
};

export default CrmProspects;
