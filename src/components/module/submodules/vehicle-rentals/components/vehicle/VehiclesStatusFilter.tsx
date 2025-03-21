
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleStatus } from '../../types/rental-types';

interface VehiclesStatusFilterProps {
  selectedView: "all" | VehicleStatus;
  onViewChange: (value: "all" | VehicleStatus) => void;
}

const VehiclesStatusFilter: React.FC<VehiclesStatusFilterProps> = ({
  selectedView,
  onViewChange,
}) => {
  return (
    <Tabs defaultValue={selectedView} onValueChange={(value) => onViewChange(value as "all" | VehicleStatus)}>
      <TabsList>
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="available">Disponibles</TabsTrigger>
        <TabsTrigger value="rented">Loués</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        <TabsTrigger value="reserved">Réservés</TabsTrigger>
        <TabsTrigger value="inactive">Inactifs</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default VehiclesStatusFilter;
