
import React, { useState } from 'react';
import { Search, Filter, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInventory } from './hooks/useInventory';
import { ProductsTab } from './components/ProductsTab';
import { SuppliersTab } from './components/SuppliersTab';
import { OrdersTab } from './components/OrdersTab';
import { NewProductDialog } from './components/NewProductDialog';
import { NewSupplierSheet } from './components/NewSupplierSheet';
import { NewOrderSheet } from './components/NewOrderSheet';

const SalonInventory = () => {
  const {
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
  } = useInventory();

  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [showNewSupplierSheet, setShowNewSupplierSheet] = useState(false);
  const [showNewOrderSheet, setShowNewOrderSheet] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button size="sm" onClick={() => setShowNewProductDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <ProductsTab
            products={products}
            lowStockProducts={lowStockProducts}
            orders={orders}
            filteredProducts={filteredProducts}
          />
        </TabsContent>
        
        <TabsContent value="suppliers" className="space-y-4">
          <SuppliersTab 
            suppliers={suppliers}
            onAddSupplier={() => setShowNewSupplierSheet(true)}
          />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <OrdersTab 
            orders={orders}
            onCreateOrder={() => setShowNewOrderSheet(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs and Sheets */}
      <NewProductDialog 
        isOpen={showNewProductDialog} 
        onClose={() => setShowNewProductDialog(false)} 
      />
      
      <NewSupplierSheet 
        isOpen={showNewSupplierSheet} 
        onClose={() => setShowNewSupplierSheet(false)}
        onAddSupplier={addSupplier}
      />
      
      <NewOrderSheet 
        isOpen={showNewOrderSheet} 
        onClose={() => setShowNewOrderSheet(false)}
        suppliers={suppliers}
        onCreateOrder={createOrder}
      />
    </div>
  );
};

export default SalonInventory;
