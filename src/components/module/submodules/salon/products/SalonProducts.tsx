
import React, { useState } from 'react';
import ProductsList from './components/ProductsList';
import ProductsToolbar from './components/ProductsToolbar';
import ProductCategories from './components/ProductCategories';
import ProductServiceAssociations from './components/ProductServiceAssociations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from './hooks/useProducts';

const SalonProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'normal'>('all');
  const { getLowStockProducts, getTotalSoldToday } = useProducts();
  
  const lowStockCount = getLowStockProducts().length;
  const todaySales = getTotalSoldToday();

  return (
    <div className="space-y-6">
      <ProductsToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="liste" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="liste">Liste des produits</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="associations">Associations Services</TabsTrigger>
            </TabsList>
            
            <TabsContent value="liste">
              <ProductsList 
                searchQuery={searchQuery}
                categoryFilter={categoryFilter}
                stockFilter={stockFilter}
              />
            </TabsContent>
            
            <TabsContent value="categories">
              <ProductCategories />
            </TabsContent>
            
            <TabsContent value="associations">
              <ProductServiceAssociations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SalonProducts;
