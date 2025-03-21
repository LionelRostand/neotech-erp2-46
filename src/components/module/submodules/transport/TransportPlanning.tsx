
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PlanningTabContent from './planning/PlanningTabContent';
import PlanningHeader from './planning/PlanningHeader';
import { PlanningProvider } from './planning/context/PlanningContext';

const TransportPlanning: React.FC = () => {
  const [activePlanningMode, setActivePlanningMode] = useState('vehicles');

  return (
    <PlanningProvider>
      <div className="space-y-6">
        <PlanningHeader />
        
        <Card>
          <CardContent className="pt-6">
            <PlanningTabContent 
              activeMode={activePlanningMode}
              onModeChange={setActivePlanningMode}
            />
          </CardContent>
        </Card>
      </div>
    </PlanningProvider>
  );
};

export default TransportPlanning;
