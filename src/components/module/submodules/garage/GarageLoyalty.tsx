
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Search, Plus, Star, Gift, BadgePercent, CalendarRange, MoreHorizontal, User } from 'lucide-react';

type LoyaltyClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: string;
  lastActivity: string;
  rewardHistory: Reward[];
}

type Reward = {
  id: string;
  clientId: string;
  type: string;
  description: string;
  pointsCost: number;
  dateAwarded: string;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
}

type LoyaltyProgram = {
  id: string;
  name: string;
  description: string;
  pointsPerEuro: number;
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
}

type LoyaltyTier = {
  name: string;
  pointsRequired: number;
  benefits: string[];
}

type LoyaltyReward = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  availability: 'always' | 'limited';
  expiryDays: number;
}

const sampleLoyaltyClients: LoyaltyClient[] = [
  {
    id: "CL001",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "01 23 45 67 89",
    points: 750,
    tier: 'silver',
    joinDate: "2022-05-15",
    lastActivity: "2023-11-10",
    rewardHistory: [
      {
        id: "RW001",
        clientId: "CL001",
        type: "discount",
        description: "Réduction de 15% sur prochain entretien",
        pointsCost: 500,
        dateAwarded: "2023-09-12",
        expiryDate: "2023-12-12",
        status: 'active'
      }
    ]
  },
  {
    id: "CL002",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    phone: "01 98 76 54 32",
    points: 1200,
    tier: 'gold',
    joinDate: "2022-03-10",
    lastActivity: "2023-11-05",
    rewardHistory: [
      {
        id: "RW002",
        clientId: "CL002",
        type: "service",
        description: "Lavage de voiture gratuit",
        pointsCost: 300,
        dateAwarded: "2023-08-15",
        expiryDate: "2023-11-15",
        status: 'used'
      },
      {
        id: "RW003",
        clientId: "CL002",
        type: "discount",
        description: "Réduction de 25% sur changement de pneus",
        pointsCost: 800,
        dateAwarded: "2023-10-20",
        expiryDate: "2024-01-20",
        status: 'active'
      }
    ]
  },
  {
    id: "CL003",
    name: "Philippe Leroy",
    email: "philippe.leroy@example.com",
    phone: "01 45 67 89 10",
    points: 350,
    tier: 'bronze',
    joinDate: "2023-01-22",
    lastActivity: "2023-10-30",
    rewardHistory: []
  },
  {
    id: "CL004",
    name: "Sophie Dubois",
    email: "sophie.dubois@example.com",
    phone: "01 56 78 90 12",
    points: 1850,
    tier: 'platinum',
    joinDate: "2021-11-05",
    lastActivity: "2023-11-12",
    rewardHistory: [
      {
        id: "RW004",
        clientId: "CL004",
        type: "service",
        description: "Contrôle technique gratuit",
        pointsCost: 1000,
        dateAwarded: "2023-07-18",
        expiryDate: "2023-10-18",
        status: 'expired'
      },
      {
        id: "RW005",
        clientId: "CL004",
        type: "gift",
        description: "Kit d'urgence auto offert",
        pointsCost: 750,
        dateAwarded: "2023-09-25",
        expiryDate: "2023-12-25",
        status: 'active'
      }
    ]
  }
];

const sampleLoyaltyProgram: LoyaltyProgram = {
  id: "LP001",
  name: "Club Avantages Auto",
  description: "Programme de fidélité pour récompenser nos clients avec des avantages exclusifs",
  pointsPerEuro: 1,
  tiers: [
    {
      name: "bronze",
      pointsRequired: 0,
      benefits: ["1 point par euro dépensé", "Newsletter exclusive"]
    },
    {
      name: "silver",
      pointsRequired: 500,
      benefits: ["1.2 points par euro dépensé", "Priorité de rendez-vous", "Diagnostic gratuit une fois par an"]
    },
    {
      name: "gold",
      pointsRequired: 1000,
      benefits: ["1.5 points par euro dépensé", "Réduction de 5% sur toutes les réparations", "Lavage de voiture offert à chaque entretien"]
    },
    {
      name: "platinum",
      pointsRequired: 1500,
      benefits: ["2 points par euro dépensé", "Réduction de 10% sur toutes les réparations", "Service de voiture de remplacement prioritaire", "Contrôle technique annuel offert"]
    }
  ],
  rewards: [
    {
      id: "LR001",
      name: "Lavage de voiture gratuit",
      description: "Un lavage complet de votre véhicule",
      pointsCost: 300,
      availability: 'always',
      expiryDays: 90
    },
    {
      id: "LR002",
      name: "Réduction de 15% sur prochain entretien",
      description: "Applicable sur votre prochain rendez-vous d'entretien",
      pointsCost: 500,
      availability: 'always',
      expiryDays: 90
    },
    {
      id: "LR003",
      name: "Réduction de 25% sur changement de pneus",
      description: "Valable pour un jeu complet de 4 pneus",
      pointsCost: 800,
      availability: 'always',
      expiryDays: 90
    },
    {
      id: "LR004",
      name: "Contrôle technique gratuit",
      description: "Un contrôle technique complet offert",
      pointsCost: 1000,
      availability: 'always',
      expiryDays: 90
    },
    {
      id: "LR005",
      name: "Kit d'urgence auto offert",
      description: "Kit complet avec triangle, gilet, trousse de secours",
      pointsCost: 750,
      availability: 'limited',
      expiryDays: 90
    }
  ]
};

const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return <Badge className="bg-amber-700 text-white hover:bg-amber-700">Bronze</Badge>;
    case 'silver':
      return <Badge className="bg-gray-400 text-white hover:bg-gray-400">Argent</Badge>;
    case 'gold':
      return <Badge className="bg-yellow-500 text-white hover:bg-yellow-500">Or</Badge>;
    case 'platinum':
      return <Badge className="bg-gray-700 text-white hover:bg-gray-700">Platine</Badge>;
    default:
      return <Badge>{tier}</Badge>;
  }
};

const getRewardStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
    case 'used':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Utilisé</Badge>;
    case 'expired':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expiré</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const GarageLoyalty = () => {
  const [loyaltyClients, setLoyaltyClients] = useState<LoyaltyClient[]>(sampleLoyaltyClients);
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>(sampleLoyaltyProgram);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<LoyaltyClient | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isAddPointsDialogOpen, setIsAddPointsDialogOpen] = useState(false);
  const [isNewRewardDialogOpen, setIsNewRewardDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('clients');

  // Filter clients based on search term
  const filteredClients = loyaltyClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle client selection for detail view
  const handleClientSelect = (client: LoyaltyClient) => {
    setSelectedClient(client);
    setIsClientDialogOpen(true);
  };

  const handleAddPoints = (client: LoyaltyClient | null = null) => {
    if (client) {
      setSelectedClient(client);
    }
    setIsAddPointsDialogOpen(true);
  };

  const handleNewReward = () => {
    setIsNewRewardDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Programme de fidélité</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleNewReward}>
            <Gift size={18} />
            <span>Nouvelle récompense</span>
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="clients" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          <TabsTrigger value="tiers">Niveaux</TabsTrigger>
          <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          {/* Client search and filter */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Recherche et filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Rechercher par nom, email, téléphone..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="md:w-auto">Filtrer</Button>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Clients list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Clients fidélité</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun client trouvé.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Dernière activité</TableHead>
                        <TableHead>Récompenses</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map(client => (
                        <TableRow key={client.id} onClick={() => handleClientSelect(client)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">{client.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{client.points}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getTierBadge(client.tier)}</TableCell>
                          <TableCell>{new Date(client.lastActivity).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{client.rewardHistory.filter(r => r.status === 'active').length}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={(e) => {
                                e.stopPropagation();
                                handleAddPoints(client);
                              }}>
                                <Plus className="h-4 w-4 mr-1" />
                                Points
                              </Button>
                              <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Rewards */}
            <Card>
              <CardHeader>
                <CardTitle>Récompenses disponibles</CardTitle>
                <CardDescription>Liste des récompenses que les clients peuvent obtenir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyProgram.rewards.map(reward => (
                    <div key={reward.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{reward.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{reward.pointsCost}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span>Validité: {reward.expiryDays} jours</span>
                        {reward.availability === 'limited' ? (
                          <Badge variant="outline">Quantité limitée</Badge>
                        ) : (
                          <Badge variant="outline">Toujours disponible</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" onClick={handleNewReward}>
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une récompense
                </Button>
              </CardContent>
            </Card>

            {/* Recent Redemptions */}
            <Card>
              <CardHeader>
                <CardTitle>Utilisation récente</CardTitle>
                <CardDescription>Historique récent des récompenses utilisées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyClients
                    .flatMap(client => client.rewardHistory
                      .map(reward => ({...reward, clientName: client.name}))
                    )
                    .sort((a, b) => new Date(b.dateAwarded).getTime() - new Date(a.dateAwarded).getTime())
                    .slice(0, 5)
                    .map((reward, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{reward.description}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Client: {reward.clientName}</p>
                          </div>
                          <div>
                            {getRewardStatusBadge(reward.status)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span>Attribué le: {new Date(reward.dateAwarded).toLocaleDateString('fr-FR')}</span>
                          <span>Expire le: {new Date(reward.expiryDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    ))
                  }
                  {loyaltyClients.flatMap(client => client.rewardHistory).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune utilisation de récompense enregistrée.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle>Niveaux de fidélité</CardTitle>
              <CardDescription>Configuration des niveaux et avantages du programme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {loyaltyProgram.tiers.map((tier, index) => (
                  <div key={index} className="border rounded-lg p-6 hover:bg-muted/50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <BadgePercent className={`h-6 w-6 mr-2 ${
                          tier.name === 'bronze' ? 'text-amber-700' :
                          tier.name === 'silver' ? 'text-gray-400' :
                          tier.name === 'gold' ? 'text-yellow-500' :
                          'text-gray-700'
                        }`} />
                        <h3 className="text-xl font-semibold capitalize">{tier.name}</h3>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="font-medium text-lg">{tier.pointsRequired}+ points</span>
                      </div>
                    </div>
                    <h4 className="font-medium mb-2">Avantages:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="text-muted-foreground">{benefit}</li>
                      ))}
                    </ul>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Campagnes marketing</CardTitle>
                <CardDescription>Gérez vos campagnes de promotion pour le programme de fidélité</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle campagne
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Double points pour entretien hiver</h3>
                      <p className="text-sm text-muted-foreground mt-1">Points doublés pour tout entretien hivernal jusqu'au 31 décembre</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <CalendarRange className="h-4 w-4 mr-1" />
                    <span>01/11/2023 - 31/12/2023</span>
                  </div>
                </div>
                <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Anniversaire du garage</h3>
                      <p className="text-sm text-muted-foreground mt-1">+50% de points sur toutes les factures pendant la semaine anniversaire</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Planifiée</Badge>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <CalendarRange className="h-4 w-4 mr-1" />
                    <span>15/02/2024 - 22/02/2024</span>
                  </div>
                </div>
                <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Promotion pneus été</h3>
                      <p className="text-sm text-muted-foreground mt-1">Points triplés pour tout achat de pneus d'été</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Terminée</Badge>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <CalendarRange className="h-4 w-4 mr-1" />
                    <span>01/04/2023 - 31/05/2023</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du programme</CardTitle>
              <CardDescription>Configuration générale du programme de fidélité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="programName">Nom du programme</Label>
                    <Input id="programName" value={loyaltyProgram.name} />
                  </div>
                  <div>
                    <Label htmlFor="pointsPerEuro">Points par euro dépensé</Label>
                    <Input id="pointsPerEuro" type="number" step="0.1" min="0.1" value={loyaltyProgram.pointsPerEuro} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="programDescription">Description</Label>
                  <textarea 
                    id="programDescription" 
                    rows={3} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={loyaltyProgram.description}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notifications</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emailNotifs" className="rounded border-gray-300" checked />
                    <Label htmlFor="emailNotifs" className="font-normal">Notifications par email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="smsNotifs" className="rounded border-gray-300" checked />
                    <Label htmlFor="smsNotifs" className="font-normal">Notifications par SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminderNotifs" className="rounded border-gray-300" checked />
                    <Label htmlFor="reminderNotifs" className="font-normal">Rappels d'expiration des récompenses</Label>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button>Enregistrer les modifications</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client detail dialog */}
      {selectedClient && (
        <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Profil de fidélité client</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Informations du client</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Nom</Label>
                    <div className="text-md font-medium">{selectedClient.name}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="text-md">{selectedClient.email}</div>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <div className="text-md">{selectedClient.phone}</div>
                  </div>
                  <div>
                    <Label>Inscrit depuis</Label>
                    <div className="text-md">{new Date(selectedClient.joinDate).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <Label>Dernière activité</Label>
                    <div className="text-md">{new Date(selectedClient.lastActivity).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Statut de fidélité</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Niveau</Label>
                    <div className="text-md flex items-center mt-1">
                      {getTierBadge(selectedClient.tier)}
                    </div>
                  </div>
                  <div>
                    <Label>Points actuels</Label>
                    <div className="text-md flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{selectedClient.points}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Prochain niveau</Label>
                    <div className="text-md">
                      {selectedClient.tier === 'platinum' ? (
                        <span>Niveau maximum atteint</span>
                      ) : (
                        <div>
                          {selectedClient.tier === 'bronze' && (
                            <div className="flex items-center">
                              <Badge className="bg-gray-400 text-white mr-2">Argent</Badge>
                              <span>{500 - selectedClient.points} points restants</span>
                            </div>
                          )}
                          {selectedClient.tier === 'silver' && (
                            <div className="flex items-center">
                              <Badge className="bg-yellow-500 text-white mr-2">Or</Badge>
                              <span>{1000 - selectedClient.points} points restants</span>
                            </div>
                          )}
                          {selectedClient.tier === 'gold' && (
                            <div className="flex items-center">
                              <Badge className="bg-gray-700 text-white mr-2">Platine</Badge>
                              <span>{1500 - selectedClient.points} points restants</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 mt-6">Avantages actuels</h3>
                <div className="space-y-1">
                  {loyaltyProgram.tiers
                    .find(t => t.name === selectedClient.tier)?.benefits
                    .map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-2" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Récompenses</h3>
              {selectedClient.rewardHistory.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucune récompense attribuée à ce client.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Coût</TableHead>
                      <TableHead>Date d'attribution</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClient.rewardHistory.map(reward => (
                      <TableRow key={reward.id}>
                        <TableCell>{reward.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{reward.pointsCost}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(reward.dateAwarded).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{new Date(reward.expiryDate).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{getRewardStatusBadge(reward.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>Fermer</Button>
              <Button className="flex items-center gap-2" onClick={() => handleAddPoints(selectedClient)}>
                <Plus className="h-4 w-4" />
                <span>Ajouter des points</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Points dialog */}
      <Dialog open={isAddPointsDialogOpen} onOpenChange={setIsAddPointsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter des points</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="client">Client</Label>
              <select 
                id="client" 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                defaultValue={selectedClient?.id || ''}
              >
                <option value="" disabled>Sélectionner un client</option>
                {loyaltyClients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="points">Points à ajouter</Label>
              <Input id="points" type="number" min="1" defaultValue="100" />
            </div>
            <div>
              <Label htmlFor="reason">Raison</Label>
              <select id="reason" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="repair">Réparation</option>
                <option value="service">Entretien</option>
                <option value="purchase">Achat de produits</option>
                <option value="referral">Parrainage</option>
                <option value="bonus">Bonus</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea 
                id="notes" 
                rows={3} 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Notes supplémentaires..."
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAddPointsDialogOpen(false)}>Annuler</Button>
            <Button>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Reward dialog */}
      <Dialog open={isNewRewardDialogOpen} onOpenChange={setIsNewRewardDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle récompense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rewardName">Nom de la récompense</Label>
              <Input id="rewardName" placeholder="Nom de la récompense" />
            </div>
            <div>
              <Label htmlFor="rewardDescription">Description</Label>
              <textarea 
                id="rewardDescription" 
                rows={3} 
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Description détaillée de la récompense..."
              />
            </div>
            <div>
              <Label htmlFor="pointsCost">Coût en points</Label>
              <Input id="pointsCost" type="number" min="1" defaultValue="500" />
            </div>
            <div>
              <Label htmlFor="expiryDays">Validité (jours)</Label>
              <Input id="expiryDays" type="number" min="1" defaultValue="90" />
            </div>
            <div>
              <Label htmlFor="availability">Disponibilité</Label>
              <select id="availability" className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="always">Toujours disponible</option>
                <option value="limited">Quantité limitée</option>
              </select>
            </div>
            {/* Conditional field for limited availability */}
            <div>
              <Label htmlFor="quantity">Quantité disponible</Label>
              <Input id="quantity" type="number" min="1" defaultValue="10" />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsNewRewardDialogOpen(false)}>Annuler</Button>
            <Button>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GarageLoyalty;
