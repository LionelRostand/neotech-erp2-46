
import React from 'react';
import { DollarSign, Search, Plus, Edit, Trash2, Tag, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FreightPricing: React.FC = () => {
  // Sample data for pricing
  const pricingRules = [
    { id: 1, name: 'Tarif standard', type: 'Par poids', basePrice: '10.50 €/kg', minCharge: '25 €', active: true },
    { id: 2, name: 'Service express', type: 'Par poids', basePrice: '15.75 €/kg', minCharge: '50 €', active: true },
    { id: 3, name: 'Économique', type: 'Par volume', basePrice: '110 €/m³', minCharge: '30 €', active: true },
    { id: 4, name: 'Tarif spécial hiver', type: 'Par poids', basePrice: '12.25 €/kg', minCharge: '35 €', active: false },
    { id: 5, name: 'Transport fragile', type: 'Par colis', basePrice: '45 €/unité', minCharge: '45 €', active: true },
  ];

  const promotions = [
    { id: 1, name: 'Réduction nouvel an', code: 'NY2024', discount: '15%', validUntil: '2024-01-31', active: true },
    { id: 2, name: 'Clients fidèles', code: 'LOYAL10', discount: '10%', validUntil: '2024-12-31', active: true },
    { id: 3, name: 'Volume important', code: 'BULK25', discount: '25%', validUntil: '2024-03-15', active: false },
    { id: 4, name: 'Première expédition', code: 'FIRST20', discount: '20%', validUntil: '2024-06-30', active: true },
  ];

  // Stats for the dashboard
  const statsData = [
    {
      title: "Tarifs actifs",
      value: "12",
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      description: "Règles de tarification"
    },
    {
      title: "Promotions",
      value: "8",
      icon: <Tag className="h-8 w-8 text-amber-500" />,
      description: "Codes promo actifs"
    },
    {
      title: "Tarif moyen",
      value: "14.75 €",
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      description: "Par kilogramme"
    },
    {
      title: "Mise à jour",
      value: "5 jours",
      icon: <RefreshCw className="h-8 w-8 text-purple-500" />,
      description: "Depuis dernière révision"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <Tabs defaultValue="pricing">
        <TabsList className="mb-4">
          <TabsTrigger value="pricing">Tarifs</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="calculator">Calculateur</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Règles de tarification</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau tarif
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un tarif..."
                  className="pl-8"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Prix de base</TableHead>
                    <TableHead>Charge minimale</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.type}</TableCell>
                      <TableCell>{rule.basePrice}</TableCell>
                      <TableCell>{rule.minCharge}</TableCell>
                      <TableCell>
                        <Badge className={rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {rule.active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Codes promotionnels</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle promotion
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher une promotion..."
                  className="pl-8"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Réduction</TableHead>
                    <TableHead>Valide jusqu'au</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {promo.code}
                        </Badge>
                      </TableCell>
                      <TableCell>{promo.discount}</TableCell>
                      <TableCell>{promo.validUntil}</TableCell>
                      <TableCell>
                        <Badge className={promo.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {promo.active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Calculateur de tarifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type d'expédition
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>Standard</option>
                      <option>Express</option>
                      <option>Économique</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poids (kg)
                    </label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume (m³)
                    </label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance (km)
                    </label>
                    <Input type="number" placeholder="0" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code promotionnel
                    </label>
                    <Input type="text" placeholder="Entrez un code" />
                  </div>
                  
                  <Button className="w-full">Calculer le tarif</Button>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium mb-4">Résultat du calcul</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix de base</span>
                      <span className="font-medium">150.00 €</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supplément distance</span>
                      <span className="font-medium">32.50 €</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de manutention</span>
                      <span className="font-medium">15.00 €</span>
                    </div>
                    
                    <div className="flex justify-between text-green-600">
                      <span>Réduction</span>
                      <span>-19.75 €</span>
                    </div>
                    
                    <div className="border-t pt-4 flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold">177.75 €</span>
                    </div>
                    
                    <div className="text-xs text-gray-500 italic">
                      * Les prix indiqués sont hors taxes et sujets à modification
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightPricing;
