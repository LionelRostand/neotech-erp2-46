
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from '@/components/StatCard';
import { BadgePercent } from 'lucide-react';

const GarageLoyaltyDashboard = () => {
  const { loyalty, clients, isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const activePrograms = loyalty.filter(program => program.status === 'active');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Programmes Actifs"
          value={activePrograms.length.toString()}
          icon={<BadgePercent className="h-4 w-4" />}
          description="Programmes en cours"
        />
        
        <StatCard
          title="Clients Inscrits"
          value={clients.filter(c => c.loyaltyPoints && c.loyaltyPoints > 0).length.toString()}
          icon={<BadgePercent className="h-4 w-4" />}
          description="Participants au programme"
        />
        
        <StatCard
          title="Points Moyens"
          value={Math.round(clients.reduce((acc, c) => acc + (c.loyaltyPoints || 0), 0) / clients.length).toString()}
          icon={<BadgePercent className="h-4 w-4" />}
          description="Par client actif"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activePrograms.map(program => (
          <Card key={program.id}>
            <CardHeader>
              <CardTitle>{program.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{program.description}</p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Avantages:</h4>
                <p>{program.benefitsDescription}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GarageLoyaltyDashboard;
