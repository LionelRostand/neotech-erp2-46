
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePlanning } from './context/PlanningContext';

const MaintenanceScheduleDialog: React.FC = () => {
  const {
    showMaintenanceScheduleDialog,
    setShowMaintenanceScheduleDialog,
    selectedVehicle,
    selectedMaintenanceSchedule,
  } = usePlanning();

  const handleClose = () => {
    setShowMaintenanceScheduleDialog(false);
  };

  const dialogTitle = selectedMaintenanceSchedule
    ? "Modifier la période de maintenance"
    : "Planifier une nouvelle période de maintenance";

  return (
    <Dialog open={showMaintenanceScheduleDialog} onOpenChange={setShowMaintenanceScheduleDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {selectedVehicle && (
            <div className="mb-4">
              <p className="text-sm font-medium">Véhicule sélectionné:</p>
              <p>{selectedVehicle.name} ({selectedVehicle.licensePlate})</p>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Formulaire pour {selectedMaintenanceSchedule ? "modifier" : "créer"} une période de maintenance.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button>
            {selectedMaintenanceSchedule ? "Mettre à jour" : "Planifier"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceScheduleDialog;
