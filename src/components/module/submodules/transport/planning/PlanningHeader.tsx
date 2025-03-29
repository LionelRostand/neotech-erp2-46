
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, LayoutGrid, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { usePlanning } from './context/PlanningContext';

const PlanningHeader: React.FC = () => {
  const { isLoading, refreshData } = usePlanning();

  const handleRefresh = () => {
    refreshData();
    toast.success("Données de planning actualisées");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Planning des Transports</h2>
        <Button 
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span>Actualiser</span>
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Gérez la disponibilité des véhicules, planifiez les maintenances et traitez les demandes d'extension.
      </p>
    </div>
  );
};

export default PlanningHeader;
