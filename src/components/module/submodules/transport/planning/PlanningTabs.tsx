
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Calendar, CarFront, Clock, User } from "lucide-react";
import { usePlanning } from './context/PlanningContext';

const PlanningTabs: React.FC = () => {
  // We no longer need to get activeTab and setActiveTab from the context
  // as they are not defined in the context
  const { } = usePlanning();

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle>Planning et disponibilités</CardTitle>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Disponibilité des véhicules</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <CarFront size={16} />
            <span>Périodes de maintenance</span>
          </TabsTrigger>
          <TabsTrigger value="extensions" className="flex items-center gap-2">
            <Clock size={16} />
            <span>Prolongations</span>
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <User size={16} />
            <span>Chauffeurs</span>
          </TabsTrigger>
        </TabsList>
      </div>
    </CardHeader>
  );
};

export default PlanningTabs;
