
import React from 'react';
import { Card } from "@/components/ui/card";
import LocationsList from './LocationsList';
import VehiclesMap from './VehiclesMap';

const LocationsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <VehiclesMap />
        </Card>
        <Card className="p-6">
          <LocationsList />
        </Card>
      </div>
    </div>
  );
};

export default LocationsDashboard;
