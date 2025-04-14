
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalaryForm } from './components/SalaryForm';
import PayslipHistory from './components/PayslipHistory';
import { Cog, FileText, Plus } from 'lucide-react';

const SalariesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("creation");
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="creation" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Créer une fiche de paie
          </TabsTrigger>
          <TabsTrigger value="historique" className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="parametres" className="flex items-center">
            <Cog className="h-4 w-4 mr-1" />
            Paramètres
          </TabsTrigger>
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
          <PayslipHistory />
        </TabsContent>
        
        <TabsContent value="parametres">
          <Card className="p-6 bg-white shadow-sm">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Paramètres des fiches de paie</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <p className="text-gray-500 mb-4">Configuration des paramètres de calcul des fiches de paie selon le code du travail français.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Taux de cotisations sociales</h3>
                    <p className="text-sm text-gray-600">Cotisations salariales: 22%</p>
                    <p className="text-sm text-gray-600">Cotisations patronales: 42%</p>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Congés et RTT</h3>
                    <p className="text-sm text-gray-600">Congés payés: 2,5 jours/mois (30 jours/an)</p>
                    <p className="text-sm text-gray-600">RTT: 12 jours/an (35h/semaine)</p>
                  </Card>
                </div>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Base légale</h3>
                  <p className="text-sm text-gray-600">Heures hebdomadaires: 35h</p>
                  <p className="text-sm text-gray-600">Heures mensuelles: 151,67h</p>
                  <p className="text-sm text-gray-600">SMIC horaire 2025: 11,85€</p>
                  <p className="text-sm text-gray-600">SMIC mensuel 2025: 1 797,29€</p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalariesTab;
