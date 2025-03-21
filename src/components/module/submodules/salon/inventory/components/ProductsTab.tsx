
import React from 'react';
import { Box, AlertTriangle, Truck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductsTabProps {
  products: any[];
  lowStockProducts: any[];
  orders: any[];
  filteredProducts: any[];
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ 
  products, 
  lowStockProducts, 
  orders, 
  filteredProducts 
}) => {
  return (
    <div className="space-y-4">
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
              <span className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</span>
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
    </div>
  );
};
