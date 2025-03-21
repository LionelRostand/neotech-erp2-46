
import { useState, useEffect } from 'react';
import { SalonProduct } from '../../types/salon-types';
import { useSalonServices } from '../../services/hooks/useSalonServices';

export const useProducts = () => {
  const [products, setProducts] = useState<SalonProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { services } = useSalonServices();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Here we would normally fetch from an API
        // For demo purposes, we use mock data
        const mockProducts: SalonProduct[] = [
          {
            id: "1",
            name: "Shampooing Réparateur",
            brand: "L'Oréal Professionnel",
            description: "Shampooing pour cheveux abîmés",
            price: 18.50,
            stockQuantity: 3,
            minStock: 5,
            category: "Shampooing",
            imageUrl: "/placeholder.svg",
            relatedServices: ["1", "3"],
            soldToday: 2,
            soldTotal: 28
          },
          {
            id: "2",
            name: "Masque Hydratant",
            brand: "Kérastase",
            description: "Masque nourrissant pour cheveux secs",
            price: 32.00,
            stockQuantity: 2,
            minStock: 5,
            category: "Soins",
            imageUrl: "/placeholder.svg",
            relatedServices: ["3", "7"],
            soldToday: 1,
            soldTotal: 15
          },
          {
            id: "3",
            name: "Huile Capillaire",
            brand: "Moroccanoil",
            description: "Huile de traitement pour tous types de cheveux",
            price: 36.00,
            stockQuantity: 4,
            minStock: 5,
            category: "Soins",
            imageUrl: "/placeholder.svg",
            relatedServices: ["3", "7", "9"],
            soldToday: 0,
            soldTotal: 12
          },
          {
            id: "4",
            name: "Spray Volumisant",
            brand: "Redken",
            description: "Spray volumisant pour cheveux fins",
            price: 24.50,
            stockQuantity: 8,
            minStock: 5,
            category: "Coiffage",
            imageUrl: "/placeholder.svg",
            relatedServices: ["1", "9", "10"],
            soldToday: 0,
            soldTotal: 6
          },
          {
            id: "5",
            name: "Gel Fixation Forte",
            brand: "Schwarzkopf",
            description: "Gel coiffant à tenue forte",
            price: 15.90,
            stockQuantity: 10,
            minStock: 6,
            category: "Coiffage",
            imageUrl: "/placeholder.svg",
            relatedServices: ["2", "6"],
            soldToday: 2,
            soldTotal: 22
          },
          {
            id: "6",
            name: "Cire Texturisante",
            brand: "American Crew",
            description: "Cire coiffante pour texture et définition",
            price: 17.50,
            stockQuantity: 7,
            minStock: 4,
            category: "Coiffage",
            imageUrl: "/placeholder.svg",
            relatedServices: ["2", "6"],
            soldToday: 1,
            soldTotal: 18
          },
          {
            id: "7",
            name: "Shampooing Anti-pelliculaire",
            brand: "Head & Shoulders",
            description: "Shampooing traitant contre les pellicules",
            price: 12.90,
            stockQuantity: 6,
            minStock: 4,
            category: "Shampooing",
            imageUrl: "/placeholder.svg",
            relatedServices: [],
            soldToday: 0,
            soldTotal: 8
          },
          {
            id: "8",
            name: "Coloration Semi-Permanente",
            brand: "Wella",
            description: "Coloration douce sans ammoniaque",
            price: 28.00,
            stockQuantity: 4,
            minStock: 3,
            category: "Coloration",
            imageUrl: "/placeholder.svg",
            relatedServices: ["3", "4", "8"],
            soldToday: 0,
            soldTotal: 5
          },
          {
            id: "9",
            name: "Laque Professionnelle",
            brand: "Tigi",
            description: "Laque à tenue forte sans effet carton",
            price: 19.90,
            stockQuantity: 3,
            minStock: 5,
            category: "Coiffage",
            imageUrl: "/placeholder.svg",
            relatedServices: ["9", "10"],
            soldToday: 1,
            soldTotal: 14
          },
          {
            id: "10",
            name: "Sérum Anti-Frisottis",
            brand: "Kérastase",
            description: "Sérum lissant contre les frisottis",
            price: 29.90,
            stockQuantity: 2,
            minStock: 4,
            category: "Soins",
            imageUrl: "/placeholder.svg",
            relatedServices: ["1", "3", "7"],
            soldToday: 0,
            soldTotal: 10
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get product related service names
  const getRelatedServiceNames = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.relatedServices || !product.relatedServices.length) {
      return [];
    }

    return services
      .filter(service => product.relatedServices?.includes(service.id))
      .map(service => service.name);
  };

  // Get low stock products
  const getLowStockProducts = () => {
    return products.filter(product => product.stockQuantity < product.minStock);
  };

  // Calculate total sales today
  const getTotalSoldToday = () => {
    return products.reduce((total, product) => total + product.soldToday, 0);
  };

  return {
    products,
    loading,
    error,
    getLowStockProducts,
    getRelatedServiceNames,
    getTotalSoldToday
  };
};
