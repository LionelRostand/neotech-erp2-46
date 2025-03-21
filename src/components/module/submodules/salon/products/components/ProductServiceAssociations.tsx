
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from '../hooks/useProducts';
import { useSalonServices } from '../../services/hooks/useSalonServices';
import { Scissors, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProductServiceAssociations: React.FC = () => {
  const { products, loading: productsLoading } = useProducts();
  const { services, loading: servicesLoading } = useSalonServices();

  const loading = productsLoading || servicesLoading;

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <p className="text-muted-foreground">Chargement des associations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Map services to their associated products
  const serviceProductMap = services.map(service => {
    const associatedProducts = products.filter(product => 
      product.relatedServices?.includes(service.id)
    );
    
    return {
      service,
      products: associatedProducts
    };
  }).filter(item => item.products.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scissors className="mr-2 h-5 w-5" />
          Produits associés aux services
        </CardTitle>
      </CardHeader>
      <CardContent>
        {serviceProductMap.length === 0 ? (
          <div className="text-center text-muted-foreground p-6">
            Aucune association produit-service disponible
          </div>
        ) : (
          <div className="space-y-6">
            {serviceProductMap.map(({ service, products }) => (
              <div key={service.id} className="border rounded-lg overflow-hidden">
                <div className="bg-primary/10 p-4">
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2">Produits recommandés :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {products.map(product => (
                      <div key={product.id} className="flex items-center space-x-2 p-2 border rounded-md">
                        <Package className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.brand}</div>
                        </div>
                        <Badge variant="outline">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductServiceAssociations;
