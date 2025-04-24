
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGarageServices } from '@/hooks/garage/useGarageServices';
import ServicesList from './ServicesList';
import CreateServiceDialog from './CreateServiceDialog';

const GarageServicesDashboard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { services, loading, refetchServices } = useGarageServices();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Services</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </Button>
      </div>

      <ServicesList services={services} isLoading={loading} />

      <CreateServiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={refetchServices}
      />
    </div>
  );
};

export default GarageServicesDashboard;
