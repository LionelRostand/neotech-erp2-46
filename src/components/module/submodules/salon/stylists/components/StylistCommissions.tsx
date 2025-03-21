
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, DollarSign, PercentIcon, Award, TrendingUp, Download, Filter, PlusCircle, Edit, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock data pour les coiffeurs
const stylists = [
  {
    id: "1",
    firstName: "Sophie",
    lastName: "Martin",
    avatar: "",
    commissionRate: 30,
    revenue: 7800,
    commission: 2340,
    bonuses: 250,
    total: 2590
  },
  {
    id: "2",
    firstName: "Thomas",
    lastName: "Bernard",
    avatar: "",
    commissionRate: 25,
    revenue: 6500,
    commission: 1625,
    bonuses: 150,
    total: 1775
  },
  {
    id: "3",
    firstName: "Julie",
    lastName: "Dubois",
    avatar: "",
    commissionRate: 35,
    revenue: 8200,
    commission: 2870,
    bonuses: 300,
    total: 3170
  },
  {
    id: "4",
    firstName: "Marc",
    lastName: "Leroy",
    avatar: "",
    commissionRate: 30,
    revenue: 7200,
    commission: 2160,
    bonuses: 200,
    total: 2360
  },
  {
    id: "5",
    firstName: "Lucie",
    lastName: "Blanc",
    avatar: "",
    commissionRate: 28,
    revenue: 6800,
    commission: 1904,
    bonuses: 180,
    total: 2084
  }
];

// Mock data pour les primes et objectifs
const bonusTypes = [
  { id: "sales", name: "Objectif Ventes", description: "Prime basée sur le chiffre d'affaires généré", amount: 100 },
  { id: "products", name: "Vente de Produits", description: "Prime basée sur le nombre de produits vendus", amount: 50 },
  { id: "new_clients", name: "Nouveaux Clients", description: "Prime par nouveau client fidélisé", amount: 10 },
  { id: "satisfaction", name: "Satisfaction Client", description: "Prime basée sur les retours clients", amount: 75 },
  { id: "training", name: "Formation", description: "Prime pour formation suivie", amount: 150 }
];

// Mock data pour l'historique
const commissionHistory = [
  { id: 1, month: "Juin 2023", stylist: "Sophie Martin", revenue: 7800, commission: 2340, bonuses: 250, total: 2590, status: "paid" },
  { id: 2, month: "Juin 2023", stylist: "Thomas Bernard", revenue: 6500, commission: 1625, bonuses: 150, total: 1775, status: "paid" },
  { id: 3, month: "Juin 2023", stylist: "Julie Dubois", revenue: 8200, commission: 2870, bonuses: 300, total: 3170, status: "paid" },
  { id: 4, month: "Mai 2023", stylist: "Sophie Martin", revenue: 7500, commission: 2250, bonuses: 200, total: 2450, status: "paid" },
  { id: 5, month: "Mai 2023", stylist: "Thomas Bernard", revenue: 6300, commission: 1575, bonuses: 120, total: 1695, status: "paid" },
  { id: 6, month: "Mai 2023", stylist: "Julie Dubois", revenue: 7900, commission: 2765, bonuses: 280, total: 3045, status: "paid" },
  { id: 7, month: "Avril 2023", stylist: "Sophie Martin", revenue: 7200, commission: 2160, bonuses: 180, total: 2340, status: "paid" },
  { id: 8, month: "Avril 2023", stylist: "Thomas Bernard", revenue: 6100, commission: 1525, bonuses: 100, total: 1625, status: "paid" },
];

const StylistCommissions: React.FC = () => {
  const { toast } = useToast();
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedStylist, setSelectedStylist] = useState(null);

  const handleEditCommission = (stylist) => {
    setSelectedStylist(stylist);
    setShowCommissionDialog(true);
  };

  const handleAddBonus = (stylist) => {
    setSelectedStylist(stylist);
    setShowBonusDialog(true);
  };

  const handleSaveCommission = () => {
    toast({
      title: "Taux de commission mis à jour",
      description: `Le taux de commission de ${selectedStylist.firstName} ${selectedStylist.lastName} a été mis à jour`
    });
    setShowCommissionDialog(false);
  };

  const handleSaveBonus = () => {
    toast({
      title: "Prime ajoutée",
      description: `Une prime a été ajoutée pour ${selectedStylist.firstName} ${selectedStylist.lastName}`
    });
    setShowBonusDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              Commission totale (mois en cours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,979€</div>
            <p className="text-xs text-muted-foreground">+8.2% vs mois précédent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Award className="h-4 w-4 mr-2 text-primary" />
              Primes versées (mois en cours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,080€</div>
            <p className="text-xs text-muted-foreground">+12.4% vs mois précédent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <PercentIcon className="h-4 w-4 mr-2 text-primary" />
              Taux de commission moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29.6%</div>
            <p className="text-xs text-muted-foreground">-0.2% vs mois précédent</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">
            <DollarSign className="h-4 w-4 mr-2" />
            Commissions en cours
          </TabsTrigger>
          <TabsTrigger value="history">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Période actuelle: </span>
              <span className="font-medium ml-1">Juin 2023</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coiffeur</TableHead>
                    <TableHead>Taux</TableHead>
                    <TableHead>CA généré</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Primes</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stylists.map((stylist) => (
                    <TableRow key={stylist.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{stylist.firstName.charAt(0)}{stylist.lastName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{stylist.firstName} {stylist.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{stylist.commissionRate}%</TableCell>
                      <TableCell>{stylist.revenue}€</TableCell>
                      <TableCell className="text-primary-foreground">
                        <span className="font-medium">{stylist.commission}€</span>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7">
                              +{stylist.bonuses}€
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Détail des primes</h4>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span>Objectif ventes (110%)</span>
                                  <span>+150€</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Satisfaction client (95%)</span>
                                  <span>+75€</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Ventes produits (6 produits)</span>
                                  <span>+25€</span>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="font-bold">{stylist.total}€</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCommission(stylist)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleAddBonus(stylist)}>
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Objectifs de performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Objectif Chiffre d'Affaires</span>
                    </div>
                    <span>32,000€</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-l-full" style={{ width: "85%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression: 85%</span>
                    <span className="font-medium">27,200€ / 32,000€</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium">Ventes de Produits</span>
                    </div>
                    <span>5,000€</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-l-full" style={{ width: "78%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression: 78%</span>
                    <span className="font-medium">3,900€ / 5,000€</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="font-medium">Satisfaction Client</span>
                    </div>
                    <span>95%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-l-full" style={{ width: "92%" }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression: 92%</span>
                    <span className="font-medium">88% / 95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">Primes disponibles</CardTitle>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nouvelle prime
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bonusTypes.map((bonus) => (
                    <div key={bonus.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{bonus.name}</div>
                        <div className="text-sm text-muted-foreground">{bonus.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{bonus.amount}€</div>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0"
                          onClick={() => toast({
                            title: "Paramètres de prime",
                            description: "Les paramètres de prime seront disponibles prochainement"
                          })}
                        >
                          Paramètres
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Select defaultValue="june-2023">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="june-2023">Juin 2023</SelectItem>
                  <SelectItem value="may-2023">Mai 2023</SelectItem>
                  <SelectItem value="april-2023">Avril 2023</SelectItem>
                  <SelectItem value="march-2023">Mars 2023</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sélectionner un coiffeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les coiffeurs</SelectItem>
                  {stylists.map(stylist => (
                    <SelectItem key={stylist.id} value={stylist.id}>
                      {stylist.firstName} {stylist.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={() => toast({
              title: "Export en cours",
              description: "Téléchargement du fichier d'historique en cours..."
            })}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead>Coiffeur</TableHead>
                    <TableHead>CA généré</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Primes</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.month}</TableCell>
                      <TableCell>{history.stylist}</TableCell>
                      <TableCell>{history.revenue}€</TableCell>
                      <TableCell>{history.commission}€</TableCell>
                      <TableCell>+{history.bonuses}€</TableCell>
                      <TableCell className="font-bold">{history.total}€</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Payé
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des commissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Taux de commission</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-rate">Taux par défaut</Label>
                    <div className="flex">
                      <Input id="default-rate" defaultValue="25" className="rounded-r-none" />
                      <div className="flex items-center justify-center px-3 border rounded-r-md bg-muted">
                        <PercentIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-rate">Taux maximum</Label>
                    <div className="flex">
                      <Input id="max-rate" defaultValue="40" className="rounded-r-none" />
                      <div className="flex items-center justify-center px-3 border rounded-r-md bg-muted">
                        <PercentIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Calcul des commissions</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="calculation-revenue" 
                      name="calculation" 
                      defaultChecked
                      className="h-4 w-4 border-muted"
                    />
                    <Label htmlFor="calculation-revenue">Basé sur le chiffre d'affaires total</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="calculation-service"
                      name="calculation"
                      className="h-4 w-4 border-muted"
                    />
                    <Label htmlFor="calculation-service">Taux variables selon les services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="calculation-progressive"
                      name="calculation"
                      className="h-4 w-4 border-muted"
                    />
                    <Label htmlFor="calculation-progressive">Taux progressif selon le CA</Label>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Objectifs et primes</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="bonus-sales" 
                      defaultChecked
                      className="h-4 w-4 mt-1 border-muted"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="bonus-sales">Activer les primes sur objectif de ventes</Label>
                      <p className="text-sm text-muted-foreground">Récompenser les coiffeurs qui atteignent ou dépassent leurs objectifs de chiffre d'affaires.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="bonus-products" 
                      defaultChecked
                      className="h-4 w-4 mt-1 border-muted"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="bonus-products">Activer les primes sur vente de produits</Label>
                      <p className="text-sm text-muted-foreground">Récompenser les coiffeurs qui vendent des produits capillaires.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      id="bonus-clients" 
                      defaultChecked
                      className="h-4 w-4 mt-1 border-muted"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="bonus-clients">Activer les primes sur nouveaux clients</Label>
                      <p className="text-sm text-muted-foreground">Récompenser les coiffeurs qui attirent de nouveaux clients.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Annuler</Button>
                <Button onClick={() => toast({
                  title: "Paramètres enregistrés",
                  description: "Les paramètres de commission ont été mis à jour avec succès"
                })}>
                  Enregistrer les modifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue d'édition du taux de commission */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStylist && `Modifier le taux de commission de ${selectedStylist.firstName} ${selectedStylist.lastName}`}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStylist && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commission-rate">Taux de commission (%)</Label>
                <div className="flex">
                  <Input 
                    id="commission-rate" 
                    type="number" 
                    min="0" 
                    max="100" 
                    defaultValue={selectedStylist.commissionRate}
                    className="rounded-r-none" 
                  />
                  <div className="flex items-center justify-center px-3 border rounded-r-md bg-muted">
                    <PercentIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rate-reason">Motif de la modification</Label>
                <Input id="rate-reason" placeholder="Raison de la modification du taux" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rate-effective">Date d'application</Label>
                <Input id="rate-effective" type="date" />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCommissionDialog(false)}>
                  Annuler
                </Button>
                <Button type="button" onClick={handleSaveCommission}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'ajout de prime */}
      <Dialog open={showBonusDialog} onOpenChange={setShowBonusDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedStylist && `Ajouter une prime pour ${selectedStylist.firstName} ${selectedStylist.lastName}`}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStylist && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bonus-type">Type de prime</Label>
                <Select defaultValue="sales">
                  <SelectTrigger id="bonus-type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bonusTypes.map(bonus => (
                      <SelectItem key={bonus.id} value={bonus.id}>
                        {bonus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonus-amount">Montant</Label>
                <div className="flex">
                  <Input id="bonus-amount" type="number" min="0" defaultValue="100" className="rounded-r-none" />
                  <div className="flex items-center justify-center px-3 border rounded-r-md bg-muted">
                    <span className="text-muted-foreground">€</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonus-description">Description</Label>
                <Input id="bonus-description" placeholder="Description de la prime" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bonus-date">Date d'attribution</Label>
                <Input id="bonus-date" type="date" />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowBonusDialog(false)}>
                  Annuler
                </Button>
                <Button type="button" onClick={handleSaveBonus}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StylistCommissions;
