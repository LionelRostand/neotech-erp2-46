
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddMaintenanceDialog from './AddMaintenanceDialog';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

const GarageMaintenanceDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { data: maintenances = [], isLoading } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.GARAGE.MAINTENANCE));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error fetching maintenances:", error);
        return [];
      }
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{maintenances.length}</div>
            <p className="text-muted-foreground">Total maintenances</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {maintenances.filter(m => m.status === 'scheduled').length}
            </div>
            <p className="text-muted-foreground">Maintenances planifiées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {maintenances.filter(m => m.status === 'completed').length}
            </div>
            <p className="text-muted-foreground">Maintenances terminées</p>
          </CardContent>
        </Card>
      </div>

      {!isLoading && (
        <Card>
          <div className="p-4 font-medium border-b">Liste des maintenances</div>
          <div className="p-4">
            {maintenances.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune maintenance trouvée. Créez votre première maintenance !
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Véhicule</th>
                      <th className="text-left p-2">Client</th>
                      <th className="text-left p-2">Mécanicien</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Statut</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenances.map((maintenance) => (
                      <tr key={maintenance.id} className="border-b">
                        <td className="p-2">{maintenance.vehicleName}</td>
                        <td className="p-2">{maintenance.clientName}</td>
                        <td className="p-2">{maintenance.mechanicName}</td>
                        <td className="p-2">{maintenance.date}</td>
                        <td className="p-2">{maintenance.status}</td>
                        <td className="p-2 text-right">
                          <Button variant="ghost" size="sm">Voir</Button>
                          <Button variant="ghost" size="sm">Modifier</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Supprimer</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      <AddMaintenanceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
