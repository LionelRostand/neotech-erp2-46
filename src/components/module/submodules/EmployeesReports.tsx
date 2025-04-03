import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  ListFilter, 
  Plus,
  Download,
  FileText,
  Clock,
  Eye,
  FilePlus2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useReportsData } from '@/hooks/useReportsData';

const EmployeesReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('liste');
  const { reports, stats, isLoading, error } = useReportsData();

  const handleGenerateReport = () => {
    toast.success("Génération du rapport démarrée");
    // Logique de génération à implémenter
  };

  const handleExportData = () => {
    toast.success("Export des données des rapports démarré");
    // Logique d'export à implémenter
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des rapports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des rapports.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Rapports</h2>
          <p className="text-gray-500">Analyses et statistiques des ressources humaines</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" onClick={handleGenerateReport}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau rapport
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Rapports générés</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.generated}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">En traitement</h3>
              <p className="text-2xl font-bold text-amber-700">{stats.processing}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Vues totales</h3>
              <p className="text-2xl font-bold text-green-700">{stats.totalViews}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
            <BarChart className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-3">
          <TabsTrigger value="liste" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Mes rapports
          </TabsTrigger>
          <TabsTrigger value="standard" className="flex items-center">
            <FilePlus2 className="h-4 w-4 mr-2" />
            Rapports standard
          </TabsTrigger>
          <TabsTrigger value="analyse" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Analyse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date de création</TableHead>
                      <TableHead>Créé par</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Vues</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.title}</TableCell>
                          <TableCell>{report.type}</TableCell>
                          <TableCell>{report.createdDate}</TableCell>
                          <TableCell>{report.creatorName}</TableCell>
                          <TableCell>{report.format}</TableCell>
                          <TableCell>{report.views}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                report.status === 'Généré'
                                  ? 'bg-green-100 text-green-800'
                                  : report.status === 'En traitement'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                if (report.downloadUrl && report.status === 'Généré') {
                                  // Ouvrir dans une nouvelle fenêtre ou télécharger
                                  window.open(report.downloadUrl, '_blank');
                                } else {
                                  toast.info("Rapport non disponible pour le moment");
                                }
                              }}
                              disabled={!report.downloadUrl || report.status !== 'Généré'}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Télécharger
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucun rapport trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standard">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:bg-gray-50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
                    <FileText className="h-10 w-10 text-blue-500 mb-2" />
                    <h3 className="font-medium">Bilan social</h3>
                    <p className="text-sm text-gray-500">Synthèse annuelle obligatoire</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:bg-gray-50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
                    <BarChart className="h-10 w-10 text-green-500 mb-2" />
                    <h3 className="font-medium">Analyse des salaires</h3>
                    <p className="text-sm text-gray-500">Répartition et évolution</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:bg-gray-50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
                    <Clock className="h-10 w-10 text-amber-500 mb-2" />
                    <h3 className="font-medium">Suivi des absences</h3>
                    <p className="text-sm text-gray-500">Tendances et motifs</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:bg-gray-50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
                    <Eye className="h-10 w-10 text-red-500 mb-2" />
                    <h3 className="font-medium">Turnover</h3>
                    <p className="text-sm text-gray-500">Suivi des départs et recrutements</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:bg-gray-50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
                    <FilePlus2 className="h-10 w-10 text-purple-500 mb-2" />
                    <h3 className="font-medium">Formation et compétences</h3>
                    <p className="text-sm text-gray-500">Suivi des actions de formation</p>
                  </CardContent>
                </Card>
                
                <Card className="hover:bg-gray-50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
                    <FileText className="h-10 w-10 text-gray-500 mb-2" />
                    <h3 className="font-medium">Rapport personnalisé</h3>
                    <p className="text-sm text-gray-500">Créer un nouveau rapport</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyse">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Module d'analyse avancée (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesReports;
