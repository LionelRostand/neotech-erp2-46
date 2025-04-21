
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { Container } from "@/types/freight";
import ContainersListWithCreate from "./ContainersListWithCreate";
import ContainerEditDialog from "./ContainerEditDialog";

const ContainerManagerPage: React.FC = () => {
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditContainer = (container: Container) => {
    console.log("Edit container called with:", container);
    setSelectedContainer(container);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestion des Conteneurs</h1>
        </div>
        <Button
          onClick={() => {
            setSelectedContainer(null);
            setIsEditDialogOpen(true);
          }}
          className="bg-primary text-white flex items-center gap-2"
        >
          <Plus className="mr-1 h-4 w-4" />
          Nouveau conteneur
        </Button>
      </div>
      <div className="rounded-md bg-white p-4">
        <ContainersListWithCreate 
          onEditContainer={handleEditContainer} 
        />
      </div>

      {isEditDialogOpen && (
        <ContainerEditDialog
          container={selectedContainer}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default ContainerManagerPage;
