
import React from 'react';
import { Button } from "@/components/ui/button";
import { Package } from 'lucide-react';

// Sample data for low stock items
const items = [
  { 
    id: 'P001', 
    name: 'Filtre à huile', 
    reference: 'FH-2345-R',
    stock: 2, 
    minStock: 5,
    supplier: 'Auto Parts Pro'
  },
  { 
    id: 'P015', 
    name: 'Plaquettes de frein', 
    reference: 'PF-5689-P',
    stock: 1, 
    minStock: 8,
    supplier: 'Brembo'
  },
  { 
    id: 'P023', 
    name: 'Liquide de refroidissement', 
    reference: 'LR-1122-C',
    stock: 3, 
    minStock: 10,
    supplier: 'Total'
  },
  { 
    id: 'P047', 
    name: 'Ampoules de phare', 
    reference: 'AP-3398-L',
    stock: 4, 
    minStock: 15,
    supplier: 'Philips'
  },
  { 
    id: 'P052', 
    name: 'Joints de culasse', 
    reference: 'JC-6754-R',
    stock: 1, 
    minStock: 3,
    supplier: 'Elring'
  }
];

export const LowStockItems = () => {
  const handleOrderItem = (itemId: string) => {
    console.log(`Ordering item ${itemId}`);
    // Here we would implement the order functionality
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Aucun article en stock critique
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
          {items.map(item => (
            <div 
              key={item.id} 
              className={`flex justify-between items-center p-3 rounded-md hover:bg-gray-100 transition-colors ${
                item.stock === 0 ? 'bg-red-50' : 'bg-amber-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Package className={`h-8 w-8 p-1.5 rounded-md ${
                  item.stock === 0 ? 'text-red-500 bg-red-100' : 'text-amber-500 bg-amber-100'
                }`} />
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">{item.reference} - {item.supplier}</div>
                  <div className="text-xs">
                    <span className="font-medium">{item.stock} en stock</span>
                    <span className="text-gray-500 ml-2">
                      (Min: {item.minStock})
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOrderItem(item.id)}
                className="whitespace-nowrap"
              >
                Commander
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
