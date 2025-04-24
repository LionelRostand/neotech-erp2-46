
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGarageServices } from '@/hooks/garage/useGarageServices';
import ServicesList from './ServicesList';
import ServicesStats from './components/ServicesStats';
import CreateServiceDialog from './CreateServiceDialog';

const GarageServicesDashboard = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { services, loading, refetchServices } = useGarageServices();

  const getStats = () => {
    const totalServices = services.length;
    const averageDuration = Math.round(
      services.reduce((acc, service) => acc + service.duration, 0) / totalServices || 0
    );
    const repairServices = services.filter(service => service.type === 'repair').length;
    // For demo purposes, setting active services to a random number between 1 and total services
    const activeServices = Math.min(Math.floor(Math.random() * totalServices) + 1, totalServices);

    return {
      totalServices,
      averageDuration,
      activeServices,
      repairServices
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Services</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Service
        </Button>
      </div>

      <ServicesStats {...stats} />

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
