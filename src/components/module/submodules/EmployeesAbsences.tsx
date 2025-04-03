
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ListFilter, 
  Plus,
  Download,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAbsencesData } from '@/hooks/useAbsencesData';

const EmployeesAbsences: React.FC = () => {
  const [activeTab, setActiveTab] = useState('attente');
  const { absences, stats, isLoading, error } = useAbsencesData();

  const handleApproveAbsence = (id: string) => {
    // Dans une application réelle, nous mettrions à jour Firebase ici
    toast.success(`Demande d'absence #${id} approuvée`);
  };

  const handleRejectAbsence = (id: string) => {
    // Dans une application réelle, nous mettrions à jour Firebase ici
    toast.success(`Demande d'absence #${id} refusée`);
  };

  const handleExportData = () => {
    toast.success("Export des données d'absences démarré");
    // Logique d'export à implémenter
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des absences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des absences.
      </div>
    );
  }

  const filteredAbsences = activeTab === 'toutes' 
    ? absences 
    : activeTab === 'attente'
    ? absences.filter(absence => absence.status === 'En attente')
    : activeTab === 'validees'
    ? absences.filter(absence => absence.status === 'Validé')
    : absences.filter(absence => absence.status === 'Refusé');

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des absences</h2>
          <p className="text-gray-500">Suivi des absences et autorisations</p>
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
            Nouvelle absence
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">En attente</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.pending}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Validées</h3>
              <p className="text-2xl font-bold text-green-700">{stats.validated}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Refusées</h3>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="attente" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            En attente
          </TabsTrigger>
          <TabsTrigger value="validees" className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Validées
          </TabsTrigger>
          <TabsTrigger value="refusees" className="flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            Refusées
          </TabsTrigger>
          <TabsTrigger value="toutes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Toutes
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Employé</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAbsences.length > 0 ? (
                      filteredAbsences.map((absence) => (
                        <TableRow key={absence.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={absence.employeePhoto} alt={absence.employeeName} />
                                <AvatarFallback>{absence.employeeName?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{absence.employeeName}</p>
                                <p className="text-xs text-gray-500">{absence.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{absence.type}</TableCell>
                          <TableCell>
                            <span className="whitespace-nowrap">{absence.startDate}</span>
                            <span className="mx-1">-</span>
                            <span className="whitespace-nowrap">{absence.endDate}</span>
                          </TableCell>
                          <TableCell>{absence.days} jour{absence.days > 1 ? 's' : ''}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                absence.status === 'En attente'
                                  ? 'bg-blue-100 text-blue-800'
                                  : absence.status === 'Validé'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {absence.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {absence.reason || '-'}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {absence.status === 'En attente' ? (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleApproveAbsence(absence.id)}
                                  className="text-green-600"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRejectAbsence(absence.id)}
                                  className="text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Refuser
                                </Button>
                              </>
                            ) : (
                              <Button variant="ghost" size="sm">
                                Détails
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Aucune demande d'absence trouvée
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

export default EmployeesAbsences;
