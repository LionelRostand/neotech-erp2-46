
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Euro, Clock, Wrench, TrendingUp } from 'lucide-react';

const ServicesStats = () => {
  const { services = [] } = useGarageData();

  const totalServices = services.length;
  const averageCost = services.reduce((acc, service) => acc + service.cost, 0) / (services.length || 1);
  const averageDuration = services.reduce((acc, service) => acc + service.duration, 0) / (services.length || 1);
  const activeServices = services.filter(service => service.status === 'active').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServices}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coût Moyen</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageCost.toFixed(2)}€</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageDuration.toFixed(0)} min</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Services Actifs</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeServices}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesStats;
