
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  ListFilter, 
  Plus,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRecruitmentData } from '@/hooks/useRecruitmentData';

const EmployeesRecruitment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ouverts');
  const { recruitmentPosts, stats, isLoading, error } = useRecruitmentData();

  const handleExportData = () => {
    toast.success("Export des données de recrutement démarré");
    // Logique d'export à implémenter
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des données de recrutement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des données de recrutement.
      </div>
    );
  }

  const filteredPosts = activeTab === 'tous' 
    ? recruitmentPosts 
    : activeTab === 'ouverts'
    ? recruitmentPosts.filter(post => post.status === 'Ouvert')
    : activeTab === 'en-cours'
    ? recruitmentPosts.filter(post => post.status === 'En cours')
    : recruitmentPosts.filter(post => ['Clôturé', 'Abandonné'].includes(post.status));

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Recrutement</h2>
          <p className="text-gray-500">Gestion des offres d'emploi et candidatures</p>
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
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle offre
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Postes ouverts</h3>
              <p className="text-2xl font-bold text-green-700">{stats.open}</p>
            </div>
            <Briefcase className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">En recrutement</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">Postes pourvus</h3>
              <p className="text-2xl font-bold text-amber-700">{stats.closed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Candidatures</h3>
              <p className="text-2xl font-bold text-gray-700">{stats.totalApplications}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="ouverts" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Ouverts
          </TabsTrigger>
          <TabsTrigger value="en-cours" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            En cours
          </TabsTrigger>
          <TabsTrigger value="clotures" className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Clôturés
          </TabsTrigger>
          <TabsTrigger value="tous" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Tous
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Date d'ouverture</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Candidatures</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.position}</TableCell>
                          <TableCell>{post.department}</TableCell>
                          <TableCell>{post.openDate}</TableCell>
                          <TableCell>{post.hiringManagerName}</TableCell>
                          <TableCell>{post.applicationCount || 0}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                post.priority === 'Haute'
                                  ? 'bg-red-100 text-red-800'
                                  : post.priority === 'Moyenne'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {post.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                post.status === 'Ouvert'
                                  ? 'bg-green-100 text-green-800'
                                  : post.status === 'En cours'
                                  ? 'bg-blue-100 text-blue-800'
                                  : post.status === 'Clôturé'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {post.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucun poste trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesRecruitment;
