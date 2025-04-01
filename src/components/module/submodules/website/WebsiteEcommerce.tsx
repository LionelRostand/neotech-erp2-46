
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Tag, Percent, CreditCard, Settings } from 'lucide-react';

const WebsiteEcommerce: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Boutique en ligne</h1>
          <p className="text-sm text-muted-foreground">
            Gérez votre boutique en ligne, produits, catégories et commandes
          </p>
        </div>
        <Button>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Voir la boutique
        </Button>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="products" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Produits
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Catégories
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Commandes
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center">
            <Percent className="h-4 w-4 mr-2" />
            Promotions
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vos produits</CardTitle>
              <CardDescription>
                Gérez tous vos produits en vente sur votre boutique en ligne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun produit configuré</h3>
                <p className="text-muted-foreground mb-6">
                  Commencez par ajouter des produits à votre catalogue pour lancer votre boutique en ligne.
                </p>
                <Button>
                  Ajouter un produit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Autres onglets avec contenu similaire */}
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Catégories de produits</CardTitle>
              <CardDescription>
                Organisez vos produits par catégories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12">
                <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Créez des catégories</h3>
                <p className="text-muted-foreground mb-6">
                  Les catégories permettent aux clients de trouver facilement ce qu'ils cherchent.
                </p>
                <Button>
                  Ajouter une catégorie
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteEcommerce;
