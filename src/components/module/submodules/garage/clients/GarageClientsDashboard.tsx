
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Car } from "lucide-react";
import StatCard from '@/components/StatCard';
import { useNavigate } from 'react-router-dom';
import AddClientDialog from './AddClientDialog';
import { useState } from 'react';

const GarageClientsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Clients"
          value="124"
          icon={<Users className="h-5 w-5 text-blue-500" />}
          description="15 nouveaux ce mois"
        />
        <StatCard
          title="Véhicules Actifs"
          value="156"
          icon={<Car className="h-5 w-5 text-green-500" />}
          description="138 en bon état"
        />
        <StatCard
          title="En Maintenance"
          value="18"
          icon={<Car className="h-5 w-5 text-amber-500" />}
          description="5 en attente de pièces"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clients Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Liste à implémenter plus tard */}
              <p className="text-sm text-gray-500">Aucun client récent</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Véhicules en Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Liste à implémenter plus tard */}
              <p className="text-sm text-gray-500">Aucun véhicule en maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddClientDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default GarageClientsDashboard;
