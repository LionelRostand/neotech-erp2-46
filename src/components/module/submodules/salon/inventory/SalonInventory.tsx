
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Truck, AlertTriangle, Search, Filter, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from '../products/hooks/useProducts';
import { Separator } from "@/components/ui/separator";

const SalonInventory = () => {
  const { products, getLowStockProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  
  const lowStockProducts = getLowStockProducts();
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button size="sm">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total des produits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Box className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{products.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Produits en stock faible</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-2xl font-bold">{lowStockProducts.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Commandes en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">3</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Inventaire des produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Produit</th>
                      <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                      <th className="px-4 py-3 text-center font-medium">Prix</th>
                      <th className="px-4 py-3 text-center font-medium">Stock</th>
                      <th className="px-4 py-3 text-center font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-muted-foreground">{product.brand}</div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                          <td className="px-4 py-3 text-center">{product.price.toFixed(2)} €</td>
                          <td className="px-4 py-3 text-center">{product.stockQuantity}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge 
                              variant={product.stockQuantity <= 5 ? "destructive" : "outline"}
                              className={product.stockQuantity <= 5 ? "" : "bg-green-100 text-green-800 hover:bg-green-100"}
                            >
                              {product.stockQuantity <= 5 ? "Stock faible" : "En stock"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                          Aucun produit trouvé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fournisseurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Gestion des fournisseurs</h3>
                <p className="text-muted-foreground mb-4">
                  Cette section est en cours de développement. Vous pourrez bientôt gérer vos fournisseurs ici.
                </p>
                <Button variant="outline">Ajouter un fournisseur</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Gestion des commandes</h3>
                <p className="text-muted-foreground mb-4">
                  Cette section est en cours de développement. Vous pourrez bientôt gérer vos commandes fournisseurs ici.
                </p>
                <Button variant="outline">Créer une commande</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalonInventory;
