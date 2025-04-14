
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalaryForm } from './components/SalaryForm';

const SalariesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("creation");
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="creation">Créer une fiche de paie</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="creation" className="space-y-4">
          <Card className="p-6 bg-white shadow-sm">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Nouvelle fiche de paie</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <SalaryForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historique">
          <Card className="p-6 bg-white shadow-sm">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Historique des fiches de paie</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <p className="text-gray-500">L'historique des fiches de paie sera disponible ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parametres">
          <Card className="p-6 bg-white shadow-sm">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Paramètres des fiches de paie</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <p className="text-gray-500">Les paramètres des fiches de paie seront configurables ici.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalariesTab;
