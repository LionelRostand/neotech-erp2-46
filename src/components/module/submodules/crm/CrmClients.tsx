
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useClients, sectors } from './hooks/useClients';
import ClientSearch from './clients/ClientSearch';
import ClientsTable from './clients/ClientsTable';
import ClientDialogs from './clients/ClientDialogs';

const CrmClients: React.FC = () => {
  const {
    filteredClients,
    searchTerm,
    setSearchTerm,
    sectorFilter,
    setSectorFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    selectedClient,
    formData,
    handleInputChange,
    handleSelectChange,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
    openEditDialog,
    openDeleteDialog,
    viewClientDetails,
    resetForm,
    loading
  } = useClients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button onClick={() => {
          resetForm();
          setIsAddDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      <Card className="p-4">
        <ClientSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sectorFilter={sectorFilter}
          onSectorFilterChange={setSectorFilter}
          sectors={sectors}
        />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-muted-foreground">Chargement des clients...</p>
            </div>
          </div>
        ) : (
          <ClientsTable 
            clients={filteredClients}
            onViewDetails={viewClientDetails}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        )}
      </Card>

      <ClientDialogs 
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isViewDetailsOpen={isViewDetailsOpen}
        setIsViewDetailsOpen={setIsViewDetailsOpen}
        selectedClient={selectedClient}
        formData={formData}
        sectors={sectors}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleCreateClient={handleCreateClient}
        handleUpdateClient={handleUpdateClient}
        handleDeleteClient={handleDeleteClient}
        openEditDialog={openEditDialog}
      />
    </div>
  );
};

export default CrmClients;
