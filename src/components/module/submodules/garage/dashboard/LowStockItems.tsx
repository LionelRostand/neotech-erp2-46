
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { useHasPermission } from '@/lib/fetchCollectionData';
import { Shield } from 'lucide-react';

const LowStockItems = () => {
  const { inventory } = useGarageData();
  const hasViewPermission = useHasPermission('garage-inventory', 'view');
  
  if (!hasViewPermission) {
    return (
      <div className="text-center py-4 border rounded-md">
        <Shield className="mx-auto mb-2 text-gray-400" />
        <p className="text-gray-500">Vous n'avez pas les permissions nécessaires</p>
      </div>
    );
  }
  
  // Filtrer les articles dont le stock est faible
  const lowStockItems = inventory.filter(item => {
    // Si le statut est explicitement 'low_stock'
    if (item?.status === 'low_stock') return true;
    
    // Si la quantité est inférieure ou égale au minimum requis
    if (item?.quantity !== undefined && item?.minQuantity !== undefined) {
      return item.quantity <= item.minQuantity;
    }
    
    // Si la quantité est simplement faible (moins de 5 par défaut)
    if (item?.quantity !== undefined) {
      return item.quantity < 5;
    }
    
    return false;
  });

  if (lowStockItems.length === 0) {
    return <div className="text-center text-gray-500 py-4">Aucun produit en stock faible</div>;
  }

  return (
    <div className="space-y-3">
      {lowStockItems.slice(0, 5).map((item) => (
        <div key={item.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
          <div>
            <p className="font-medium">{item.name || "Article sans nom"}</p>
            <p className="text-sm text-gray-500">{item.category || "Catégorie non définie"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{item.quantity !== undefined ? item.quantity : 0} en stock</p>
            <p className="text-xs text-amber-500">Min: {item.minQuantity !== undefined ? item.minQuantity : 5}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowStockItems;
