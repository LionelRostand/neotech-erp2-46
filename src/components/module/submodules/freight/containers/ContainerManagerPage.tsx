
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import ContainersListWithCreate from "./ContainersListWithCreate";

const ContainerManagerPage: React.FC = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Cette fonction sera passée au composant enfant pour ouvrir le modal
  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => setAddDialogOpen(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestion des Conteneurs</h1>
        </div>
        <Button
          data-testid="add-container-btn"
          onClick={handleOpenAddDialog}
          className="bg-primary text-white flex items-center gap-2"
        >
          <Plus className="mr-1 h-4 w-4" />
          Ajouter un conteneur
        </Button>
      </div>
      <div className="rounded-md bg-white p-4">
        <ContainersListWithCreate
          addDialogOpen={addDialogOpen}
          onCloseAddDialog={handleCloseAddDialog}
        />
      </div>
    </div>
  );
};

export default ContainerManagerPage;
