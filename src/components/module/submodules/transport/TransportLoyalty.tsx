
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Gift, 
  Award, 
  Users, 
  TrendingUp, 
  Settings, 
  Star, 
  Calendar,
  AlertCircle,
  Sparkles,
  Edit,
  Trash
} from "lucide-react";
import { LoyaltyMember, LoyaltyReward, LoyaltyTier } from '../types/client-types';

const TransportLoyalty: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("members");
  const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState("");
  const nextRewardAt = 100;

  // Mock data for loyalty members
  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>([
    {
      id: "member1",
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@example.com",
      phone: "06 12 34 56 78",
      points: 250,
      tier: "silver",
      joinDate: "2022-09-15",
      lastActivity: "2023-06-10",
      vip: false
    },
    {
      id: "member2",
      firstName: "Marie",
      lastName: "Laurent",
      email: "marie.laurent@example.com",
      phone: "06 87 65 43 21",
      points: 520,
      tier: "gold",
      joinDate: "2022-05-20",
      lastActivity: "2023-06-18",
      vip: true
    },
    {
      id: "member3",
      firstName: "Philippe",
      lastName: "Martin",
      email: "philippe.martin@example.com",
      phone: "07 23 45 67 89",
      points: 80,
      tier: "bronze",
      joinDate: "2023-01-10",
      lastActivity: "2023-05-28",
      vip: false
    },
    {
      id: "member4",
      firstName: "Sophie",
      lastName: "Leroy",
      email: "sophie.leroy@example.com",
      phone: "06 98 76 54 32",
      points: 370,
      tier: "silver",
      joinDate: "2022-07-12",
      lastActivity: "2023-06-15",
      vip: false
    },
    {
      id: "member5",
      firstName: "Jean",
      lastName: "Moreau",
      email: "jean.moreau@example.com",
      phone: "07 65 43 21 09",
      points: 950,
      tier: "platinum",
      joinDate: "2021-11-05",
      lastActivity: "2023-06-20",
      vip: true
    }
  ]);

  // Mock data for rewards
  const [rewards, setRewards] = useState<LoyaltyReward[]>([
    {
      id: "reward1",
      name: "Réduction de 10%",
      description: "10% de réduction sur votre prochaine course",
      pointsCost: 100,
      category: "discount",
      validityDays: 30,
      active: true
    },
    {
      id: "reward2",
      name: "Trajet gratuit",
      description: "Un trajet gratuit jusqu'à 20€",
      pointsCost: 250,
      category: "free",
      validityDays: 60,
      active: true
    },
    {
      id: "reward3",
      name: "Surclassement VIP",
      description: "Surclassement en véhicule VIP pour votre prochain trajet",
      pointsCost: 150,
      category: "upgrade",
      validityDays: 30,
      active: true
    },
    {
      id: "reward4",
      name: "Attente prolongée",
      description: "30 minutes d'attente offertes",
      pointsCost: 80,
      category: "vip",
      validityDays: 45,
      active: true
    },
    {
      id: "reward5",
      name: "Bon cadeau",
      description: "Bon cadeau de 50€",
      pointsCost: 500,
      category: "gift",
      validityDays: 90,
      active: true
    }
  ]);

  // Mock transaction history for selected member
  const transactionHistory = [
    { id: "t1", date: "2023-05-15", type: "earn", amount: 25, description: "Réservation #R2345" },
    { id: "t2", date: "2023-04-30", type: "redeem", amount: 100, description: "Réduction de 10%" },
    { id: "t3", date: "2023-04-22", type: "earn", amount: 40, description: "Réservation #R2301" },
    { id: "t4", date: "2023-03-10", type: "earn", amount: 30, description: "Parrainage" },
    { id: "t5", date: "2023-02-15", type: "earn", amount: 35, description: "Réservation #R2189" }
  ];

  const handleAddPoints = (member: LoyaltyMember) => {
    const points = parseInt(pointsToAdd);
    if (isNaN(points) || points <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nombre de points valide",
        variant: "destructive"
      });
      return;
    }

    const updatedMembers = loyaltyMembers.map(m => 
      m.id === member.id ? { ...m, points: m.points + points } : m
    );
    
    setLoyaltyMembers(updatedMembers);
    setPointsToAdd("");
    
    toast({
      title: "Points ajoutés",
      description: `${points} points ont été ajoutés au compte de ${member.firstName} ${member.lastName}`
    });
  };

  const handleRedeemReward = (member: LoyaltyMember, reward: LoyaltyReward) => {
    if (member.points < reward.pointsCost) {
      toast({
        title: "Points insuffisants",
        description: `Le client doit avoir au moins ${reward.pointsCost} points pour utiliser cette récompense`,
        variant: "destructive"
      });
      return;
    }

    const updatedMembers = loyaltyMembers.map(m => 
      m.id === member.id ? { ...m, points: m.points - reward.pointsCost } : m
    );
    
    setLoyaltyMembers(updatedMembers);
    
    toast({
      title: "Récompense utilisée",
      description: `${reward.pointsCost} points ont été échangés contre "${reward.name}"`
    });
  };

  const getTierColor = (tier: LoyaltyTier) => {
    switch (tier) {
      case "bronze": return "bg-amber-600";
      case "silver": return "bg-slate-400";
      case "gold": return "bg-yellow-500";
      case "platinum": return "bg-purple-500";
      default: return "bg-slate-600";
    }
  };

  const getTierLabel = (tier: LoyaltyTier) => {
    switch (tier) {
      case "bronze": return "Bronze";
      case "silver": return "Argent";
      case "gold": return "Or";
      case "platinum": return "Platine";
      default: return tier;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
      
      <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users size={16} />
            <span>Membres</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift size={16} />
            <span>Récompenses</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span>Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-6 mt-6">
          {selectedMember ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Profil du membre</h3>
                <Button variant="outline" onClick={() => setSelectedMember(null)}>
                  Retour à la liste
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Informations du membre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-lg font-medium">{selectedMember.firstName} {selectedMember.lastName}</p>
                        <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                        <p className="text-sm text-muted-foreground">{selectedMember.phone}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getTierColor(selectedMember.tier)} text-white`}>
                          {getTierLabel(selectedMember.tier)}
                        </Badge>
                        {selectedMember.vip && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            VIP
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm">Membre depuis: {new Date(selectedMember.joinDate).toLocaleDateString('fr-FR')}</p>
                        <p className="text-sm">Dernière activité: {new Date(selectedMember.lastActivity).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-red-500" />
                      Points de fidélité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{selectedMember.points}</p>
                        <p className="text-sm text-muted-foreground">Points disponibles</p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Progression vers la prochaine récompense</span>
                          <span className="text-sm">{selectedMember.points % nextRewardAt} / {nextRewardAt}</span>
                        </div>
                        <Progress value={(selectedMember.points % nextRewardAt) / nextRewardAt * 100} className="h-2" />
                      </div>

                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Points à ajouter"
                          value={pointsToAdd}
                          onChange={(e) => setPointsToAdd(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={() => handleAddPoints(selectedMember)}>
                          <Award className="mr-2 h-4 w-4" />
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gift className="mr-2 h-5 w-5 text-purple-500" />
                      Récompenses disponibles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {rewards.slice(0, 3).map((reward) => (
                        <div key={reward.id} className="flex justify-between items-center p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{reward.name}</p>
                            <p className="text-xs text-muted-foreground">{reward.pointsCost} points</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant={selectedMember.points >= reward.pointsCost ? "default" : "outline"}
                            disabled={selectedMember.points < reward.pointsCost}
                            onClick={() => handleRedeemReward(selectedMember, reward)}
                          >
                            Échanger
                          </Button>
                        </div>
                      ))}
                      <Button variant="link" className="w-full text-center">
                        Voir toutes les récompenses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Historique des transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactionHistory.length > 0 ? (
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-2 text-left font-medium">Date</th>
                              <th className="px-4 py-2 text-left font-medium">Type</th>
                              <th className="px-4 py-2 text-left font-medium">Description</th>
                              <th className="px-4 py-2 text-right font-medium">Points</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionHistory.map(transaction => (
                              <tr key={transaction.id} className="border-b last:border-b-0">
                                <td className="px-4 py-3">
                                  {new Date(transaction.date).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge variant={transaction.type === 'earn' ? 'default' : 'outline'}>
                                    {transaction.type === 'earn' ? 'Gain' : 'Échange'}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  {transaction.description}
                                </td>
                                <td className={`px-4 py-3 text-right ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        Aucune transaction pour ce membre
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Liste des membres
                </CardTitle>
                <CardDescription>
                  Gérez vos membres du programme de fidélité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left font-medium">Nom</th>
                        <th className="px-4 py-2 text-left font-medium">Contact</th>
                        <th className="px-4 py-2 text-left font-medium">Niveau</th>
                        <th className="px-4 py-2 text-left font-medium">Points</th>
                        <th className="px-4 py-2 text-left font-medium">Dernière activité</th>
                        <th className="px-4 py-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loyaltyMembers.map(member => (
                        <tr key={member.id} className="border-b last:border-b-0">
                          <td className="px-4 py-3">
                            <div className="font-medium">{member.firstName} {member.lastName}</div>
                            {member.vip && (
                              <Badge variant="outline" className="border-yellow-500 text-yellow-500 mt-1">
                                VIP
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm">{member.email}</div>
                            <div className="text-xs text-muted-foreground">{member.phone}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={`${getTierColor(member.tier)} text-white`}>
                              {getTierLabel(member.tier)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 text-red-500 mr-1" />
                              <span>{member.points}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {new Date(member.lastActivity).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                            >
                              Détails
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{reward.name}</CardTitle>
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                      </div>
                      <CardDescription className="mt-1">
                        {reward.description}
                      </CardDescription>
                    </div>
                    <Badge variant={reward.active ? "default" : "outline"}>
                      {reward.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-lg font-bold">
                      {reward.pointsCost} points
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Valable pendant {reward.validityDays} jours
                    </div>
                    <div className="flex items-start text-sm">
                      <AlertCircle className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Cette récompense peut être utilisée pour toute réservation effectuée sur l'application.
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    {reward.active ? "Désactiver" : "Activer"}
                  </Button>
                  
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      title="Supprimer"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total des membres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loyaltyMembers.length}</div>
                <p className="text-xs text-muted-foreground">+12% par rapport au mois dernier</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Points distribués</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,450</div>
                <p className="text-xs text-muted-foreground">Ce mois-ci</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Récompenses échangées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">Ce mois-ci</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des membres par niveau</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-amber-600`}></div>
                    <span>Bronze</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-slate-400`}></div>
                    <span>Argent</span>
                  </div>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-yellow-500`}></div>
                    <span>Or</span>
                  </div>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-purple-500`}></div>
                    <span>Platine</span>
                  </div>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Récompenses les plus populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Trajet gratuit</span>
                  </div>
                  <span className="font-medium">42 échangés</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Réduction de 10%</span>
                  </div>
                  <span className="font-medium">36 échangés</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Surclassement VIP</span>
                  </div>
                  <span className="font-medium">28 échangés</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Attente prolongée</span>
                  </div>
                  <span className="font-medium">15 échangés</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du programme</CardTitle>
              <CardDescription>
                Configurez les règles et les niveaux du programme de fidélité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Règles d'accumulation</h3>
                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <span>Points par euro dépensé</span>
                    <div className="font-medium">1</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bonus pour réservation par téléphone</span>
                    <div className="font-medium">+5 points</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bonus d'anniversaire</span>
                    <div className="font-medium">+50 points</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bonus de parrainage</span>
                    <div className="font-medium">+100 points</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Niveaux de fidélité</h3>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Badge className="bg-amber-600 text-white mr-2">Bronze</Badge>
                        <span>0 - 249 points</span>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avantages: Notifications prioritaires, accumulation de points
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Badge className="bg-slate-400 text-white mr-2">Argent</Badge>
                        <span>250 - 499 points</span>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avantages: +5% points bonus, accès à des offres exclusives
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Badge className="bg-yellow-500 text-white mr-2">Or</Badge>
                        <span>500 - 999 points</span>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avantages: +10% points bonus, priorité de réservation, service client dédié
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Badge className="bg-purple-500 text-white mr-2">Platine</Badge>
                        <span>1000+ points</span>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avantages: +15% points bonus, chauffeur personnel, surclassement automatique
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Enregistrer les modifications</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportLoyalty;
