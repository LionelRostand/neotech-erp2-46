
import React from 'react';
import { Card } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
import RepairsStats from '../repairs/components/RepairsStats';
import RepairsTable from '../repairs/components/RepairsTable';

const GarageServicesDashboard = () => {
  const { repairs = [], isLoading } = useGarageData();
  
  const today = new Date().toISOString().split('T')[0];
  
  const todayRepairs = repairs.filter(r => r?.date === today);
  const activeRepairs = repairs.filter(r => r?.status === 'in_progress');
  const pendingParts = repairs.filter(r => r?.status === 'waiting_parts');
  const allRepairs = repairs;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle réparation
        </Button>
      </div>

      <RepairsStats 
        todayCount={todayRepairs.length}
        activeCount={activeRepairs.length}
        pendingPartsCount={pendingParts.length}
        totalCount={allRepairs.length}
      />

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dernières réparations</h2>
        <RepairsTable repairs={repairs} />
      </Card>
    </div>
  );
};

export default GarageServicesDashboard;

