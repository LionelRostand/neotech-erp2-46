
import { ShoppingBag, Package, ShoppingCart, CreditCard, Truck as DeliveryTruck, LineChart, Store, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const ecommerceModule: AppModule = {
  id: 10,
  name: "E-Commerce",
  description: "Gestion de boutique en ligne, produits et commandes",
  href: "/modules/ecommerce",
  icon: createIcon(ShoppingBag),
  category: 'digital', // Added the category property
  submodules: [
    { id: "ecommerce-products", name: "Produits", href: "/modules/ecommerce/products", icon: createIcon(Package) },
    { id: "ecommerce-orders", name: "Commandes", href: "/modules/ecommerce/orders", icon: createIcon(ShoppingCart) },
    { id: "ecommerce-payments", name: "Paiements", href: "/modules/ecommerce/payments", icon: createIcon(CreditCard) },
    { id: "ecommerce-shipping", name: "Livraison", href: "/modules/ecommerce/shipping", icon: createIcon(DeliveryTruck) },
    { id: "ecommerce-stats", name: "Statistiques", href: "/modules/ecommerce/stats", icon: createIcon(LineChart) },
    { id: "ecommerce-shop", name: "Boutique", href: "/modules/ecommerce/shop", icon: createIcon(Store) },
    { id: "ecommerce-settings", name: "Paramètres", href: "/modules/ecommerce/settings", icon: createIcon(Settings) }
  ]
};
