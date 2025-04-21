
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContainersListWithCreate from "./ContainersListWithCreate";
import ContainerCreateDialog from "./ContainerCreateDialog";
import ContainerEditDialog from "./ContainerEditDialog";
import { Container as ContainerType } from "@/types/freight";

// Import SubmoduleHeader directly instead of relying on module structure
const SubmoduleHeader: React.FC<{
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

const ContainerListPage: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<ContainerType | null>(null);

  const handleEditContainer = (container: ContainerType) => {
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

      {editingContainer && (
        <ContainerEditDialog 
          open={!!editingContainer} 
          onClose={() => setEditingContainer(null)} 
          container={editingContainer}
        />
      )}
    </div>
  );
};

export default ContainerListPage;
