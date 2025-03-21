
import React from 'react';
import FleetHeader from './components/fleet/FleetHeader';
import FleetManagementCard from './components/fleet/FleetManagementCard';

const TransportFleet = () => {
  return (
    <div className="space-y-6">
      <FleetHeader title="Flotte de Véhicules" />
      <FleetManagementCard />
    </div>
  );
};

export default TransportFleet;
