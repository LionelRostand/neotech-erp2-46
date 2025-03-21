
import React from 'react';
import { AlertCircle, Check, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for maintenance alerts
const maintenanceAlerts = [
  {
    id: "m1",
    vehicleId: "v1",
    vehicleName: "Renault Clio (AA-123-BC)",
    type: "oil-change",
    dueDate: "2023-06-15",
    mileage: 95000,
    currentMileage: 94500,
    status: "upcoming"
  },
  {
    id: "m2",
    vehicleId: "v5",
    vehicleName: "Peugeot 308 (AB-456-CD)",
    type: "tire-replacement",
    dueDate: "2023-06-18",
    mileage: 80000,
    currentMileage: 79800,
    status: "upcoming"
  },
  {
    id: "m3",
    vehicleId: "v8",
    vehicleName: "Citroen C3 (AC-789-DE)",
    type: "inspection",
    dueDate: "2023-06-10",
    mileage: 60000,
    currentMileage: 60100,
    status: "overdue"
  },
  {
    id: "m4",
    vehicleId: "v12",
    vehicleName: "Dacia Duster (AD-012-EF)",
    type: "oil-change",
    dueDate: "2023-06-20",
    mileage: 45000,
    currentMileage: 44200,
    status: "upcoming"
  },
];

export const MaintenanceAlerts = () => {
  const getAlertTypeLabel = (type: string) => {
    switch(type) {
      case 'oil-change': return 'Vidange';
      case 'tire-replacement': return 'Changement de pneus';
      case 'inspection': return 'Inspection';
      case 'repair': return 'Réparation';
      case 'cleaning': return 'Nettoyage';
      default: return 'Autre';
    }
  };

  return (
    <div className="space-y-4">
      {maintenanceAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Check className="h-12 w-12 text-green-500 mb-2" />
          <h3 className="text-lg font-medium">Aucun entretien planifié</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tous les véhicules sont à jour avec leur planning d'entretien
          </p>
        </div>
      ) : (
        maintenanceAlerts.map((alert) => (
          <div key={alert.id} className="border rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${
                alert.status === 'overdue' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                <Wrench className={`h-5 w-5 ${
                  alert.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'
                }`} />
              </div>
              
              <div>
                <h3 className="font-medium">{alert.vehicleName}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500 mr-2">
                    {getAlertTypeLabel(alert.type)}
                  </span>
                  <Badge variant={alert.status === 'overdue' ? "destructive" : "outline"}>
                    {alert.status === 'overdue' ? 'En retard' : 'À venir'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {alert.status === 'overdue' 
                    ? `Prévu le ${new Date(alert.dueDate).toLocaleDateString('fr-FR')}`
                    : `Prévu le ${new Date(alert.dueDate).toLocaleDateString('fr-FR')}`
                  }
                  {alert.mileage ? ` ou à ${alert.mileage.toLocaleString('fr-FR')} km` : ''}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Planifier</Button>
              <Button variant="default" size="sm">Marquer terminé</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
