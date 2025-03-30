
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Search, Gift, CreditCard, Calendar, User, Settings } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const TransportLoyalty: React.FC = () => {
  const [activeTab, setActiveTab] = useState('points');
  const [searchTerm, setSearchTerm] = useState('');

  const mockLoyaltyMembers = [
    { 
      id: '1',
      name: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      phone: '06 12 34 56 78',
      points: 2450,
      level: 'Gold',
      dateJoined: '2022-03-15',
      lastActivity: '2023-05-22'
    },
    { 
      id: '2',
      name: 'Thomas Durand',
      email: 'thomas.durand@example.com',
      phone: '07 23 45 67 89',
      points: 1850,
      level: 'Silver',
      dateJoined: '2022-05-10',
      lastActivity: '2023-06-01'
    },
    { 
      id: '3',
      name: 'Claire Blanc',
      email: 'claire.blanc@example.com',
      phone: '06 34 56 78 90',
      points: 3200,
      level: 'Platinum',
      dateJoined: '2021-11-30',
      lastActivity: '2023-05-28'
    },
    { 
      id: '4',
      name: 'Marc Petit',
      email: 'marc.petit@example.com',
      phone: '07 45 67 89 01',
      points: 950,
      level: 'Bronze',
      dateJoined: '2023-01-05',
      lastActivity: '2023-04-15'
    }
  ];

  const mockRewards = [
    {
      id: '1',
      name: 'Course gratuite',
      pointsCost: 1000,
      description: 'Une course gratuite jusqu\'à 15€',
      validityDays: 30,
      available: true
    },
    {
      id: '2',
      name: 'VIP pendant 1 mois',
      pointsCost: 2500,
      description: 'Accès au statut VIP pendant un mois (priorité, véhicules premium)',
      validityDays: 30,
      available: true
    },
    {
      id: '3',
      name: 'Pass Week-end',
      pointsCost: 5000,
      description: 'Courses illimitées pendant un weekend (max 10 courses)',
      validityDays: 90,
      available: true
    },
    {
      id: '4',
      name: 'Cadeau surprise',
      pointsCost: 1500,
      description: 'Un cadeau surprise livré à votre adresse',
      validityDays: 60,
      available: true
    }
  ];

  const mockTransactions = [
    {
      id: '1',
      memberName: 'Sophie Martin',
      type: 'earn',
      points: 150,
      date: '2023-05-22',
      description: 'Course #12345'
    },
    {
      id: '2',
      memberName: 'Thomas Durand',
      type: 'earn',
      points: 200,
      date: '2023-06-01',
      description: 'Course #12346'
    },
    {
      id: '3',
      memberName: 'Claire Blanc',
      type: 'spend',
      points: 1000,
      date: '2023-05-28',
      description: 'Course gratuite'
    },
    {
      id: '4',
      memberName: 'Sophie Martin',
      type: 'earn',
      points: 300,
      date: '2023-05-15',
      description: 'Course #12340'
    }
  ];
  
  // Filtrer les données en fonction du terme de recherche
  const filteredMembers = mockLoyaltyMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredTransactions = mockTransactions.filter(transaction => 
    transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Gérer les actions
  const handleAddPoints = (memberId: string) => {
    toast.success("Points ajoutés avec succès");
  };
  
  const handleRedeemReward = (rewardId: string) => {
    toast.success("Récompense échangée avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Configuration</span>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockLoyaltyMembers.length}</div>
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points distribués (mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">8,650</div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Récompenses échangées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">24</div>
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher un membre, transaction..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="points" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Points & Membres</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span>Récompenses</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Transactions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="points" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membre</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Dernière activité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Aucun membre trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{member.points}</span>
                          </TableCell>
                          <TableCell>
                            <LoyaltyBadge level={member.level} />
                          </TableCell>
                          <TableCell>{new Date(member.lastActivity).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddPoints(member.id)}
                            >
                              Ajouter des points
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="rewards" className="pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {mockRewards.map(reward => (
                  <Card key={reward.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{reward.name}</span>
                        <Badge variant="secondary">{reward.pointsCost} pts</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 mb-2">{reward.description}</p>
                      <p className="text-sm text-gray-500">
                        Validité: {reward.validityDays} jours
                      </p>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                      <Button 
                        className="w-full"
                        variant="outline"
                        onClick={() => handleRedeemReward(reward.id)}
                      >
                        Échanger
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="transactions" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Membre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Aucune transaction trouvée.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{transaction.memberName}</TableCell>
                          <TableCell>
                            {transaction.type === 'earn' ? (
                              <Badge variant="success">Gagné</Badge>
                            ) : (
                              <Badge variant="secondary">Utilisé</Badge>
                            )}
                          </TableCell>
                          <TableCell className={transaction.type === 'earn' ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>
                            {transaction.type === 'earn' ? '+' : '-'}{transaction.points}
                          </TableCell>
                          <TableCell>{transaction.description}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant Badge personnalisé pour les niveaux de fidélité
const LoyaltyBadge: React.FC<{ level: string }> = ({ level }) => {
  switch (level) {
    case 'Platinum':
      return <Badge className="bg-indigo-600">Platinum</Badge>;
    case 'Gold':
      return <Badge className="bg-yellow-600">Gold</Badge>;
    case 'Silver':
      return <Badge className="bg-gray-400 text-gray-900">Silver</Badge>;
    case 'Bronze':
      return <Badge className="bg-amber-700">Bronze</Badge>;
    default:
      return <Badge>{level}</Badge>;
  }
};

export default TransportLoyalty;
