
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
import ServicesTable from './components/ServicesTable';

const GarageServicesDashboard = () => {
  const { services = [], isLoading, refetch } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Derniers services</h2>
        <ServicesTable services={services} onServiceModified={refetch} />
      </Card>
    </div>
  );
};

export default GarageServicesDashboard;
