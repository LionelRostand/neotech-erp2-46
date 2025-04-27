
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
};

export const useGarageInventory = () => {
  const { 
    data: inventory, 
    isLoading, 
    error,
    refetch 
  } = useFirebaseCollection<InventoryItem>(COLLECTIONS.GARAGE.INVENTORY);

  const lowStock = inventory.filter(item => 
    item.quantity <= item.minQuantity && item.quantity > 0
  );
  
  const outOfStock = inventory.filter(item => 
    item.quantity === 0
  );

  return {
    inventory,
    lowStock,
    outOfStock,
    isLoading,
    error,
    refetch
  };
};
