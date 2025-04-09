
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import ClientSearch from './clients/ClientSearch';
import ClientsTable from './clients/ClientsTable';
import { useClients } from './hooks/useClients';
import ClientDialogs from './clients/ClientDialogs';
import SeedDataButton from './clients/SeedDataButton';
import { toast } from 'sonner';

const CrmClients: React.FC = () => {
  const { 
    clients,
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
    error,
    sectors,
    statusOptions
  } = useClients();

  // Automatically prompt to add demo data if there are no clients
  useEffect(() => {
    if (!loading && !error && clients.length === 0) {
      const timer = setTimeout(() => {
        toast.info(
          "Aucun client trouvé. Utilisez le bouton 'Ajouter des données démo' pour initialiser des données de test.",
          { duration: 5000 }
        );
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [clients, loading, error]);

  // Convert error to string for the table component
  const errorMessage = error ? error.message : '';

  // Ensure filteredClients is always an array
  const safeFilteredClients = Array.isArray(filteredClients) ? filteredClients : [];

  return (
    <div className="min-h-screen w-full bg-neotech-background">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-3 md:mb-0">Clients</h1>
          <div className="flex space-x-2">
            <SeedDataButton />
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
              Ajouter un client
            </Button>
          </div>
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
            clients={safeFilteredClients}
            onView={viewClientDetails}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            isLoading={loading}
            error={errorMessage}
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
          handleCreateClient={(e) => handleCreateClient(e)}
          handleUpdateClient={(e) => handleUpdateClient(e)}
          handleDeleteClient={handleDeleteClient}
          resetForm={resetForm}
          sectorOptions={sectors}
          statusOptions={statusOptions}
          openEditDialog={openEditDialog}
        />
      </div>
    </div>
  );
};

export default CrmClients;
