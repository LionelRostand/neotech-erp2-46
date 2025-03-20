
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, PieChart, LineChart, Users, UserPlus, TrendingUp, Percent } from "lucide-react";

const CrmDashboard: React.FC = () => {
  // Sample data - in a real application, this would come from an API or database
  const stats = {
    clients: 42,
    prospects: 78,
    opportunities: 23,
    conversionRate: 28,
    revenueGenerated: 520000,
    averageDealSize: 45000
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Tableau de bord CRM</h2>
      
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">{stats.clients}</div>
            <div className="text-sm text-muted-foreground">Clients</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{stats.prospects}</div>
            <div className="text-sm text-muted-foreground">Prospects</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-3 rounded-full mb-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">{stats.opportunities}</div>
            <div className="text-sm text-muted-foreground">Opportunités</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 p-3 rounded-full mb-2">
              <Percent className="h-6 w-6 text-amber-600" />
            </div>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className="text-sm text-muted-foreground">Taux de conversion</div>
          </div>
        </Card>
      </div>
      
      {/* Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BarChart className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Performance des ventes</h3>
          </div>
          <div className="h-64 flex items-center justify-center border rounded-md bg-muted/20">
            <p className="text-muted-foreground">Graphique de performance des ventes</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium">Répartition des opportunités</h3>
          </div>
          <div className="h-64 flex items-center justify-center border rounded-md bg-muted/20">
            <p className="text-muted-foreground">Graphique de répartition des opportunités</p>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Activité récente</h3>
        <div className="space-y-4">
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Nouvel Opportunité</span>
              <span className="text-sm text-muted-foreground">Il y a 2 heures</span>
            </div>
            <p className="text-sm mt-1">Tech Innovations a créé une nouvelle opportunité de 45 000 €</p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Conversion de Prospect</span>
              <span className="text-sm text-muted-foreground">Il y a 1 jour</span>
            </div>
            <p className="text-sm mt-1">Global Industries est devenu client</p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">Nouveau Contact</span>
              <span className="text-sm text-muted-foreground">Il y a 3 jours</span>
            </div>
            <p className="text-sm mt-1">Marie Dupont a été ajoutée comme contact chez Acme Corporation</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CrmDashboard;
