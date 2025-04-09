
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import ClientSearch from './clients/ClientSearch';
import ClientsTable from './clients/ClientsTable';
import { useClients } from './hooks/useClients';
import ClientDialogs from './clients/ClientDialogs';
import SeedDataButton from './clients/SeedDataButton';
import { toast } from 'sonner';

const CrmClients: React.FC = () => {
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  
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
    isOfflineMode,
    sectors,
    statusOptions,
    refreshClients
  } = useClients();

  // Add a timeout to stop the loading indicator after a certain period
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (loading) {
      timer = setTimeout(() => {
        setLoadingTimedOut(true);
        console.log("Loading timed out after 10 seconds");
      }, 10000); // 10 seconds timeout
    } else {
      setLoadingTimedOut(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading]);

  // Automatically prompt to add demo data if there are no clients
  useEffect(() => {
    if (!loading && !loadingTimedOut && !error && clients.length === 0) {
      const timer = setTimeout(() => {
        toast.info(
          "Aucun client trouvé. Utilisez le bouton 'Ajouter des données démo' pour initialiser des données de test.",
          { duration: 5000 }
        );
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [clients, loading, loadingTimedOut, error]);

  // Convert error to string for the table component
  const errorMessage = error ? (error.message || String(error)) : '';

  // Ensure filteredClients is always an array
  const safeFilteredClients = Array.isArray(filteredClients) ? filteredClients : [];

  return (
    <div className="min-h-screen w-full bg-neotech-background">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-3 md:mb-0">Clients</h1>
          <div className="flex space-x-2">
            {!loading && (
              <Button variant="outline" onClick={refreshClients} title="Rafraîchir les données">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Rafraîchir
              </Button>
            )}
            <SeedDataButton />
            <Button onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}>
              Ajouter un client
            </Button>
          </div>
        </div>

        {isOfflineMode && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Mode démo activé: Les changements ne seront pas sauvegardés sur le serveur.</span>
          </div>
        )}

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
            isLoading={loading && !loadingTimedOut}
            error={loadingTimedOut ? "Chargement des données a pris trop de temps. Veuillez rafraîchir la page." : errorMessage}
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
          openEditDialog={openEditDialog}
        />
      </div>
    </div>
  );
};

export default CrmClients;
