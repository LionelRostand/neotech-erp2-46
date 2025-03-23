
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from '../hooks/useProducts';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  stockFilter: 'all' | 'low' | 'normal';
  setStockFilter: (filter: 'all' | 'low' | 'normal') => void;
}

const ProductsToolbar: React.FC<ProductsToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter
}) => {
  const { products } = useProducts();
  const { toast } = useToast();
  
  // Extract unique categories from products and ensure no empty strings
  const categories = ['all', ...Array.from(new Set(products.map(product => product.category || 'non-catégorisé')))];

  const handleAddProduct = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'ajout de produits sera disponible prochainement"
    });
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'Toutes les catégories' : category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select value={stockFilter} onValueChange={(value: 'all' | 'low' | 'normal') => setStockFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="État du stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Tous les produits</SelectItem>
              <SelectItem value="low">Stock faible</SelectItem>
              <SelectItem value="normal">Stock normal</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={handleAddProduct} className="shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un produit
      </Button>
    </div>
  );
};

export default ProductsToolbar;
