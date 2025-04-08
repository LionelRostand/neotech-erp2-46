
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PackageStatusBadgeProps {
  status: string;
}

const PackageStatusBadge: React.FC<PackageStatusBadgeProps> = ({ status }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-slate-100 text-slate-800 border-none">Brouillon</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 border-none">Confirmée</Badge>;
      case 'in_transit':
        return <Badge className="bg-amber-100 text-amber-800 border-none">En transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 border-none">Livrée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-none">Annulée</Badge>;
      case 'delayed':
        return <Badge className="bg-purple-100 text-purple-800 border-none">Retardée</Badge>;
      case 'processing':
        return <Badge className="bg-indigo-100 text-indigo-800 border-none">En traitement</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-emerald-100 text-emerald-800 border-none">En livraison</Badge>;
      case 'exception':
        return <Badge className="bg-rose-100 text-rose-800 border-none">Problème</Badge>;
      case 'returned':
        return <Badge className="bg-gray-100 text-gray-800 border-none">Retournée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return getStatusBadge();
};

export default PackageStatusBadge;
