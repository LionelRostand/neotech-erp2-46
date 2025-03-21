
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductInventoryProps {
  lowStockProducts: number;
  totalProductsSold: number;
}

const ProductInventory: React.FC<ProductInventoryProps> = ({ 
  lowStockProducts,
  totalProductsSold
}) => {
  const mockProducts = [
    { name: "Shampooing Réparateur", stock: 3, minStock: 5, sold: 12 },
    { name: "Masque Hydratant", stock: 2, minStock: 5, sold: 8 },
    { name: "Huile Capillaire", stock: 4, minStock: 5, sold: 5 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span>Produits</span>
          {lowStockProducts > 0 && (
            <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
              {lowStockProducts} en stock faible
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Vendus aujourd'hui</p>
            <div className="flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-2xl font-bold text-blue-600">{totalProductsSold}</p>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium text-gray-700 mb-2">Produits à réapprovisionner :</p>
            {mockProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="flex items-center">
                  {product.stock < product.minStock && (
                    <AlertTriangle className="h-3 w-3 text-orange-500 mr-2" />
                  )}
                  {product.name}
                </span>
                <span className={`font-medium ${product.stock < product.minStock ? 'text-orange-600' : 'text-gray-600'}`}>
                  {product.stock} en stock
                </span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-2 text-blue-600 text-sm font-medium hover:underline">
            Gérer les stocks
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInventory;
