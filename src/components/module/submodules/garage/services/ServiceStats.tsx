
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';

export const ServiceStats = () => {
  const { services = [], isLoading } = useGarageData();

  if (isLoading) return <div>Chargement...</div>;

  const totalServices = services.length;
  const totalRevenue = services.reduce((acc: number, service: any) => acc + (service.cost || 0), 0);
  const averageServiceCost = totalServices > 0 ? totalRevenue / totalServices : 0;
  const averageServiceDuration = totalServices > 0 
    ? services.reduce((acc: number, service: any) => acc + (service.duration || 0), 0) / totalServices 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServices}</div>
          <p className="text-xs text-muted-foreground">services enregistrés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">potentiel</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coût Moyen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageServiceCost.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">par service</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageServiceDuration.toFixed(0)} min</div>
          <p className="text-xs text-muted-foreground">par service</p>
        </CardContent>
      </Card>
    </div>
  );
};
