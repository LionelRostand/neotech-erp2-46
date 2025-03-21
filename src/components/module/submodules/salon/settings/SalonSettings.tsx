
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Clock, Tag, Shield, Calendar, Percent, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import the settings tabs
import ScheduleSettings from './tabs/ScheduleSettings';
import PricingSettings from './tabs/PricingSettings';
import PermissionsSettings from './tabs/PermissionsSettings';

const SalonSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("schedule");

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Paramètres du Salon</h2>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Enregistrer tous les paramètres</span>
        </Button>
      </div>
      
      <Tabs defaultValue="schedule" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Horaires et Disponibilités</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span>Tarifs et Promotions</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Accès et Permissions</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="schedule">
          <ScheduleSettings onSave={handleSaveSettings} />
        </TabsContent>
        
        <TabsContent value="pricing">
          <PricingSettings onSave={handleSaveSettings} />
        </TabsContent>
        
        <TabsContent value="permissions">
          <PermissionsSettings onSave={handleSaveSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalonSettings;
