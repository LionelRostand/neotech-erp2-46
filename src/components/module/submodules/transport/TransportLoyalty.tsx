
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Search, 
  Award, 
  Gift, 
  Percent, 
  Tag, 
  User,
  Star,
  CreditCard,
  Phone
} from "lucide-react";
import { TransportClient } from "./types/transport-types";

// Mock data for loyalty members
const mockLoyaltyMembers = [
  {
    id: "c1",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "06 12 34 56 78",
    points: 1250,
    tier: "gold",
    joinDate: "2020-03-10",
    lastActivity: "2023-06-15",
    vip: true
  },
  {
    id: "c2",
    firstName: "Sophie",
    lastName: "Lefebvre",
    email: "sophie.lefebvre@example.com",
    phone: "07 23 45 67 89",
    points: 780,
    tier: "silver",
    joinDate: "2021-05-20",
    lastActivity: "2023-05-30",
    vip: false
  },
  {
    id: "c3",
    firstName: "Jean",
    lastName: "Moreau",
    email: "jean.moreau@example.com",
    phone: "06 34 56 78 90",
    points: 320,
    tier: "bronze",
    joinDate: "2022-01-15",
    lastActivity: "2023-06-05",
    vip: false
  },
  {
    id: "c4",
    firstName: "Marie",
    lastName: "Durand",
    email: "marie.durand@example.com",
    phone: "07 45 67 89 01",
    points: 950,
    tier: "silver",
    joinDate: "2021-07-10",
    lastActivity: "2023-06-10",
    vip: false
  },
  {
    id: "c5",
    firstName: "Thomas",
    lastName: "Bernard",
    email: "thomas.bernard@example.com",
    phone: "06 56 78 90 12",
    points: 60,
    tier: "bronze",
    joinDate: "2023-05-05",
    lastActivity: "2023-06-01",
    vip: false
  }
];

// Mock data for available rewards
const mockRewards = [
  {
    id: "r1",
    name: "Réduction de 10%",
    description: "10% de réduction sur votre prochaine réservation",
    pointsCost: 200,
    category: "discount",
    validityDays: 30
  },
  {
    id: "r2",
    name: "Trajet gratuit",
    description: "Un trajet gratuit (valeur max. 30€)",
    pointsCost: 500,
    category: "free",
    validityDays: 60
  },
  {
    id: "r3",
    name: "Surclassement de véhicule",
    description: "Surclassement gratuit pour votre prochaine réservation",
    pointsCost: 300,
    category: "upgrade",
    validityDays: 30
  },
  {
    id: "r4",
    name: "Service VIP",
    description: "Service VIP avec chauffeur dédié pour une journée",
    pointsCost: 1000,
    category: "vip",
    validityDays: 90
  },
  {
    id: "r5",
    name: "Cadeau de bienvenue",
    description: "Un cadeau de bienvenue personnalisé lors de votre prochaine réservation",
    pointsCost: 150,
    category: "gift",
    validityDays: 45
  }
];

// Types for loyalty components
type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

type LoyaltyMember = TransportClient & {
  points: number;
  tier: LoyaltyTier;
  joinDate: string;
  lastActivity: string;
  vip: boolean;
}

type Reward = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: "discount" | "free" | "upgrade" | "vip" | "gift";
  validityDays: number;
}

const TransportLoyalty = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredMembers = mockLoyaltyMembers.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
      member.email.toLowerCase().includes(searchLower) || 
      member.phone.includes(searchTerm);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
        <Button>
          <User className="h-4 w-4 mr-2" />
          Nouveau Membre
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Membres</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span>Récompenses</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Configuration</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Membres du programme</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un membre..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="py-3 px-4 text-left font-medium text-sm">Membre</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Points</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Statut</th>
                      <th className="py-3 px-4 text-left font-medium text-sm">Dernière activité</th>
                      <th className="py-3 px-4 text-right font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <tr key={member.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{`${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center gap-2">
                                  {member.firstName} {member.lastName}
                                  {member.vip && (
                                    <Badge variant="secondary" className="text-xs">
                                      VIP
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-400" />
                              <span className="font-medium">{member.points}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={`
                              ${member.tier === 'bronze' ? 'bg-amber-700' : ''}
                              ${member.tier === 'silver' ? 'bg-gray-400' : ''}
                              ${member.tier === 'gold' ? 'bg-amber-400 text-black' : ''}
                              ${member.tier === 'platinum' ? 'bg-zinc-800' : ''}
                            `}>
                              {member.tier === 'bronze' && 'Bronze'}
                              {member.tier === 'silver' && 'Argent'}
                              {member.tier === 'gold' && 'Or'}
                              {member.tier === 'platinum' && 'Platine'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              {new Date(member.lastActivity).toLocaleDateString('fr-FR')}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <CreditCard className="h-4 w-4 mr-1" />
                                Points
                              </Button>
                              <Button variant="outline" size="sm">
                                <Gift className="h-4 w-4 mr-1" />
                                Offrir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted-foreground">
                          Aucun membre trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {reward.category === 'discount' && <Percent className="h-5 w-5 text-blue-500" />}
                      {reward.category === 'free' && <Tag className="h-5 w-5 text-green-500" />}
                      {reward.category === 'upgrade' && <Award className="h-5 w-5 text-amber-500" />}
                      {reward.category === 'vip' && <Heart className="h-5 w-5 text-red-500" />}
                      {reward.category === 'gift' && <Gift className="h-5 w-5 text-purple-500" />}
                      {reward.name}
                    </CardTitle>
                    <Badge variant="outline" className="font-medium">
                      <Star className="h-3 w-3 mr-1 text-amber-400" />
                      {reward.pointsCost} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Validité: {reward.validityDays} jours
                    </span>
                    <Button size="sm">
                      <Gift className="h-4 w-4 mr-1" />
                      Utiliser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Niveaux de fidélité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2 bg-amber-700/10">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                      <Award className="h-5 w-5" />
                      Bronze
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-2">Nouveau membre</p>
                    <div className="text-xs text-muted-foreground">
                      <div className="mb-1">• 0 - 500 points</div>
                      <div className="mb-1">• 5% de réduction</div>
                      <div className="mb-1">• Cadeau de bienvenue</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 bg-gray-400/10">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-500">
                      <Award className="h-5 w-5" />
                      Argent
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-2">Membre fidèle</p>
                    <div className="text-xs text-muted-foreground">
                      <div className="mb-1">• 501 - 1000 points</div>
                      <div className="mb-1">• 10% de réduction</div>
                      <div className="mb-1">• Priorité de réservation</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 bg-amber-400/10">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-500">
                      <Award className="h-5 w-5" />
                      Or
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-2">Client privilégié</p>
                    <div className="text-xs text-muted-foreground">
                      <div className="mb-1">• 1001 - 2000 points</div>
                      <div className="mb-1">• 15% de réduction</div>
                      <div className="mb-1">• Surclassement gratuit</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2 bg-zinc-800/10">
                    <CardTitle className="text-lg flex items-center gap-2 text-zinc-700">
                      <Award className="h-5 w-5" />
                      Platine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-2">Client VIP</p>
                    <div className="text-xs text-muted-foreground">
                      <div className="mb-1">• 2001+ points</div>
                      <div className="mb-1">• 25% de réduction</div>
                      <div className="mb-1">• Service premium dédié</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Règles d'attribution des points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>Points par euro dépensé</span>
                      </div>
                      <div className="font-medium">1 point</div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Points pour une réservation par téléphone</span>
                      </div>
                      <div className="font-medium">10 points</div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>Points pour l'anniversaire d'inscription</span>
                      </div>
                      <div className="font-medium">100 points</div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Points pour un parrainage</span>
                      </div>
                      <div className="font-medium">200 points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportLoyalty;
