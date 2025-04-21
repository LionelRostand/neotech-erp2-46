
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Container, Plus } from "lucide-react";
import NewContainerDialogWithTabs from "./NewContainerDialogWithTabs";
import ContainersListWithCreate from "./ContainersListWithCreate";

const ContainerListPage: React.FC = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Container className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Conteneurs</h1>
        </div>
        <Button
          data-testid="add-container-btn"
          onClick={() => setAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="mr-1 h-4 w-4" />
          Nouveau Conteneur
        </Button>
      </div>
      <div className="rounded-md bg-white p-4">
        <ContainersListWithCreate />
      </div>
      <NewContainerDialogWithTabs open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default ContainerListPage;
