
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus, Filter, Check, X, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useTimeSheetData } from '@/hooks/useTimeSheetData';
import TimesheetTable from './timesheet/TimesheetTable';
import TimesheetStats from './timesheet/TimesheetStats';
import TimesheetForm from './timesheet/TimesheetForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import * as XLSX from 'xlsx';

const EmployeesTimesheet: React.FC = () => {
  const { timeSheets, timeSheetsByStatus, timeSheetStats, isLoading } = useTimeSheetData();
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filtrer les feuilles de temps selon l'onglet actif
  const filteredTimeSheets = activeTab === 'all' 
    ? timeSheets 
    : activeTab === 'submitted' 
      ? timeSheetsByStatus['Soumis']
      : activeTab === 'approved'
        ? timeSheetsByStatus['Validé']
        : activeTab === 'rejected'
          ? timeSheetsByStatus['Rejeté']
          : timeSheetsByStatus['En cours'];

  // Gérer la validation d'une feuille de temps
  const handleApprove = (id: string) => {
    toast.success(`Feuille de temps ${id} approuvée`);
  };

  // Gérer le rejet d'une feuille de temps
  const handleReject = (id: string) => {
    toast.success(`Feuille de temps ${id} rejetée`);
  };

  // Gérer la création d'une nouvelle feuille de temps
  const handleCreateTimesheet = (data: any) => {
    toast.success('Feuille de temps créée avec succès');
    setIsFormOpen(false);
  };

  // Exporter les feuilles de temps au format Excel
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Préparer les données pour l'export
      const exportData = timeSheets.map(sheet => ({
        'ID': sheet.id,
        'Employé': sheet.employeeName || 'Non défini',
        'Titre': sheet.title || 'Sans titre',
        'Du': sheet.startDate || 'N/A',
        'Au': sheet.endDate || 'N/A',
        'Heures': sheet.totalHours || 0,
        'Statut': sheet.status || 'En cours',
        'Mis à jour': sheet.lastUpdateText || 'N/A'
      }));
      
      // Créer une feuille Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Feuilles de temps");
      
      // Définir la largeur des colonnes
      worksheet['!cols'] = [
        { wch: 10 }, // ID
        { wch: 25 }, // Employé
        { wch: 30 }, // Titre
        { wch: 12 }, // Du
        { wch: 12 }, // Au
        { wch: 10 }, // Heures
        { wch: 12 }, // Statut
        { wch: 20 }  // Mis à jour
      ];
      
      // Exporter le fichier
      XLSX.writeFile(workbook, `Feuilles_de_temps_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Export des feuilles de temps réussi');
    } catch (error) {
      console.error('Erreur lors de l\'export', error);
      toast.error('Erreur lors de l\'export des feuilles de temps');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Feuilles de temps</h1>
          <p className="text-muted-foreground">
            Gestion et suivi des feuilles de temps des employés
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting || isLoading || timeSheets.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exportation...' : 'Exporter'}
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle feuille
          </Button>
        </div>
      </div>

      <TimesheetStats stats={timeSheetStats} isLoading={isLoading} />

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mb-6">
          <TabsTrigger value="all" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Toutes</span>
            <span className="ml-1">({timeSheets.length})</span>
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Brouillons</span>
            <span className="ml-1">({timeSheetsByStatus['En cours'].length})</span>
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Soumises</span>
            <span className="ml-1">({timeSheetsByStatus['Soumis'].length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Validées</span>
            <span className="ml-1">({timeSheetsByStatus['Validé'].length})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center">
            <X className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Rejetées</span>
            <span className="ml-1">({timeSheetsByStatus['Rejeté'].length})</span>
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="p-6">
            <TimesheetTable 
              timesheets={filteredTimeSheets} 
              onApprove={handleApprove}
              onReject={handleReject}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <TimesheetForm 
            onSubmit={handleCreateTimesheet} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesTimesheet;
