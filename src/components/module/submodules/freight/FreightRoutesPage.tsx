
import React, { useState } from 'react';
import FreightRoutesDashboard from "./FreightRoutesDashboard";
import FreightRoutesTable from "./FreightRoutesTable";
import AddRouteDialog from "./AddRouteDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const FreightRoutesPage = () => {
  const [open, setOpen] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);

  // Permettra de signaler au tableau et dashboard qu'il faut rafraîchir les données
  const handleSuccess = () => {
    setOpen(false);
    setReloadFlag(f => !f);
  };

  return (
    <div className="px-2 md:px-8 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h1 className="text-xl md:text-2xl font-bold">Gestion des routes</h1>
        <Button onClick={() => setOpen(true)} className="md:w-auto w-full">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle route
        </Button>
      </div>
      <FreightRoutesDashboard reloadFlag={reloadFlag} />
      <div className="bg-white rounded-xl border shadow p-4">
        <FreightRoutesTable reloadFlag={reloadFlag} />
      </div>
      <AddRouteDialog open={open} onOpenChange={setOpen} onSuccess={handleSuccess} />
    </div>
  );
};

export default FreightRoutesPage;

