
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
import RepairsStats from '../repairs/components/RepairsStats';
import ServicesTable from './components/ServicesTable';
import { AddServiceDialog } from './AddServiceDialog';

const GarageServicesDashboard = () => {
  const { services = [], isLoading } = useGarageData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <RepairsStats 
        todayCount={0}
        activeCount={services.length}
        pendingPartsCount={0}
        totalCount={services.length}
      />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Derniers services</h2>
        <ServicesTable services={services} />
      </Card>

      <AddServiceDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
};

export default GarageServicesDashboard;
