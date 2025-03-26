
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  SunMedium, 
  Calendar, 
  Clock, 
  ListFilter, 
  Plus,
  Download,
  FileText,
  Check,
  X,
  Search
} from 'lucide-react';
import { LeaveRequestsList } from './leaves/LeaveRequestsList';
import { LeaveCalendar } from './leaves/LeaveCalendar';
import { LeaveBalanceCards } from './leaves/LeaveBalanceCards';
import { LeavePolicies } from './leaves/LeavePolicies';
import { CreateLeaveRequestDialog } from './leaves/CreateLeaveRequestDialog';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { LeaveBalances } from './leaves/LeaveBalances';
import { useEmployeeLeaves, LeaveRequest } from '@/hooks/useEmployeeLeaves';
import { COLLECTIONS } from '@/lib/firebase-collections';

const EmployeesLeaves: React.FC = () => {
  const [activeTab, setActiveTab] = useState('demandes');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    employee: '',
    dateRange: ''
  });
  const [isExportLoading, setIsExportLoading] = useState(false);
  
  // Utilisation du hook pour récupérer les données Firebase
  const { 
    leaves, 
    isLoading, 
    addLeave, 
    updateLeave, 
    deleteLeave,
    refreshLeaves
  } = useEmployeeLeaves();

  // Recharger les données quand on entre dans ce composant
  useEffect(() => {
    console.log('EmployeesLeaves: Refreshing leaves data');
    refreshLeaves();
  }, [refreshLeaves]);

  const handleSubmitLeaveRequest = async (data: any) => {
    try {
      console.log('Adding leave request:', data);
      await addLeave(data);
      setIsCreateDialogOpen(false);
      toast.success("Demande de congé soumise avec succès");
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error("Erreur lors de la soumission de la demande de congé");
    }
  };

  const handleApproveLeave = async (id: string) => {
    try {
      await updateLeave(id, { status: 'Approuvé' });
      toast.success(`Demande de congé #${id} approuvée`);
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleRejectLeave = async (id: string) => {
    try {
      await updateLeave(id, { status: 'Refusé' });
      toast.success(`Demande de congé #${id} refusée`);
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const handleExportData = () => {
    setIsExportLoading(true);
    
    // Exporter les données réelles vers Excel
    try {
      // Préparer les données
      const data = [
        ['ID', 'Employé', 'Type de congé', 'Date de début', 'Date de fin', 'Statut'],
        ...leaves.map(leave => [
          leave.id,
          leave.employeeId,
          leave.type,
          leave.startDate,
          leave.endDate,
          leave.status
        ])
      ];
      
      // Créer une feuille de calcul
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Congés");
      
      // Générer le fichier Excel et le télécharger
      XLSX.writeFile(wb, "demandes_conges.xlsx");
      
      toast.success("Export Excel réalisé avec succès");
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Erreur lors de l'export Excel");
    } finally {
      setIsExportLoading(false);
    }
  };

  const handleApplyFilters = () => {
    toast.success("Filtres appliqués");
    setIsFilterDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des congés</h2>
          <p className="text-gray-500">Suivi et approbation des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsFilterDialogOpen(true)}>
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportData} 
            disabled={isExportLoading}
          >
            {isExportLoading ? (
              <span className="animate-spin mr-2 h-4 w-4 border-b-2 rounded-full"></span>
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Exporter
          </Button>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Leave balance cards */}
      <LeaveBalanceCards />

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-3xl grid grid-cols-4">
          <TabsTrigger value="demandes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Demandes
          </TabsTrigger>
          <TabsTrigger value="calendrier" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="soldes" className="flex items-center">
            <SunMedium className="h-4 w-4 mr-2" />
            Soldes
          </TabsTrigger>
          <TabsTrigger value="parametres" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Politiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demandes">
          <Card>
            <CardContent className="p-6">
              <LeaveRequestsList 
                onApprove={handleApproveLeave}
                onReject={handleRejectLeave}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendrier">
          <Card>
            <CardContent className="p-6">
              <LeaveCalendar />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soldes">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Soldes de congés détaillés</h3>
              <p className="text-gray-600 mb-8">
                Vue détaillée des soldes de congés par type et par employé
              </p>
              <LeaveBalances />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametres">
          <Card>
            <CardContent className="p-6">
              <LeavePolicies />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for creating new leave requests */}
      <CreateLeaveRequestDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleSubmitLeaveRequest}
      />

      {/* Dialog for filters */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les demandes de congés</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Statut</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({...filters, status: value})}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="rejected">Refusé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type-filter">Type de congé</Label>
              <Select 
                value={filters.type} 
                onValueChange={(value) => setFilters({...filters, type: value})}
              >
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="paid">Congés payés</SelectItem>
                  <SelectItem value="rtt">RTT</SelectItem>
                  <SelectItem value="sick">Maladie</SelectItem>
                  <SelectItem value="unpaid">Sans solde</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employee-filter">Employé</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="employee-filter" 
                  placeholder="Rechercher un employé" 
                  className="pl-8"
                  value={filters.employee}
                  onChange={(e) => setFilters({...filters, employee: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-filter">Période</Label>
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => setFilters({...filters, dateRange: value})}
              >
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="Toutes les périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="current-month">Mois en cours</SelectItem>
                  <SelectItem value="next-month">Mois prochain</SelectItem>
                  <SelectItem value="last-30">30 derniers jours</SelectItem>
                  <SelectItem value="next-90">90 prochains jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleApplyFilters}>Appliquer les filtres</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesLeaves;
