
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Coffee, Pizza, IceCream, Clock } from 'lucide-react';

const RestaurantMenuTemplate: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">La Belle Cuisine</h1>
        <p className="text-muted-foreground italic">Cuisine française authentique</p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <Badge variant="outline" className="text-xs">Ouvert 7j/7</Badge>
          <Badge variant="outline" className="text-xs">12h-14h & 19h-22h</Badge>
          <Badge variant="outline" className="text-xs">Réservation recommandée</Badge>
        </div>
      </header>
      
      <div className="space-y-12">
        <section>
          <div className="flex items-center mb-6">
            <Coffee className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-2xl font-semibold">Entrées</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Soupe à l'oignon",
                description: "Soupe à l'oignon gratinée au fromage et croûtons",
                price: "8.50",
                special: false
              },
              {
                name: "Salade Niçoise",
                description: "Thon, œufs, olives, tomates et légumes de saison",
                price: "10.00",
                special: false
              },
              {
                name: "Foie Gras Maison",
                description: "Foie gras mi-cuit, chutney de figues et pain brioché",
                price: "14.50",
                special: true
              },
              {
                name: "Escargots de Bourgogne",
                description: "Escargots au beurre persillé et ail (6 pièces)",
                price: "12.00",
                special: false
              }
            ].map((item, i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="font-semibold">{item.price}€</div>
                </div>
                {item.special && (
                  <Badge className="mt-2" variant="secondary">Spécialité du chef</Badge>
                )}
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex items-center mb-6">
            <Pizza className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-2xl font-semibold">Plats principaux</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Steak Frites",
                description: "Entrecôte grillée, frites maison et sauce béarnaise",
                price: "22.00",
                special: false
              },
              {
                name: "Coq au Vin",
                description: "Poulet mijoté au vin rouge, champignons et lardons",
                price: "18.50",
                special: true
              },
              {
                name: "Bouillabaisse",
                description: "Ragoût de poisson méditerranéen avec rouille et croûtons",
                price: "24.00",
                special: false
              },
              {
                name: "Ratatouille",
                description: "Légumes du sud confits à l'huile d'olive et herbes de Provence",
                price: "16.00",
                special: false,
                vegetarian: true
              }
            ].map((item, i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="font-semibold">{item.price}€</div>
                </div>
                <div className="mt-2 space-x-2">
                  {item.special && (
                    <Badge variant="secondary">Spécialité du chef</Badge>
                  )}
                  {item.vegetarian && (
                    <Badge variant="outline">Végétarien</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section>
          <div className="flex items-center mb-6">
            <IceCream className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-2xl font-semibold">Desserts</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Crème Brûlée",
                description: "Crème vanillée caramélisée",
                price: "7.50",
                special: false
              },
              {
                name: "Tarte Tatin",
                description: "Tarte aux pommes caramélisées et glace vanille",
                price: "8.00",
                special: true
              },
              {
                name: "Mousse au Chocolat",
                description: "Mousse légère au chocolat noir",
                price: "6.50",
                special: false
              },
              {
                name: "Assortiment de Fromages",
                description: "Sélection de fromages affinés avec fruits secs et pain",
                price: "10.00",
                special: false
              }
            ].map((item, i) => (
              <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="font-semibold">{item.price}€</div>
                </div>
                {item.special && (
                  <Badge className="mt-2" variant="secondary">Spécialité du chef</Badge>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      
      <footer className="mt-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Temps de préparation: environ 20-30 minutes</span>
        </div>
        <Button>Réserver une table</Button>
      </footer>
    </div>
  );
};

export default RestaurantMenuTemplate;
