
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, AlertTriangle, Tag, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from '../hooks/useProducts';
import { SalonProduct } from '../../types/salon-types';
import { useSalonServices } from '../../services/hooks/useSalonServices';

interface ProductsListProps {
  searchQuery: string;
  categoryFilter: string;
  stockFilter: 'all' | 'low' | 'normal';
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  searchQuery,
  categoryFilter,
  stockFilter
}) => {
  const { products, loading, getRelatedServiceNames } = useProducts();
  const { services } = useSalonServices();
  const { toast } = useToast();

  const filteredProducts = products.filter(product => {
    // Search query filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    // Stock filter
    const matchesStock = 
      stockFilter === 'all' || 
      (stockFilter === 'low' && product.stockQuantity < product.minStock) ||
      (stockFilter === 'normal' && product.stockQuantity >= product.minStock);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleEdit = (product: SalonProduct) => {
    toast({
      title: "Modification à venir",
      description: `La modification de ${product.name} sera disponible prochainement`
    });
  };

  const handleDelete = (product: SalonProduct) => {
    toast({
      title: "Suppression à venir",
      description: `La suppression de ${product.name} sera disponible prochainement`
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center p-8">
            <p className="text-muted-foreground">
              {searchQuery || categoryFilter !== 'all' || stockFilter !== 'all' 
                ? "Aucun produit ne correspond à votre recherche" 
                : "Aucun produit disponible"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Services associés</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const relatedServiceNames = getRelatedServiceNames(product.id);
              const isLowStock = product.stockQuantity < product.minStock;
              
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.brand}</div>
                      <div className="text-xs text-muted-foreground">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {isLowStock ? (
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                          <span className="text-orange-600 font-medium">{product.stockQuantity}</span>
                          <span className="text-muted-foreground text-xs ml-1">/ {product.minStock} min</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-green-600 font-medium">{product.stockQuantity}</span>
                          <span className="text-muted-foreground text-xs ml-1">/ {product.minStock} min</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {relatedServiceNames.length > 0 ? (
                        relatedServiceNames.map((serviceName, idx) => (
                          <Badge key={idx} variant="secondary" className="whitespace-nowrap text-xs">
                            {serviceName}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Aucun service associé</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(product)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductsList;
