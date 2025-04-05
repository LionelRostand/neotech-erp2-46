
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  FileSignature, 
  ListFilter, 
  Plus,
  Download,
  FileText,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useContractsData } from '@/hooks/useContractsData';
import CreateContractDialog from './CreateContractDialog';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';

const EmployeesContracts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('actifs');
  const { contracts, stats, isLoading, error } = useContractsData();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleExportData = (format: 'excel' | 'pdf') => {
    const filteredContracts = activeTab === 'tous' 
      ? contracts 
      : activeTab === 'actifs'
      ? contracts.filter(contract => contract.status === 'Actif')
      : activeTab === 'futurs'
      ? contracts.filter(contract => contract.status === 'À venir')
      : contracts.filter(contract => contract.status === 'Expiré');
    
    if (format === 'excel') {
      exportToExcel(
        filteredContracts, 
        'Contrats', 
        'liste_contrats'
      );
      toast.success("Export Excel en cours...");
    } else {
      exportToPdf(
        filteredContracts, 
        'Liste des Contrats', 
        'liste_contrats'
      );
      toast.success("Export PDF en cours...");
    }
  };

  const handleCreateNew = () => {
    setShowCreateDialog(true);
  };

  const handleRefresh = () => {
    toast.success("Données actualisées");
    // Les données sont automatiquement rechargées grâce au hook useContractsData
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des contrats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        Une erreur est survenue lors du chargement des contrats.
      </div>
    );
  }

  const filteredContracts = activeTab === 'tous' 
    ? contracts 
    : activeTab === 'actifs'
    ? contracts.filter(contract => contract.status === 'Actif')
    : activeTab === 'futurs'
    ? contracts.filter(contract => contract.status === 'À venir')
    : contracts.filter(contract => contract.status === 'Expiré');

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des contrats</h2>
          <p className="text-gray-500">Contrats et conditions d'emploi</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExportData('excel')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExportData('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button size="sm" onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contrat
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Contrats actifs</h3>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">À venir</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.upcoming}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">Contrats expirés</h3>
              <p className="text-2xl font-bold text-amber-700">{stats.expired}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
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

      {/* Contract types tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="tous" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Tous
          </TabsTrigger>
          <TabsTrigger value="actifs" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Actifs
          </TabsTrigger>
          <TabsTrigger value="futurs" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            À venir
          </TabsTrigger>
          <TabsTrigger value="expires" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Expirés
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
                      <TableHead>Position</TableHead>
                      <TableHead>Date début</TableHead>
                      <TableHead>Date fin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.length > 0 ? (
                      filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={contract.employeePhoto} alt={contract.employeeName} />
                                <AvatarFallback>{contract.employeeName?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{contract.employeeName}</p>
                                <p className="text-xs text-gray-500">{contract.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{contract.type}</TableCell>
                          <TableCell>{contract.position}</TableCell>
                          <TableCell>{contract.startDate}</TableCell>
                          <TableCell>{contract.endDate || 'Indéterminée'}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                contract.status === 'Actif'
                                  ? 'bg-green-100 text-green-800'
                                  : contract.status === 'À venir'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }
                            >
                              {contract.status}
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
                          Aucun contrat trouvé
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

      {/* Dialog for creating a new contract */}
      <CreateContractDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default EmployeesContracts;
