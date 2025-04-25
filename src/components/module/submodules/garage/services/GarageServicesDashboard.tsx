
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import ServicesTable from './components/ServicesTable';
import ServicesStats from './components/ServicesStats';
import { AddServiceDialog } from './AddServiceDialog';

interface Service {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  createdAt: string;
}

const GarageServicesDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: services = [], isLoading, refetch } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>('garage_services'),
  });

  console.log("Loaded services:", services);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Services</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <ServicesStats services={services} />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Derniers services</h2>
        <ServicesTable services={services} onServiceModified={refetch} />
      </Card>

      <AddServiceDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onServiceAdded={refetch}
      />
    </div>
  );
};

export default GarageServicesDashboard;
