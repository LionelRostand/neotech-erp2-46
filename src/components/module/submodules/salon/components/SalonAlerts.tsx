
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SalonAlertsProps {
  newAppointments: number;
  pendingPayments: number;
  lowStockProducts: number;
}

const SalonAlerts: React.FC<SalonAlertsProps> = ({ 
  newAppointments, 
  pendingPayments, 
  lowStockProducts 
}) => {
  const hasAlerts = newAppointments > 0 || pendingPayments > 0 || lowStockProducts > 0;

  if (!hasAlerts) return null;

  return (
    <Alert className="border-orange-300 bg-orange-50 text-orange-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Alertes</AlertTitle>
      <AlertDescription>
        {newAppointments > 0 && (
          <span className="mr-4">{newAppointments} nouveau{newAppointments > 1 ? 'x' : ''} rendez-vous à confirmer</span>
        )}
        {pendingPayments > 0 && (
          <span className="mr-4">{pendingPayments} paiement{pendingPayments > 1 ? 's' : ''} en attente</span>
        )}
        {lowStockProducts > 0 && (
          <span>{lowStockProducts} produit{lowStockProducts > 1 ? 's' : ''} en stock faible</span>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SalonAlerts;
