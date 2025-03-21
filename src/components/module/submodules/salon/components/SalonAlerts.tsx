
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, AlertTriangle, CreditCard, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

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

  const totalAlerts = newAppointments + pendingPayments + lowStockProducts;

  return (
    <Alert className="border-orange-300 bg-orange-50 text-orange-800">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="flex items-center gap-2">
        Alertes
        <Badge variant="outline" className="bg-orange-100 text-orange-800 ml-2">
          {totalAlerts}
        </Badge>
      </AlertTitle>
      <AlertDescription>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          {newAppointments > 0 && (
            <Link to="/modules/salon/appointments" className="flex items-center hover:underline">
              <Calendar className="h-4 w-4 mr-2 text-orange-600" />
              <span>{newAppointments} nouveau{newAppointments > 1 ? 'x' : ''} rendez-vous à confirmer</span>
            </Link>
          )}
          {pendingPayments > 0 && (
            <Link to="/modules/salon/billing" className="flex items-center hover:underline">
              <CreditCard className="h-4 w-4 mr-2 text-orange-600" />
              <span>{pendingPayments} paiement{pendingPayments > 1 ? 's' : ''} en attente</span>
            </Link>
          )}
          {lowStockProducts > 0 && (
            <Link to="/modules/salon/products" className="flex items-center hover:underline">
              <Package className="h-4 w-4 mr-2 text-orange-600" />
              <span>{lowStockProducts} produit{lowStockProducts > 1 ? 's' : ''} en stock faible</span>
            </Link>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SalonAlerts;
