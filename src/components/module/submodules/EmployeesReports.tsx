
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FileDown, FileText, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, FileUp, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ReportFilters } from './reports/ReportFilters';
import { ReportCard } from './reports/ReportCard';

// Type pour les rapports
interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  chartType: 'bar' | 'pie' | 'line';
  data: any[];
  status: 'ready' | 'updating' | 'scheduled';
  lastUpdated: string;
  content?: string;
}

// Données pour les graphiques
const departmentData = [
  { name: 'Marketing', value: 12 },
  { name: 'Technique', value: 18 },
  { name: 'Finance', value: 8 },
  { name: 'RH', value: 6 },
  { name: 'Direction', value: 4 },
];

const absenceData = [
  { name: 'Marketing', value: 3.5 },
  { name: 'Technique', value: 2.1 },
  { name: 'Finance', value: 4.2 },
  { name: 'RH', value: 1.8 },
  { name: 'Direction', value: 1.2 },
];

const seniorityData = [
  { name: 'Marketing', value: 3.2 },
  { name: 'Technique', value: 5.7 },
  { name: 'Finance', value: 7.2 },
  { name: 'RH', value: 4.1 },
  { name: 'Direction', value: 8.5 },
];

const performanceData = [
  { name: 'Marketing', value: 82 },
  { name: 'Technique', value: 88 },
  { name: 'Finance', value: 76 },
  { name: 'RH', value: 91 },
  { name: 'Direction', value: 95 },
];

const trainingBudgetData = [
  { name: 'Alloué', value: 50000 },
  { name: 'Utilisé', value: 37500 },
];

const salaryEvolutionData = [
  { name: 'Jan', value: 85000 },
  { name: 'Fév', value: 86000 },
  { name: 'Mar', value: 86000 },
  { name: 'Avr', value: 87500 },
  { name: 'Mai', value: 87500 },
  { name: 'Jun', value: 88000 },
  { name: 'Jul', value: 89000 },
  { name: 'Aoû', value: 89000 },
  { name: 'Sep', value: 90000 },
  { name: 'Oct', value: 91000 },
  { name: 'Nov', value: 92000 },
  { name: 'Déc', value: 93000 },
];

const leaveForecastData = [
  { name: 'Marketing', current: 3, forecast: 5 },
  { name: 'Technique', current: 2, forecast: 7 },
  { name: 'Finance', current: 1, forecast: 4 },
  { name: 'RH', current: 2, forecast: 3 },
  { name: 'Direction', current: 1, forecast: 2 },
];

const contractTypeData = [
  { name: 'CDI', value: 42 },
  { name: 'CDD', value: 12 },
  { name: 'Intérim', value: 5 },
  { name: 'Stage', value: 8 },
  { name: 'Alternance', value: 6 },
];

// Couleurs pour les charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#af19ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const EmployeesReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showNewReportDialog, setShowNewReportDialog] = useState(false);
  const [newReportForm, setNewReportForm] = useState({
    title: '',
    description: '',
    category: 'rh',
    chartType: 'bar',
    status: 'scheduled',
  });

  // Liste des rapports unique (plus de doublons)
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'report-1',
      title: 'Effectifs par département',
      description: 'Nombre d\'employés actifs par département',
      category: 'rh',
      chartType: 'bar',
      data: departmentData,
      status: 'ready',
      lastUpdated: '25/05/2023',
    },
    {
      id: 'report-2',
      title: 'Absentéisme mensuel',
      description: 'Taux d\'absentéisme par département',
      category: 'absence',
      chartType: 'bar',
      data: absenceData,
      status: 'ready',
      lastUpdated: '27/05/2023',
    },
    {
      id: 'report-3',
      title: 'Ancienneté moyenne',
      description: 'Ancienneté moyenne des employés par service',
      category: 'rh',
      chartType: 'bar',
      data: seniorityData,
      status: 'ready',
      lastUpdated: '26/05/2023',
    },
    {
      id: 'report-4',
      title: 'Performance trimestrielle',
      description: 'Évaluation de performance par département',
      category: 'performance',
      chartType: 'bar',
      data: performanceData,
      status: 'ready',
      lastUpdated: '20/05/2023',
    },
    {
      id: 'report-5',
      title: 'Budget formation',
      description: 'Budget formation utilisé vs. alloué',
      category: 'formation',
      chartType: 'pie',
      data: trainingBudgetData,
      status: 'ready',
      lastUpdated: '18/05/2023',
    },
    {
      id: 'report-6',
      title: 'Évolution de la masse salariale',
      description: 'Évolution sur les 12 derniers mois',
      category: 'paie',
      chartType: 'line',
      data: salaryEvolutionData,
      status: 'ready',
      lastUpdated: '22/05/2023',
    },
    {
      id: 'report-7',
      title: 'Prévisions de congés',
      description: 'Prévisions de congés pour les 3 prochains mois',
      category: 'absence',
      chartType: 'bar',
      data: leaveForecastData,
      status: 'ready',
      lastUpdated: '24/05/2023',
    },
    {
      id: 'report-8',
      title: 'Répartition par type de contrat',
      description: 'Analyse des types de contrats dans l\'entreprise',
      category: 'contrat',
      chartType: 'pie',
      data: contractTypeData,
      status: 'ready',
      lastUpdated: '21/05/2023',
    },
  ]);

  // Filtrer les rapports en fonction de l'onglet actif
  const filteredReports = activeTab === 'all' 
    ? reports 
    : reports.filter(report => report.category === activeTab);

  // Ouvrir le rapport sélectionné
  const handleOpenReport = (report: Report) => {
    setActiveReport(report);
    setShowReportDialog(true);
  };

  // Fonction pour générer l'icône du rapport en fonction du type de graphique
  const getReportIcon = (chartType: string) => {
    switch (chartType) {
      case 'bar':
        return <BarChart2 className="h-5 w-5 text-blue-500" />;
      case 'pie':
        return <PieChartIcon className="h-5 w-5 text-violet-500" />;
      case 'line':
        return <LineChartIcon className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Fonction pour rendre le graphique approprié
  const renderChart = (report: Report) => {
    if (!report.data || report.data.length === 0) {
      return <div className="text-center p-6 text-gray-500">Aucune donnée disponible</div>;
    }

    switch (report.chartType) {
      case 'bar':
        return renderBarChart(report);
      case 'pie':
        return renderPieChart(report);
      case 'line':
        return renderLineChart(report);
      default:
        return <div className="text-center p-6 text-gray-500">Type de graphique non pris en charge</div>;
    }
  };

  // Render un graphique en barres
  const renderBarChart = (report: Report) => {
    // Cas spécial pour les prévisions de congés qui ont une structure différente
    if (report.title === 'Prévisions de congés') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={report.data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" name="Congés actuels" fill="#8884d8" />
            <Bar dataKey="forecast" name="Prévisions" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={report.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name={report.title === 'Absentéisme mensuel' ? 'Taux (%)' : 'Valeur'} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Render un graphique en camembert
  const renderPieChart = (report: Report) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={report.data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {report.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render un graphique en ligne
  const renderLineChart = (report: Report) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={report.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" name="Valeur" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Fonction pour exporter un rapport en PDF
  const exportReportToPDF = (report: Report) => {
    if (!report) return;

    const doc = new jsPDF();
    
    // Ajouter en-tête et logo
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 15, 50, 25, 'F');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("LOGO", 40, 30, { align: "center" });
    
    // Ajouter informations de l'entreprise
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("STORM GROUP", 140, 25, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123 Avenue des Affaires", 140, 32, { align: "center" });
    doc.text("75000 Paris, France", 140, 38, { align: "center" });
    doc.text("contact@enterprise-solutions.fr", 140, 44, { align: "center" });
    
    // Ajouter titre et description du rapport
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(report.title, 105, 70, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(report.description, 105, 85, { align: "center" });
    
    // Date du rapport
    doc.setFontSize(10);
    doc.text(`Rapport généré le ${new Date().toLocaleDateString('fr-FR')}`, 105, 95, { align: "center" });
    doc.text(`Dernière mise à jour: ${report.lastUpdated}`, 105, 102, { align: "center" });
    
    // Ajouter les données du rapport sous forme de tableau
    const tableData = report.data.map(item => {
      if (item.current !== undefined && item.forecast !== undefined) {
        return [item.name, item.current, item.forecast];
      }
      return [item.name, item.value];
    });
    
    const tableColumns = report.title === 'Prévisions de congés' 
      ? ['Département', 'Congés actuels', 'Prévisions']
      : ['Catégorie', 'Valeur'];
    
    doc.autoTable({
      startY: 115,
      head: [tableColumns],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [136, 132, 216], textColor: [255, 255, 255] },
      styles: { font: 'helvetica', fontSize: 10 }
    });
    
    // Ajouter pied de page
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text('STORM GROUP - Rapport confidentiel', 105, 285, { align: 'center' });
      doc.text(`Page ${i} sur ${pageCount}`, 195, 285, { align: 'right' });
    }

    // Télécharger le PDF
    doc.save(`rapport_${report.title.toLowerCase().replace(/ /g, '_')}.pdf`);
    
    toast.success("Rapport exporté avec succès", {
      description: `Le rapport "${report.title}" a été téléchargé au format PDF.`,
    });
  };

  // Fonction pour créer un nouveau rapport
  const handleCreateReport = () => {
    const newReport: Report = {
      id: `report-${reports.length + 1}`,
      title: newReportForm.title,
      description: newReportForm.description,
      category: newReportForm.category,
      chartType: newReportForm.chartType as 'bar' | 'pie' | 'line',
      data: [],
      status: 'scheduled' as 'ready' | 'updating' | 'scheduled',
      lastUpdated: new Date().toLocaleDateString('fr-FR'),
    };

    setReports([...reports, newReport]);
    setShowNewReportDialog(false);
    setNewReportForm({
      title: '',
      description: '',
      category: 'rh',
      chartType: 'bar',
      status: 'scheduled',
    });

    toast.success("Rapport créé avec succès", {
      description: `Le rapport "${newReportForm.title}" a été créé.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rapports RH</h1>
        <div className="flex space-x-2">
          <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouveau rapport
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un nouveau rapport</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Titre
                  </Label>
                  <Input
                    id="title"
                    value={newReportForm.title}
                    onChange={(e) => setNewReportForm({ ...newReportForm, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={newReportForm.description}
                    onChange={(e) => setNewReportForm({ ...newReportForm, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Catégorie
                  </Label>
                  <Select
                    value={newReportForm.category}
                    onValueChange={(value) => setNewReportForm({ ...newReportForm, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rh">Général RH</SelectItem>
                      <SelectItem value="absence">Absences</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="paie">Paie</SelectItem>
                      <SelectItem value="contrat">Contrats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="chartType" className="text-right">
                    Type de graphique
                  </Label>
                  <Select
                    value={newReportForm.chartType}
                    onValueChange={(value) => setNewReportForm({ ...newReportForm, chartType: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Diagramme à barres</SelectItem>
                      <SelectItem value="pie">Diagramme circulaire</SelectItem>
                      <SelectItem value="line">Courbe d'évolution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Statut
                  </Label>
                  <Select
                    value={newReportForm.status}
                    onValueChange={(value) => setNewReportForm({ ...newReportForm, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready">Prêt</SelectItem>
                      <SelectItem value="updating">En cours de mise à jour</SelectItem>
                      <SelectItem value="scheduled">Planifié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewReportDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateReport}>Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ReportFilters
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex overflow-x-auto space-x-2 pb-4">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
              className="whitespace-nowrap"
            >
              Tous
            </Button>
            <Button
              variant={activeTab === 'rh' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rh')}
              className="whitespace-nowrap"
            >
              Général RH
            </Button>
            <Button
              variant={activeTab === 'absence' ? 'default' : 'outline'}
              onClick={() => setActiveTab('absence')}
              className="whitespace-nowrap"
            >
              Absences
            </Button>
            <Button
              variant={activeTab === 'performance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('performance')}
              className="whitespace-nowrap"
            >
              Performance
            </Button>
            <Button
              variant={activeTab === 'formation' ? 'default' : 'outline'}
              onClick={() => setActiveTab('formation')}
              className="whitespace-nowrap"
            >
              Formation
            </Button>
            <Button
              variant={activeTab === 'paie' ? 'default' : 'outline'}
              onClick={() => setActiveTab('paie')}
              className="whitespace-nowrap"
            >
              Paie
            </Button>
            <Button
              variant={activeTab === 'contrat' ? 'default' : 'outline'}
              onClick={() => setActiveTab('contrat')}
              className="whitespace-nowrap"
            >
              Contrats
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenReport(report)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getReportIcon(report.chartType)}
                      <h3 className="font-medium">{report.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 my-2">{report.description}</p>
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                    <span>Dernière mise à jour: {report.lastUpdated}</span>
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      exportReportToPDF(report);
                    }}>
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour afficher le rapport complet */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {activeReport && getReportIcon(activeReport.chartType)}
              {activeReport?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-500 mb-6">{activeReport?.description}</p>
            {activeReport && renderChart(activeReport)}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => {
                if (activeReport) exportReportToPDF(activeReport);
              }}
            >
              <FileDown className="h-4 w-4" />
              Exporter PDF
            </Button>
            <Button onClick={() => setShowReportDialog(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesReports;
