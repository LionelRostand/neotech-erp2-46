
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { usePlanning } from './context/PlanningContext';

const PlanningHeader: React.FC = () => {
  const { setMaintenanceDialogOpen } = usePlanning();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold">Planning des Transports</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw size={16} />
          <span>Actualiser</span>
        </Button>
        <Button 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setMaintenanceDialogOpen(true)}
        >
          <Plus size={16} />
          <span>Planifier maintenance</span>
        </Button>
      </div>
    </div>
  );
};

export default PlanningHeader;
