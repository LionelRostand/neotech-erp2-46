
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
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-indigo-700">Total Services</CardTitle>
          <Wrench className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-900">{totalServices}</div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-700">Coût Moyen</CardTitle>
          <Euro className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900">{averageCost.toFixed(2)}€</div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">Durée Moyenne</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{averageDuration.toFixed(0)} min</div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700">Services Actifs</CardTitle>
          <TrendingUp className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900">{activeServices}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesStats;
