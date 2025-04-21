
import React, { useState } from "react";
import SubmoduleHeader from "../../SubmoduleHeader";
import ContainersListWithCreate from "./ContainersListWithCreate";
import ContainerCreateDialog from "./ContainerCreateDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContainerEditDialog from "./ContainerEditDialog";
import { Container } from "@/types/freight";

const ContainerListPage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);

  const handleEditContainer = (container: Container) => {
    setEditingContainer(container);
  };

  return (
    <div className="container space-y-6 py-6">
      <SubmoduleHeader 
        title="Gestion des conteneurs" 
        description="Créer, consulter et gérer les conteneurs de marchandises"
        action={
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau conteneur
          </Button>
        }
      />

      <ContainersListWithCreate onEditContainer={handleEditContainer} />

      <ContainerCreateDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />

      <ContainerEditDialog 
        open={!!editingContainer} 
        onClose={() => setEditingContainer(null)} 
        container={editingContainer}
      />
    </div>
  );
};

export default ContainerListPage;
