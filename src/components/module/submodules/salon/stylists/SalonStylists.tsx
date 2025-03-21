
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Calendar, DollarSign, Search, Plus, Filter, Star, Clock } from "lucide-react";
import StylistsList from './components/StylistsList';
import StylistAvailability from './components/StylistAvailability';
import StylistCommissions from './components/StylistCommissions';
import { useToast } from "@/hooks/use-toast";

const SalonStylists: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("list");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestion des Coiffeurs</h2>
        <Button onClick={() => toast({
          title: "Fonctionnalité à venir",
          description: "L'export des données sera disponible prochainement"
        })}>
          <Scissors className="mr-2 h-4 w-4" />
          Exporter les données
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">
            <Scissors className="h-4 w-4 mr-2" />
            Fiches Coiffeurs
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Calendar className="h-4 w-4 mr-2" />
            Planning & Disponibilités
          </TabsTrigger>
          <TabsTrigger value="commissions">
            <DollarSign className="h-4 w-4 mr-2" />
            Commissions & Primes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <StylistsList />
        </TabsContent>
        
        <TabsContent value="availability">
          <StylistAvailability />
        </TabsContent>
        
        <TabsContent value="commissions">
          <StylistCommissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalonStylists;
