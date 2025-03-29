
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar } from "lucide-react";
import { usePlanning } from './context/PlanningContext';

const PlanningHeader: React.FC = () => {
  const { refreshData, isLoading, handleAddMaintenance } = usePlanning();

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold">Planning des Transports</h2>
        <p className="text-muted-foreground">
          Planification des véhicules, maintenance et demandes d'extension
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          <span>Actualiser</span>
        </Button>
        <Button 
          onClick={() => handleAddMaintenance(null)}
          className="flex items-center gap-1"
        >
          <Calendar size={16} />
          <span>Planifier maintenance</span>
        </Button>
      </div>
    </div>
  );
};

export default PlanningHeader;
