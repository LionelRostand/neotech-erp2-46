
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCw } from 'lucide-react';
import { useTimeSheetData } from '@/hooks/useTimeSheetData';
import TimesheetTable from './timesheet/TimesheetTable';
import { toast } from 'sonner';
import CreateTimesheetDialog from './timesheet/CreateTimesheetDialog';
import { approveTimeSheet, rejectTimeSheet, submitTimeSheet } from './timesheet/services/timesheetService';

const EmployeesTimesheet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { timeSheets, timesheetsByStatus, isLoading, refetch } = useTimeSheetData();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleViewTimesheet = (id: string) => {
    toast.info("Visualisation de la feuille de temps " + id);
    // Implémentation à venir: Ouvrir un dialogue avec les détails
  };
  
  const handleEditTimesheet = (id: string) => {
    toast.info("Modification de la feuille de temps " + id);
    // Implémentation à venir: Ouvrir un formulaire d'édition
  };
  
  const handleApproveTimesheet = async (id: string) => {
    try {
      setIsProcessing(true);
      const result = await approveTimeSheet(id);
      if (result) {
        toast.success("La feuille de temps a été validée");
        refetch(); // Rafraîchir les données
      } else {
        toast.error("Erreur lors de la validation de la feuille de temps");
      }
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast.error("Erreur lors de la validation de la feuille de temps");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRejectTimesheet = async (id: string) => {
    try {
      setIsProcessing(true);
      const result = await rejectTimeSheet(id);
      if (result) {
        toast.error("La feuille de temps a été rejetée");
        refetch(); // Rafraîchir les données
      } else {
        toast.error("Erreur lors du rejet de la feuille de temps");
      }
    } catch (error) {
      console.error("Erreur lors du rejet:", error);
      toast.error("Erreur lors du rejet de la feuille de temps");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSubmitTimesheet = async (id: string) => {
    try {
      setIsProcessing(true);
      const result = await submitTimeSheet(id);
      if (result) {
        toast.success("La feuille de temps a été soumise pour validation");
        refetch(); // Rafraîchir les données
      } else {
        toast.error("Erreur lors de la soumission de la feuille de temps");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Erreur lors de la soumission de la feuille de temps");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Données actualisées");
  };
  
  const handleCreateNew = () => {
    setShowCreateDialog(true);
  };

  const handleCreateSuccess = () => {
    // Rafraîchir les données après la création
    refetch();
  };
  
  return (
    <div className="space-y-6">
      {/* En-tête avec boutons d'action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Feuilles de temps</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isProcessing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button onClick={handleCreateNew} disabled={isProcessing}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle feuille
          </Button>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À approuver</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amber-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timesheetsByStatus?.pending.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timesheetsByStatus?.active.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validées</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timesheetsByStatus?.validated.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timesheetsByStatus?.rejected.length || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Onglets et tableau */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">À approuver</TabsTrigger>
          <TabsTrigger value="active">En cours</TabsTrigger>
          <TabsTrigger value="validated">Validées</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <TimesheetTable 
            data={timeSheets} 
            onView={handleViewTimesheet}
            onEdit={handleEditTimesheet}
            onApprove={handleApproveTimesheet}
            onReject={handleRejectTimesheet}
            onSubmit={handleSubmitTimesheet}
            isLoading={isLoading || isProcessing}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <TimesheetTable 
            data={timesheetsByStatus?.pending || []}
            onView={handleViewTimesheet}
            onEdit={handleEditTimesheet}
            onApprove={handleApproveTimesheet}
            onReject={handleRejectTimesheet}
            isLoading={isLoading || isProcessing}
          />
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <TimesheetTable 
            data={timesheetsByStatus?.active || []}
            onView={handleViewTimesheet}
            onEdit={handleEditTimesheet}
            onSubmit={handleSubmitTimesheet}
            isLoading={isLoading || isProcessing}
          />
        </TabsContent>
        
        <TabsContent value="validated" className="space-y-4">
          <TimesheetTable 
            data={timesheetsByStatus?.validated || []}
            onView={handleViewTimesheet}
            isLoading={isLoading || isProcessing}
          />
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          <TimesheetTable 
            data={timesheetsByStatus?.rejected || []}
            onView={handleViewTimesheet}
            onEdit={handleEditTimesheet}
            isLoading={isLoading || isProcessing}
          />
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating a new timesheet */}
      <CreateTimesheetDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default EmployeesTimesheet;
