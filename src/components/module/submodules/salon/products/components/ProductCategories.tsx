
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from '../hooks/useProducts';
import { Tag, Package, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProductCategories: React.FC = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <p className="text-muted-foreground">Chargement des catégories...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get unique categories and count products in each
  const categories = Array.from(new Set(products.map(product => product.category)))
    .map(category => ({
      name: category,
      count: products.filter(product => product.category === category).length,
      totalValue: products
        .filter(product => product.category === category)
        .reduce((sum, product) => sum + (product.price * product.stockQuantity), 0),
      lowStock: products
        .filter(product => product.category === category && product.stockQuantity < product.minStock)
        .length
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Catégories de Produits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="overflow-hidden">
              <div className="bg-primary/10 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                  <Badge variant="secondary">
                    <Package className="mr-1 h-3 w-3" />
                    {category.count} produits
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">Valeur en stock</div>
                  <div className="font-medium">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(category.totalValue)}
                  </div>
                </div>
                
                {category.lowStock > 0 ? (
                  <div className="flex justify-between items-center text-orange-600">
                    <div className="text-sm flex items-center">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Stock faible
                    </div>
                    <div className="font-medium">{category.lowStock} produits</div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-green-600">
                    <div className="text-sm flex items-center">
                      <ShoppingBag className="mr-1 h-3 w-3" />
                      Stock suffisant
                    </div>
                    <div className="font-medium">Tous les produits</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCategories;
