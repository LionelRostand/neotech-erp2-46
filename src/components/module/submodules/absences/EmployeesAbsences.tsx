
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileDown,
  Filter,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAbsencesData } from '@/hooks/useAbsencesData';
import CreateAbsenceDialog from './CreateAbsenceDialog';
import AbsenceDetailsDialog from './AbsenceDetailsDialog';
import { Absence } from '@/hooks/useAbsencesData';
import { updateLeaveBalance } from './utils/absenceUtils';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';

const EmployeesAbsences: React.FC = () => {
  const { absences, stats, isLoading, error } = useAbsencesData();
  const { leaveBalances, refetch: refetchBalances } = useLeaveBalances();
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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
    refetchBalances();
  };

  // Handle create new absence
  const handleCreateNew = () => {
    setShowCreateDialog(true);
  };

  // Handle view details
  const handleViewDetails = (absence: Absence) => {
    setSelectedAbsence(absence);
    setShowDetailsDialog(true);
  };

  // Nouvelle fonction pour approuver une absence
  const handleApproveAbsence = async (absence: Absence) => {
    try {
      // Mettre à jour le statut de l'absence (simulation)
      const updatedAbsence = { ...absence, status: 'Validé' };
      
      // Vérifier si l'absence est de type congés payés ou RTT
      if (absence.type.includes('RTT') || 
          absence.type.includes('congé') || 
          absence.type.includes('Congé')) {
        
        // Mettre à jour le solde de congés de l'employé
        await updateLeaveBalance(absence.employeeId, absence.type, absence.days);
        refetchBalances();
        
        toast.success(`Absence validée et ${absence.days} jour(s) déduit(s) du solde de ${absence.type}`);
      } else {
        toast.success("Absence validée");
      }
      
      // Dans une application réelle, vous mettriez à jour la base de données ici
      // Reload data after update
      handleRefresh();
    } catch (error) {
      console.error("Erreur lors de la validation de l'absence:", error);
      toast.error("Erreur lors de la validation de l'absence");
    }
  };

  // Nouvelle fonction pour rejeter une absence
  const handleRejectAbsence = (absence: Absence) => {
    // Mettre à jour le statut de l'absence (simulation)
    const updatedAbsence = { ...absence, status: 'Refusé' };
    
    // Dans une application réelle, vous mettriez à jour la base de données ici
    
    toast.success("Absence refusée");
    
    // Reload data after update
    handleRefresh();
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
                        <TableHead>Jours</TableHead>
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
                          <TableCell>{absence.days}</TableCell>
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
                          <TableCell className="max-w-[150px] truncate">{absence.reason}</TableCell>
                          <TableCell className="text-right">
                            {absence.status === 'En attente' ? (
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleApproveAbsence(absence)}
                                  className="text-green-600 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4 mr-1" /> Valider
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRejectAbsence(absence)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4 mr-1" /> Refuser
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewDetails(absence)}
                              >
                                Détails
                              </Button>
                            )}
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

      {/* Dialog for viewing absence details */}
      <AbsenceDetailsDialog
        absence={selectedAbsence}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
};

export default EmployeesAbsences;
