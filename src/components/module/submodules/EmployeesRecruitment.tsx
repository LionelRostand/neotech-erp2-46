
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
  XCircle,
  FileExcel,
  FilePdf
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRecruitmentData } from '@/hooks/useRecruitmentData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RecruitmentForm, RecruitmentOffer } from './recruitment/RecruitmentForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const EmployeesRecruitment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ouverts');
  const { recruitmentPosts, stats, isLoading, error } = useRecruitmentData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [posts, setPosts] = useState(recruitmentPosts || []);
  const [filters, setFilters] = useState({
    department: '',
    priority: '',
    status: '',
  });

  const handleCreateOffer = (data: any) => {
    const newOffer = {
      id: `job-${Date.now()}`,
      position: data.position,
      department: data.department,
      openDate: data.openDate.toLocaleDateString('fr-FR'),
      applicationDeadline: data.applicationDeadline.toLocaleDateString('fr-FR'),
      hiringManagerName: data.hiringManagerName,
      hiringManagerId: data.hiringManagerId || 'user-1',
      status: data.status,
      priority: data.priority,
      location: data.location,
      contractType: data.contractType,
      salary: data.salary,
      description: data.description,
      requirements: data.requirements,
      applicationCount: 0,
    };
    
    setPosts([newOffer, ...posts]);
    setIsFormOpen(false);
    toast.success('Offre de recrutement créée avec succès');
  };

  const handleExportData = (format: 'pdf' | 'excel') => {
    const filteredPosts = posts.filter(post => {
      if (activeTab === 'ouverts' && post.status !== 'Ouvert') return false;
      if (activeTab === 'en-cours' && post.status !== 'En cours') return false;
      if (activeTab === 'clotures' && !['Clôturé', 'Abandonné'].includes(post.status)) return false;
      
      if (filters.department && post.department !== filters.department) return false;
      if (filters.priority && post.priority !== filters.priority) return false;
      if (filters.status && post.status !== filters.status) return false;
      
      return true;
    });
    
    if (format === 'pdf') {
      // Generate PDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Liste des offres de recrutement', 105, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Exporté le ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      const tableColumn = ["Poste", "Département", "Date d'ouverture", "Responsable", "Candidatures", "Priorité", "Statut"];
      const tableRows = filteredPosts.map(post => [
        post.position,
        post.department,
        post.openDate,
        post.hiringManagerName,
        post.applicationCount?.toString() || "0",
        post.priority,
        post.status
      ]);
      
      doc.autoTable({
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });
      
      doc.save('liste_offres_recrutement.pdf');
    } else {
      // Generate Excel
      const data = filteredPosts.map(post => ({
        'Poste': post.position,
        'Département': post.department,
        'Date d\'ouverture': post.openDate,
        'Date limite': post.applicationDeadline || 'Non spécifiée',
        'Responsable': post.hiringManagerName,
        'Candidatures': post.applicationCount || 0,
        'Lieu': post.location,
        'Type de contrat': post.contractType,
        'Salaire': post.salary,
        'Priorité': post.priority,
        'Statut': post.status
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Offres de recrutement");
      XLSX.writeFile(wb, "offres_recrutement.xlsx");
    }
    
    setIsExportDialogOpen(false);
    toast.success(`Données exportées au format ${format === 'pdf' ? 'PDF' : 'Excel'}`);
  };

  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
    toast.success('Filtres appliqués');
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

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'ouverts' && post.status !== 'Ouvert') return false;
    if (activeTab === 'en-cours' && post.status !== 'En cours') return false;
    if (activeTab === 'clotures' && !['Clôturé', 'Abandonné'].includes(post.status)) return false;
    
    if (filters.department && post.department !== filters.department) return false;
    if (filters.priority && post.priority !== filters.priority) return false;
    if (filters.status && post.status !== filters.status) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Recrutement</h2>
          <p className="text-gray-500">Gestion des offres d'emploi et candidatures</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsFormOpen(true)}
          >
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

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle offre</DialogTitle>
          </DialogHeader>
          <RecruitmentForm 
            onSubmit={handleCreateOffer} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les offres</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select
                value={filters.department}
                onValueChange={(value) => setFilters({...filters, department: value})}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les départements</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="RH">Ressources Humaines</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={filters.priority}
                onValueChange={(value) => setFilters({...filters, priority: value})}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les priorités</SelectItem>
                  <SelectItem value="Haute">Haute</SelectItem>
                  <SelectItem value="Moyenne">Moyenne</SelectItem>
                  <SelectItem value="Basse">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({...filters, status: value})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Clôturé">Clôturé</SelectItem>
                  <SelectItem value="Abandonné">Abandonné</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleApplyFilters}>
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter les données</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-500">Choisissez le format d'export</p>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                className="flex-1 flex-col h-auto py-4"
                onClick={() => handleExportData('pdf')}
              >
                <FilePdf className="h-8 w-8 mb-2" />
                <span>PDF</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 flex-col h-auto py-4"
                onClick={() => handleExportData('excel')}
              >
                <FileExcel className="h-8 w-8 mb-2" />
                <span>Excel</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesRecruitment;

// Import missing components
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
