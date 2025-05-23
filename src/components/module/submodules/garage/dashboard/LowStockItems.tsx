
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';

const LowStockItems = () => {
  const { inventory = [] } = useGarageData();
  
  // Ensure inventory is always an array
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  
  const lowStockItems = safeInventory.filter(item => 
    item && 
    (item.status === 'low_stock' || 
     (item.quantity !== undefined && 
      item.minQuantity !== undefined && 
      item.quantity <= item.minQuantity))
  );

  if (lowStockItems.length === 0) {
    return <div className="text-center text-gray-500 py-4">Aucun produit en stock faible</div>;
  }

  return (
    <div className="space-y-3">
      {lowStockItems.slice(0, 5).map((item) => (
        <div key={item.id || `item-${Math.random()}`} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
          <div>
            <p className="font-medium">{item.name || 'Sans nom'}</p>
            <p className="text-sm text-gray-500">{item.category || 'Non catégorisé'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{item.quantity !== undefined ? `${item.quantity} en stock` : 'Stock inconnu'}</p>
            <p className="text-xs text-amber-500">Min: {item.minQuantity || '0'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowStockItems;
