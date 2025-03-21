
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSalonServices } from '../hooks/useSalonServices';

const ServiceCategories: React.FC = () => {
  const { services, loading } = useSalonServices();

  // Group services by category
  const categoriesMap = services.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  // Calculate category statistics
  const categories = Object.keys(categoriesMap).map(category => {
    const categoryServices = categoriesMap[category];
    const averagePrice = categoryServices.reduce((sum, service) => sum + service.price, 0) / categoryServices.length;
    const averageDuration = categoryServices.reduce((sum, service) => sum + service.duration, 0) / categoryServices.length;
    
    return {
      name: category,
      count: categoryServices.length,
      averagePrice,
      averageDuration,
      services: categoryServices
    };
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-48 animate-pulse">
          <CardContent className="pt-6">
            <div className="h-full flex justify-center items-center">
              <p className="text-muted-foreground">Chargement des catégories...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category) => (
        <Card key={category.name}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{category.name}</CardTitle>
              <Badge>{category.count} service{category.count > 1 ? 's' : ''}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Prix moyen</p>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(category.averagePrice)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Durée moyenne</p>
                  <p className="text-lg font-semibold">
                    {Math.round(category.averageDuration)} min
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {category.services.map((service) => (
                    <Badge key={service.id} variant="outline">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceCategories;
