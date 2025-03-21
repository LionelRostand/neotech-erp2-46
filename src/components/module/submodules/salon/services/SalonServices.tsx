
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Plus, Filter, Search, Clock, Euro } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ServicesList from './components/ServicesList';
import ServiceCategories from './components/ServiceCategories';
import SpecialOffersTab from './components/SpecialOffersTab';
import AddServiceDialog from './components/AddServiceDialog';

const SalonServices: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Catalogue des Services</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un service..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => toast({
          title: "Fonctionnalité à venir",
          description: "Les filtres avancés seront disponibles prochainement"
        })}>
          <Filter className="mr-2 h-4 w-4" />
          Filtres
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">
            <Scissors className="h-4 w-4 mr-2" />
            Liste des Services
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Filter className="h-4 w-4 mr-2" />
            Catégories
          </TabsTrigger>
          <TabsTrigger value="offers">
            <Euro className="h-4 w-4 mr-2" />
            Offres Spéciales
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ServicesList searchQuery={searchQuery} />
        </TabsContent>
        
        <TabsContent value="categories">
          <ServiceCategories />
        </TabsContent>
        
        <TabsContent value="offers">
          <SpecialOffersTab />
        </TabsContent>
      </Tabs>
      
      <AddServiceDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default SalonServices;
