import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Gift, Award, Search, Plus, Filter, Users, ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import NewRewardDialog from './components/NewRewardDialog';
import AddPointsDialog from './components/AddPointsDialog';
import { LoyaltyClient, LoyaltyReward, NewLoyaltyReward } from '../inventory/types/inventory-types';

const LoyaltyDashboard = () => {
  const { toast } = useToast();
  const [isAddPointsOpen, setIsAddPointsOpen] = useState(false);
  const [loyaltyClients, setLoyaltyClients] = useState<LoyaltyClient[]>([
    { id: "1", name: "Marie Dupont", status: "gold", points: 450, visits: 15, lastVisit: "12/06/2023" },
    { id: "2", name: "Thomas Dubois", status: "silver", points: 320, visits: 9, lastVisit: "28/05/2023" },
    { id: "3", name: "Sophie Laurent", status: "silver", points: 285, visits: 8, lastVisit: "15/06/2023" },
    { id: "4", name: "Jean Martin", status: "bronze", points: 120, visits: 4, lastVisit: "02/06/2023" },
    { id: "5", name: "Camille Rousseau", status: "gold", points: 410, visits: 12, lastVisit: "10/06/2023" }
  ]);
  
  const handleAddPoints = (clientId: string, points: number, reason: string) => {
    setLoyaltyClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          points: client.points + points
        };
      }
      return client;
    }));
    
    toast({
      title: "Points ajoutés",
      description: `${points} points ont été ajoutés pour ${reason.toLowerCase()}`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">184</div>
              <div className="text-sm text-green-600 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                +12%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs mois précédent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points distribués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">1,245</div>
              <div className="text-sm text-green-600 flex items-center">
                <ArrowUp className="h-4 w-4 mr-1" />
                +18%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">ce mois-ci</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Récompenses utilisées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-red-600 flex items-center">
                <ArrowDown className="h-4 w-4 mr-1" />
                -5%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">ce mois-ci</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Membres du programme de fidélité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un client..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="ml-2">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button size="sm" className="ml-2" onClick={() => setIsAddPointsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Visites</TableHead>
                <TableHead>Dernière visite</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loyaltyClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {client.status === "gold" && <Award className="h-4 w-4 text-yellow-500 mr-1" />}
                      {client.status === "silver" && <Award className="h-4 w-4 text-gray-400 mr-1" />}
                      {client.status === "bronze" && <Award className="h-4 w-4 text-amber-700 mr-1" />}
                      <span className="capitalize">{client.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.points}</TableCell>
                  <TableCell>{client.visits}</TableCell>
                  <TableCell>{client.lastVisit}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toast({
                        title: "Gestion des points",
                        description: `Modifier les points de ${client.name}`
                      })}
                    >
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <AddPointsDialog 
            open={isAddPointsOpen}
            onOpenChange={setIsAddPointsOpen}
            clients={loyaltyClients}
            onAddPoints={handleAddPoints}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurations des paliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-amber-700 mr-2" />
                  <span className="font-medium">Bronze</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">0-200 points</div>
                <div className="text-sm">Avantages: 5% de réduction</div>
              </div>
              
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium">Argent</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">201-400 points</div>
                <div className="text-sm">Avantages: 10% de réduction, produit offert</div>
              </div>
              
              <div className="border p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium">Or</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">401+ points</div>
                <div className="text-sm">Avantages: 15% de réduction, produit offert, coupe gratuite</div>
              </div>
              
              <Button className="w-full">Modifier les paliers</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Promotions actuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border p-4 rounded-md bg-yellow-50">
                <div className="flex items-center mb-2">
                  <Gift className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-medium">Anniversaire</span>
                </div>
                <div className="text-sm mb-2">Double points le mois de l'anniversaire</div>
                <div className="text-xs text-muted-foreground">Jusqu'au: Permanent</div>
              </div>
              
              <div className="border p-4 rounded-md bg-green-50">
                <div className="flex items-center mb-2">
                  <Gift className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">Été 2023</span>
                </div>
                <div className="text-sm mb-2">-20% sur coloration pour membres Gold</div>
                <div className="text-xs text-muted-foreground">Jusqu'au: 31/08/2023</div>
              </div>
              
              <div className="border p-4 rounded-md bg-pink-50">
                <div className="flex items-center mb-2">
                  <Gift className="h-5 w-5 text-pink-600 mr-2" />
                  <span className="font-medium">Parrainage</span>
                </div>
                <div className="text-sm mb-2">50 points offerts pour chaque nouveau client parrainé</div>
                <div className="text-xs text-muted-foreground">Jusqu'au: Permanent</div>
              </div>
              
              <Button className="w-full">Gérer les promotions</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LoyaltySettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du programme de fidélité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ratio points/euros</label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="1" className="max-w-[100px]" defaultValue="1" />
                  <span className="flex items-center text-sm text-muted-foreground">point(s) pour</span>
                  <Input type="number" placeholder="10" className="max-w-[100px]" defaultValue="10" />
                  <span className="flex items-center text-sm text-muted-foreground">euro(s)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Valeur d'un point</label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="0.10" className="max-w-[100px]" defaultValue="0.10" />
                  <span className="flex items-center text-sm text-muted-foreground">euro(s) par point</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Palier pour récompense</label>
              <div className="flex gap-2">
                <Input type="number" placeholder="100" className="max-w-[100px]" defaultValue="100" />
                <span className="flex items-center text-sm text-muted-foreground">points par récompense</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Expiration des points</label>
              <Select defaultValue="12">
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sélectionner une durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Jamais</SelectItem>
                  <SelectItem value="6">6 mois</SelectItem>
                  <SelectItem value="12">12 mois</SelectItem>
                  <SelectItem value="24">24 mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4">
              <Button>Enregistrer les modifications</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">Notification de nouveaux points</div>
                <div className="text-sm text-muted-foreground">Envoyer une notification après chaque attribution de points</div>
              </div>
              <div className="flex items-center">
                <Select defaultValue="both">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type de notification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email + SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">Notification de changement de palier</div>
                <div className="text-sm text-muted-foreground">Notifier les clients lorsqu'ils atteignent un nouveau palier</div>
              </div>
              <div className="flex items-center">
                <Select defaultValue="both">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type de notification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email + SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between pb-4">
              <div>
                <div className="font-medium">Notification de points expirés</div>
                <div className="text-sm text-muted-foreground">Avertir les clients avant l'expiration de leurs points</div>
              </div>
              <div className="flex items-center">
                <Select defaultValue="email">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type de notification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email + SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button>Enregistrer les notifications</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LoyaltyRewards = () => {
  const { toast } = useToast();
  const [isNewRewardOpen, setIsNewRewardOpen] = useState(false);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([
    { id: "1", name: "Coupe gratuite", points: 100, description: "Une coupe offerte", active: true, createdAt: "2023-05-10" },
    { id: "2", name: "Produit offert", points: 75, description: "Un produit capillaire au choix jusqu'à 15€", active: true, createdAt: "2023-04-15" },
    { id: "3", name: "Réduction 25%", points: 50, description: "25% de réduction sur une prestation", active: true, createdAt: "2023-06-01" },
    { id: "4", name: "Brushing offert", points: 40, description: "Un brushing gratuit", active: true, createdAt: "2023-05-20" },
    { id: "5", name: "Soin profond", points: 60, description: "Un soin capillaire profond offert", active: false, createdAt: "2023-03-10" }
  ]);
  
  const handleAddReward = (newReward: NewLoyaltyReward) => {
    const reward: LoyaltyReward = {
      id: `${rewards.length + 1}`,
      name: newReward.name,
      points: newReward.points,
      description: newReward.description,
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setRewards(prev => [...prev, reward]);
    
    toast({
      title: "Récompense ajoutée",
      description: `La récompense "${newReward.name}" a été créée avec succès`
    });
  };
  
  const handleToggleRewardStatus = (rewardId: string) => {
    setRewards(prev => prev.map(reward => {
      if (reward.id === rewardId) {
        return {
          ...reward,
          active: !reward.active
        };
      }
      return reward;
    }));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Récompenses disponibles</CardTitle>
          <Button size="sm" onClick={() => setIsNewRewardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle récompense
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Récompense</TableHead>
                <TableHead>Points requis</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell className="font-medium">{reward.name}</TableCell>
                  <TableCell>{reward.points}</TableCell>
                  <TableCell>{reward.description}</TableCell>
                  <TableCell>
                    {reward.active ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        Inactif
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({
                          title: "Modification",
                          description: `Modification de la récompense: ${reward.name}`
                        })}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          handleToggleRewardStatus(reward.id);
                          toast({
                            title: reward.active ? "Désactivation" : "Activation",
                            description: `${reward.active ? "Désactivation" : "Activation"} de la récompense: ${reward.name}`
                          });
                        }}
                      >
                        {reward.active ? "Désactiver" : "Activer"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <NewRewardDialog 
            open={isNewRewardOpen}
            onOpenChange={setIsNewRewardOpen}
            onAddReward={handleAddReward}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique d'utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Récompense</TableHead>
                <TableHead>Points utilisés</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: 1, date: "15/06/2023", client: "Marie Dupont", reward: "Coupe gratuite", points: 100 },
                { id: 2, date: "10/06/2023", client: "Thomas Dubois", reward: "Produit offert", points: 75 },
                { id: 3, date: "05/06/2023", client: "Camille Rousseau", reward: "Réduction 25%", points: 50 },
                { id: 4, date: "01/06/2023", client: "Sophie Laurent", reward: "Brushing offert", points: 40 },
                { id: 5, date: "28/05/2023", client: "Jean Martin", reward: "Produit offert", points: 75 },
              ].map((history) => (
                <TableRow key={history.id}>
                  <TableCell>{history.date}</TableCell>
                  <TableCell>{history.client}</TableCell>
                  <TableCell>{history.reward}</TableCell>
                  <TableCell>{history.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const SalonLoyalty: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const { toast } = useToast();
  
  const handleExportData = () => {
    // Simulate export data functionality
    setTimeout(() => {
      toast({
        title: "Données exportées",
        description: "Les données du programme de fidélité ont été exportées avec succès"
      });
    }, 500);
    
    // In a real application, this would generate and download a CSV/Excel file
    const dummyData = "data:text/csv;charset=utf-8,ID,Client,Points,Status\n1,Marie Dupont,450,Gold";
    const encodedUri = encodeURI(dummyData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fidelity_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
        <Button onClick={handleExportData}>
          <Users className="mr-2 h-4 w-4" />
          Exporter les données
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">
            <Heart className="h-4 w-4 mr-2" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="h-4 w-4 mr-2" />
            Récompenses
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Award className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <LoyaltyDashboard />
        </TabsContent>
        
        <TabsContent value="rewards">
          <LoyaltyRewards />
        </TabsContent>
        
        <TabsContent value="settings">
          <LoyaltySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalonLoyalty;
