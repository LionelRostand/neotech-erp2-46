
import React from 'react';
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/DashboardLayout';
import ClientSearch from './clients/ClientSearch';
import ClientsTable from './clients/ClientsTable';
import { useClients, sectors, statusOptions } from './hooks/useClients';
import ClientDialogs from './clients/ClientDialogs';

const CrmClients: React.FC = () => {
  const clientsHook = useClients();
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
    loading,
    error
  } = clientsHook;

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-2 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-3 md:mb-0">Clients</h1>
          <Button onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}>
            Ajouter un client
          </Button>
        </div>

        <ClientSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sectorFilter={sectorFilter}
          onSectorFilterChange={setSectorFilter}
          sectorOptions={sectors}
        />

        <div className="mt-4">
          <ClientsTable 
            clients={filteredClients}
            onView={viewClientDetails}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            isLoading={loading}
            error={error}
          />
        </div>

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
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleCreateClient={handleCreateClient}
          handleUpdateClient={handleUpdateClient}
          handleDeleteClient={handleDeleteClient}
          resetForm={resetForm}
          sectorOptions={sectors}
          statusOptions={statusOptions}
        />
      </div>
    </DashboardLayout>
  );
};

export default CrmClients;
