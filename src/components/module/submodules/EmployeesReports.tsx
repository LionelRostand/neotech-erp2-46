
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Users, 
  UserCheck, 
  Calendar, 
  Award, 
  GraduationCap, 
  BadgePercent 
} from 'lucide-react';
import { 
  BarChart,
  PieChart as RechartsPieChart,
  LineChart as RechartsLineChart,
  Tooltip,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';

interface ReportCard {
  title: string;
  description: string;
  lastUpdated: string;
  icon: React.ReactNode;
  status: 'ready' | 'updating' | 'scheduled';
  category: string;
}

const EmployeesReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Données de démonstration pour les rapports
  const reports: ReportCard[] = [
    {
      title: "Effectifs par département",
      description: "Nombre d'employés actifs par département",
      lastUpdated: "2025-03-20",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      status: 'ready',
      category: 'rh'
    },
    {
      title: "Absentéisme mensuel",
      description: "Taux d'absentéisme par département",
      lastUpdated: "2025-03-19",
      icon: <UserCheck className="h-5 w-5 text-red-500" />,
      status: 'ready',
      category: 'absence'
    },
    {
      title: "Ancienneté moyenne",
      description: "Ancienneté moyenne des employés par service",
      lastUpdated: "2025-03-15",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      status: 'ready',
      category: 'rh'
    },
    {
      title: "Performance trimestrielle",
      description: "Évaluation de performance par département",
      lastUpdated: "2025-03-10",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      status: 'updating',
      category: 'performance'
    },
    {
      title: "Budget formation",
      description: "Budget formation utilisé vs. alloué",
      lastUpdated: "2025-03-05",
      icon: <GraduationCap className="h-5 w-5 text-amber-500" />,
      status: 'ready',
      category: 'formation'
    },
    {
      title: "Évolution de la masse salariale",
      description: "Évolution sur les 12 derniers mois",
      lastUpdated: "2025-02-29",
      icon: <BadgePercent className="h-5 w-5 text-emerald-500" />,
      status: 'scheduled',
      category: 'paie'
    },
    {
      title: "Prévisions de congés",
      description: "Prévisions de congés pour les 3 prochains mois",
      lastUpdated: "2025-02-28",
      icon: <LineChart className="h-5 w-5 text-cyan-500" />,
      status: 'ready',
      category: 'absence'
    },
    {
      title: "Répartition par type de contrat",
      description: "Analyse des types de contrats dans l'entreprise",
      lastUpdated: "2025-02-25",
      icon: <PieChart className="h-5 w-5 text-indigo-500" />,
      status: 'ready',
      category: 'contrat'
    },
  ];

  // Filtrer les rapports en fonction de l'onglet actif
  const filteredReports = activeTab === 'all' 
    ? reports 
    : reports.filter(report => report.category === activeTab);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ready':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'updating':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Mise à jour</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Planifié</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Rapports RH</h2>
          <p className="text-gray-500">Consultez et générez des rapports sur vos données RH</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Ce mois-ci</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Exporter</Button>
          <Button>Nouveau rapport</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="rh">Général RH</TabsTrigger>
              <TabsTrigger value="absence">Absences</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="formation">Formation</TabsTrigger>
              <TabsTrigger value="paie">Paie</TabsTrigger>
              <TabsTrigger value="contrat">Contrats</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReports.map((report, index) => (
                  <Card key={index} className="overflow-hidden border cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {report.icon}
                          <h3 className="font-medium">{report.title}</h3>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{report.description}</p>
                      <p className="text-xs text-gray-400">Dernière mise à jour: {report.lastUpdated}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredReports.length === 0 && (
                <div className="text-center py-10">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">Aucun rapport disponible</h3>
                  <p className="mt-1 text-gray-500">Aucun rapport n'est disponible pour cette catégorie.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesReports;
