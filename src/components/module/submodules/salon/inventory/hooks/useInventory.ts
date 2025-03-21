
import { useState } from 'react';
import { useProducts } from '../../products/hooks/useProducts';
import { Supplier, Order, NewSupplier, NewOrder } from '../types/inventory-types';
import { toast } from 'sonner';

export const useInventory = () => {
  const { products, getLowStockProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  // Mock data for suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 'sup1',
      name: 'L\'Oréal Professional',
      contactName: 'Jean Dupont',
      email: 'contact@loreal-pro.fr',
      phone: '01 23 45 67 89',
      address: '14 Rue Royale, 75008 Paris',
      products: ['Shampoing', 'Après-shampoing', 'Coloration'],
      notes: 'Fournisseur principal pour les produits de coloration',
      createdAt: '2023-01-15T10:30:00Z'
    },
    {
      id: 'sup2',
      name: 'Schwarzkopf Professional',
      contactName: 'Marie Laurent',
      email: 'contact@schwarzkopf-pro.fr',
      phone: '01 23 45 67 90',
      address: '27 Avenue des Champs-Élysées, 75008 Paris',
      products: ['Shampoing', 'Styling', 'Soin'],
      notes: 'Produits de qualité pour styling et soins',
      createdAt: '2023-02-20T14:15:00Z'
    }
  ]);

  // Mock data for orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord1',
      supplierId: 'sup1',
      supplierName: 'L\'Oréal Professional',
      status: 'delivered',
      orderDate: '2023-05-10T09:30:00Z',
      expectedDeliveryDate: '2023-05-15T09:30:00Z',
      deliveryDate: '2023-05-14T14:30:00Z',
      products: [
        {productId: 'prod1', name: 'Shampoing Excellence', quantity: 10, price: 12.50},
        {productId: 'prod2', name: 'Coloration Majirel', quantity: 15, price: 8.75}
      ],
      total: 256.25,
      notes: 'Commande mensuelle de produits L\'Oréal'
    },
    {
      id: 'ord2',
      supplierId: 'sup2',
      supplierName: 'Schwarzkopf Professional',
      status: 'pending',
      orderDate: '2023-06-05T10:15:00Z',
      expectedDeliveryDate: '2023-06-10T10:15:00Z',
      deliveryDate: null,
      products: [
        {productId: 'prod3', name: 'Gel coiffant OSIS+', quantity: 8, price: 9.99},
        {productId: 'prod4', name: 'Spray fixation BC Bonacure', quantity: 12, price: 11.50}
      ],
      total: 218.92,
      notes: 'Commande urgente de produits de styling'
    },
    {
      id: 'ord3',
      supplierId: 'sup1',
      supplierName: 'L\'Oréal Professional',
      status: 'shipped',
      orderDate: '2023-06-15T15:45:00Z',
      expectedDeliveryDate: '2023-06-20T15:45:00Z',
      deliveryDate: null,
      products: [
        {productId: 'prod5', name: 'Après-shampoing Série Expert', quantity: 10, price: 14.25},
        {productId: 'prod6', name: 'Masque Absolut Repair', quantity: 5, price: 18.50}
      ],
      total: 235.00,
      notes: 'Commande pour reconstituer le stock de soins'
    }
  ]);
  
  const lowStockProducts = getLowStockProducts();
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add a new supplier
  const addSupplier = (newSupplier: NewSupplier) => {
    // Validate form
    if (!newSupplier.name || !newSupplier.email || !newSupplier.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }

    // Create a new supplier
    const supplier: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupplier.name,
      contactName: newSupplier.contactName,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      products: [],
      notes: newSupplier.notes,
      createdAt: new Date().toISOString()
    };

    setSuppliers(prev => [...prev, supplier]);
    toast.success("Fournisseur ajouté avec succès");
    return true;
  };

  // Create a new order
  const createOrder = (newOrder: NewOrder) => {
    // Validate form
    if (!newOrder.supplierId) {
      toast.error("Veuillez sélectionner un fournisseur");
      return false;
    }

    // Find the supplier
    const supplier = suppliers.find(s => s.id === newOrder.supplierId);
    if (!supplier) {
      toast.error("Fournisseur introuvable");
      return false;
    }

    // Create a new order (simplified for demonstration)
    const order: Order = {
      id: `ord-${Date.now()}`,
      supplierId: newOrder.supplierId,
      supplierName: supplier.name,
      status: 'pending',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: newOrder.expectedDeliveryDate ? new Date(newOrder.expectedDeliveryDate).toISOString() : null,
      deliveryDate: null,
      products: [], // In a real app, we'd add selected products here
      total: 0, // In a real app, we'd calculate this
      notes: newOrder.notes
    };

    setOrders(prev => [...prev, order]);
    toast.success("Commande créée avec succès");
    return true;
  };

  return {
    products,
    filteredProducts,
    lowStockProducts,
    suppliers,
    orders,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    addSupplier,
    createOrder
  };
};
