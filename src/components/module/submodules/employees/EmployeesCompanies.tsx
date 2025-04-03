
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Users, 
  Globe, 
  BarChart, 
  ListFilter, 
  Plus,
  Download,
  FileText
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCompaniesData } from '@/hooks/useCompaniesData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EmployeesCompanies: React.FC = () => {
  const [activeTab, setActiveTab] = useState('liste');
  const { companies, stats, isLoading, error } = useCompaniesData();

  const handleExportData = () => {
    toast.success("Export des données des entreprises démarré");
    // Logique d'export à implémenter
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des données des entreprises...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des données des entreprises.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Entreprises</h2>
          <p className="text-gray-500">Gestion des sociétés et entités légales</p>
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
            Nouvelle entreprise
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Entreprises actives</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.active}</p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Total employés</h3>
              <p className="text-2xl font-bold text-green-700">{stats.totalEmployees}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">Pays</h3>
              <p className="text-2xl font-bold text-amber-700">
                {Array.from(new Set(companies.map(c => c.country).filter(Boolean))).length}
              </p>
            </div>
            <Globe className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Industries</h3>
              <p className="text-2xl font-bold text-gray-700">
                {Array.from(new Set(companies.map(c => c.industry).filter(Boolean))).length}
              </p>
            </div>
            <BarChart className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-3">
          <TabsTrigger value="liste" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Liste des entreprises
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liste">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Nom</TableHead>
                      <TableHead>Localité</TableHead>
                      <TableHead>Industrie</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Employés</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.length > 0 ? (
                      companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                {company.logo ? (
                                  <AvatarImage src={company.logo} alt={company.name} />
                                ) : (
                                  <AvatarFallback>
                                    <Building className="h-5 w-5" />
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium">{company.name}</p>
                                <p className="text-xs text-gray-500">
                                  {company.website ? (
                                    <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                      {company.website}
                                    </a>
                                  ) : '-'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {company.city ? (
                              <>
                                {company.city}
                                {company.country && `, ${company.country}`}
                              </>
                            ) : company.country || '-'}
                          </TableCell>
                          <TableCell>{company.industry || '-'}</TableCell>
                          <TableCell>{company.size || '-'}</TableCell>
                          <TableCell>{company.employeesCount}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                company.status === 'Actif'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {company.status}
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
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucune entreprise trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition par industrie</CardTitle>
                  </CardHeader>
                  <CardContent className="py-8 text-center text-gray-500">
                    Graphique à venir - Distribution par secteur d'activité
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition géographique</CardTitle>
                  </CardHeader>
                  <CardContent className="py-8 text-center text-gray-500">
                    Graphique à venir - Distribution géographique
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Taille des entreprises</CardTitle>
                  </CardHeader>
                  <CardContent className="py-8 text-center text-gray-500">
                    Graphique à venir - Distribution par taille
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Évolution des effectifs</CardTitle>
                  </CardHeader>
                  <CardContent className="py-8 text-center text-gray-500">
                    Graphique à venir - Évolution du nombre d'employés
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6">
              <div className="py-8 text-center text-gray-500">
                Module de gestion des documents d'entreprise (à implémenter)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesCompanies;
