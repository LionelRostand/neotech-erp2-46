
import React from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import ContainersListWithCreate from "./ContainersListWithCreate";

const ContainerManagerPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestion des Conteneurs</h1>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un conteneur
        </Button>
      </div>

      <div className="rounded-md bg-white p-4">
        <ContainersListWithCreate />
      </div>
    </div>
  );
};

export default ContainerManagerPage;
