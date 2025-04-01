import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, User, Clock, ArrowUpRight, Tag, Star } from "lucide-react";
import { TransportClient, LoyaltyTier } from '../types';

interface TransportLoyaltyProps {
  // Define any props here
}

const TransportLoyalty: React.FC<TransportLoyaltyProps> = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for loyalty tiers
  const loyaltyTiers: LoyaltyTier[] = [
    {
      id: "tier-1",
      name: "Bronze",
      minimumPoints: 0,
      benefits: ["Accès prioritaire", "10% de réduction"],
      discountPercentage: 10,
      color: "bronze",
      icon: "bronze-icon"
    },
    {
      id: "tier-2",
      name: "Argent",
      minimumPoints: 500,
      benefits: ["Accès prioritaire", "15% de réduction", "Surclassement gratuit"],
      discountPercentage: 15,
      color: "silver",
      icon: "silver-icon"
    },
    {
      id: "tier-3",
      name: "Or",
      minimumPoints: 1000,
      benefits: ["Accès prioritaire", "20% de réduction", "Surclassement gratuit", "Cadeau d'anniversaire"],
      discountPercentage: 20,
      color: "gold",
      icon: "gold-icon"
    }
  ];

  // Mock data for clients
  const clients: TransportClient[] = [
    {
      id: "client-1",
      firstName: "Alice",
      lastName: "Dupont",
      email: "alice.dupont@example.com",
      phone: "0612345678",
      address: "10 rue de la Paix, Paris",
      clientType: "individual",
      loyaltyPoints: 620,
      notes: [],
      createdAt: "2023-01-01",
      active: true
    },
    {
      id: "client-2",
      firstName: "Bob",
      lastName: "Martin",
      email: "bob.martin@example.com",
      phone: "0687654321",
      address: "20 avenue des Champs-Élysées, Paris",
      clientType: "corporate",
      loyaltyPoints: 1250,
      notes: [],
      createdAt: "2023-02-15",
      active: true
    },
    {
      id: "client-3",
      firstName: "Claire",
      lastName: "Lefevre",
      email: "claire.lefevre@example.com",
      phone: "0645678912",
      address: "30 boulevard Haussmann, Paris",
      clientType: "vip",
      loyaltyPoints: 380,
      notes: [],
      createdAt: "2023-03-10",
      active: true
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Programme de fidélité</h2>
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="tiers">Niveaux de fidélité</TabsTrigger>
          <TabsTrigger value="clients">Clients fidèles</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques du programme</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                <Gift className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{loyaltyTiers.length}</span>
                <span className="text-sm text-gray-500">Niveaux de fidélité</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                <User className="h-6 w-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{clients.length}</span>
                <span className="text-sm text-gray-500">Clients inscrits</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                <Clock className="h-6 w-6 text-yellow-500 mb-2" />
                <span className="text-2xl font-bold">3 mois</span>
                <span className="text-sm text-gray-500">Durée moyenne d'adhésion</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tiers">
          <Card>
            <CardHeader>
              <CardTitle>Niveaux de fidélité</CardTitle>
              {/* <CardDescription>Gérez les différents niveaux de votre programme de fidélité</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-4">
              {loyaltyTiers.map((tier) => (
                <div key={tier.id} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{tier.name}</h3>
                      <p className="text-sm text-gray-500">Minimum {tier.minimumPoints} points</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-500">{tier.discountPercentage}% de réduction</Badge>
                  </div>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients fidèles</CardTitle>
              {/* <CardDescription>Liste de vos clients inscrits au programme de fidélité</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{client.firstName} {client.lastName}</h3>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{client.loyaltyPoints} points</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>Inscrit le {client.createdAt}</span>
                    </div>
                    <Badge className="bg-green-100 text-green-500">Actif</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportLoyalty;
