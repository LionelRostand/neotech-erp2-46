
import React from 'react';
import { useFreightShipments } from '@/hooks/freight/useFreightShipments';
// Utilisation du badge Tailwind pour chaque statut important
const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  confirmed: "Confirmée",
  in_transit: "En transit",
  delivered: "Livrée",
  cancelled: "Annulée",
  delayed: "Retardée"
};

const getStatColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'in_transit': return 'bg-blue-100 text-blue-700';
    case 'confirmed': return 'bg-indigo-100 text-indigo-700';
    case 'draft': return 'bg-gray-100 text-gray-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'delayed': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const FreightShipmentsDashboard: React.FC = () => {
  const { shipments, isLoading } = useFreightShipments();

  const total = shipments.length;
  const statsByStatus = shipments.reduce<Record<string, number>>((acc, s) => {
    acc[s.status || 'draft'] = (acc[s.status || 'draft'] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
      <div className="p-4 rounded-xl border bg-card flex flex-col items-center justify-center shadow-sm">
        <span className="text-lg font-bold">{isLoading ? "…" : total}</span>
        <span className="text-xs text-muted-foreground">Total colis</span>
      </div>
      {Object.entries(SHIPMENT_STATUS_LABELS).map(([status, label]) => (
        <div 
          key={status}
          className={`p-4 rounded-xl border bg-card flex flex-col items-center justify-center shadow-sm ${getStatColor(status)}`}
        >
          <span className="text-lg font-bold">
            {isLoading ? "…" : statsByStatus[status] || 0}
          </span>
          <span className="text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
};

export default FreightShipmentsDashboard;
