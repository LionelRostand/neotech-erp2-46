
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileDown,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAbsencesData } from '@/hooks/useAbsencesData';
import CreateAbsenceDialog from './CreateAbsenceDialog';

const EmployeesAbsences: React.FC = () => {
  const { absences, stats, isLoading, error } = useAbsencesData();
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filter absences based on active tab
  const filteredAbsences = activeTab === 'all' 
    ? absences 
    : absences?.filter(absence => 
        activeTab === 'pending' ? absence.status === 'En attente' :
        activeTab === 'approved' ? absence.status === 'Validé' :
        activeTab === 'rejected' ? absence.status === 'Refusé' : 
        true
      ) || [];

  // Handle data refresh
  const handleRefresh = () => {
    toast.success("Données actualisées");
    // Data is automatically reloaded through the useAbsencesData hook
  };

  // Handle create new absence
  const handleCreateNew = () => {
    setShowCreateDialog(true);
  };

  // Export data
  const handleExport = (format: 'excel' | 'pdf') => {
    toast.success(`Export ${format.toUpperCase()} en cours...`);
    // Mock function, would normally call actual export utilities
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Gestion des absences</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          
          <Button size="sm" onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle absence
          </Button>
        </div>
      </div>

      {/* Tabs and table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="approved">Approuvées</TabsTrigger>
          <TabsTrigger value="rejected">Refusées</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="ml-2">Chargement des données...</p>
                </div>
              ) : filteredAbsences.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune absence trouvée
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Employé</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date début</TableHead>
                        <TableHead>Date fin</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Raison</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAbsences.map((absence) => (
                        <TableRow key={absence.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={absence.employeePhoto} alt={absence.employeeName} />
                                <AvatarFallback>{absence.employeeName?.charAt(0) || '?'}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{absence.employeeName}</p>
                                <p className="text-xs text-muted-foreground">{absence.employeeId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{absence.type}</TableCell>
                          <TableCell>{absence.startDate}</TableCell>
                          <TableCell>{absence.endDate}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                absence.status === 'Validé'
                                  ? 'bg-green-100 text-green-800'
                                  : absence.status === 'En attente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {absence.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{absence.reason}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating a new absence */}
      <CreateAbsenceDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default EmployeesAbsences;
