
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface TransportAlertsProps {
  maintenanceVehicles: number;
  pendingPayments: number;
  todayReservations: number;
}

const TransportAlerts: React.FC<TransportAlertsProps> = ({ 
  maintenanceVehicles, 
  pendingPayments, 
  todayReservations 
}) => {
  return (
    <Alert className="border-orange-300 bg-orange-50 text-orange-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Alertes</AlertTitle>
      <AlertDescription>
        {maintenanceVehicles} véhicules en maintenance, {pendingPayments} paiements en attente, {todayReservations} réservations aujourd'hui
      </AlertDescription>
    </Alert>
  );
};

export default TransportAlerts;
