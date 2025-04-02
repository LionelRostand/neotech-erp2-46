
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Coffee, UtensilsCrossed, Wine, Clock, Info, MapPin, Phone } from 'lucide-react';

const RestaurantMenuTemplate: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold mb-2">Le Bistro Parisien</h1>
        <p className="text-lg text-muted-foreground mb-4">Cuisine française authentique</p>
        <div className="flex items-center justify-center space-x-4">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <Separator orientation="vertical" className="h-6" />
          <span className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" /> Ouvert: 11h - 23h
          </span>
        </div>
      </header>

      {/* Navigation */}
      <Tabs defaultValue="menu" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        {/* Menu Tab */}
        <TabsContent value="menu" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {/* Category: Entrées */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <UtensilsCrossed className="h-6 w-6 mr-2 text-amber-600" />
                  <h2 className="text-2xl font-serif font-semibold">Entrées</h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "Soupe à l'oignon",
                      description: "Oignons caramélisés, bouillon de boeuf, croûtons, fromage gratiné",
                      price: "9€",
                      tag: "Populaire"
                    },
                    {
                      name: "Salade Niçoise",
                      description: "Thon, olives, oeuf dur, tomates, haricots verts, poivrons",
                      price: "12€"
                    },
                    {
                      name: "Foie Gras Maison",
                      description: "Accompagné de pain brioché et chutney de figues",
                      price: "16€",
                      tag: "Chef"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.tag && (
                            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                              {item.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="font-medium whitespace-nowrap self-start">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Plats Principaux */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <UtensilsCrossed className="h-6 w-6 mr-2 text-amber-600" />
                  <h2 className="text-2xl font-serif font-semibold">Plats Principaux</h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "Coq au Vin",
                      description: "Poulet mijoté au vin rouge, lardons, champignons, pommes de terre",
                      price: "24€"
                    },
                    {
                      name: "Boeuf Bourguignon",
                      description: "Boeuf mijoté, carottes, oignons, champignons, sauce au vin rouge",
                      price: "26€",
                      tag: "Populaire"
                    },
                    {
                      name: "Confit de Canard",
                      description: "Cuisse de canard confite, pommes de terre sarladaises, salade verte",
                      price: "28€"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.tag && (
                            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                              {item.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="font-medium whitespace-nowrap self-start">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Desserts */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Coffee className="h-6 w-6 mr-2 text-amber-600" />
                  <h2 className="text-2xl font-serif font-semibold">Desserts</h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "Crème Brûlée",
                      description: "Vanille de Madagascar, sucre caramélisé",
                      price: "9€"
                    },
                    {
                      name: "Tarte Tatin",
                      description: "Pommes caramélisées, pâte feuilletée, crème fraîche",
                      price: "10€",
                      tag: "Chef"
                    },
                    {
                      name: "Mousse au Chocolat",
                      description: "Chocolat noir 70%, chantilly maison",
                      price: "8€"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{item.name}</h3>
                          {item.tag && (
                            <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                              {item.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="font-medium whitespace-nowrap self-start">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="sticky top-4 space-y-6">
                {/* Special Menu */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-serif text-lg font-medium mb-3">Menu du Chef</h3>
                  <p className="text-sm text-amber-900 mb-3">3 plats avec un verre de vin</p>
                  
                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="font-medium">Entrée:</span> Foie Gras ou Soupe à l'oignon
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Plat:</span> Coq au Vin ou Boeuf Bourguignon
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Dessert:</span> Crème Brûlée ou Tarte Tatin
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-semibold">42€</span>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      Réserver
                    </Button>
                  </div>
                </div>
                
                {/* Wine Selection */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Wine className="h-5 w-5 mr-2 text-amber-600" />
                    <h3 className="font-serif text-lg font-medium">Notre Sélection de Vins</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Vins Rouges</h4>
                      <ul className="text-sm space-y-1 mt-1">
                        <li className="flex justify-between">
                          <span>Bordeaux Saint-Émilion</span>
                          <span>38€</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Bourgogne Pinot Noir</span>
                          <span>42€</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Vins Blancs</h4>
                      <ul className="text-sm space-y-1 mt-1">
                        <li className="flex justify-between">
                          <span>Chablis Premier Cru</span>
                          <span>39€</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sancerre Loire</span>
                          <span>36€</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 mr-2" />
                    <h3 className="font-serif text-lg font-medium">Horaires</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lundi - Jeudi</span>
                      <span>11h - 22h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vendredi - Samedi</span>
                      <span>11h - 23h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche</span>
                      <span>12h - 21h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* About Tab */}
        <TabsContent value="about" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Notre Histoire</h2>
              <p className="text-muted-foreground mb-4">
                Fondé en 1998 par le chef Jean Dupont, Le Bistro Parisien apporte l'essence de la cuisine française traditionnelle 
                dans une atmosphère chaleureuse et accueillante.
              </p>
              <p className="text-muted-foreground mb-4">
                Notre philosophie est simple : des ingrédients frais, des techniques traditionnelles et une passion pour la gastronomie.
                Chaque plat raconte une histoire de la riche culture culinaire française.
              </p>
              <p className="text-muted-foreground">
                Nous travaillons avec des producteurs locaux pour garantir la fraîcheur et la qualité de nos ingrédients,
                tout en soutenant l'économie locale et en réduisant notre empreinte environnementale.
              </p>
            </div>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Image du restaurant</p>
            </div>
            
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-serif font-semibold mb-4">Notre Équipe</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { name: "Jean Dupont", role: "Chef Exécutif" },
                  { name: "Marie Laurent", role: "Chef Pâtissier" },
                  { name: "Pierre Martin", role: "Sommelier" }
                ].map((member, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-muted mb-4"></div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Gallery Tab */}
        <TabsContent value="gallery" className="pt-6">
          <h2 className="text-2xl font-serif font-semibold mb-6">Notre Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Image {index + 1}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Contact Tab */}
        <TabsContent value="contact" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Contactez-nous</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-amber-600" />
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-sm text-muted-foreground">123 Avenue des Champs-Élysées<br />75008 Paris, France</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 mt-0.5 text-amber-600" />
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 mt-0.5 text-amber-600" />
                  <div>
                    <h3 className="font-medium">Réservations</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Pour les réservations, veuillez nous appeler ou utiliser le formulaire ci-dessous.
                    </p>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      Réserver une table
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <p className="text-muted-foreground">Carte du restaurant</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <footer className="mt-16 pt-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-serif font-bold">Le Bistro Parisien</h3>
            <p className="text-sm text-muted-foreground">Cuisine française authentique depuis 1998</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2023 Le Bistro Parisien. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantMenuTemplate;
