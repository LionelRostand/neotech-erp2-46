
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Download, FileExcel, FilePdf, Filter, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CompanyForm } from './CompanyForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface Company {
  id: string;
  name: string;
  siret: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  sector: string;
  employeeCount: number;
  status: 'active' | 'inactive' | 'prospect';
  createdAt: Date;
}

const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'TechInnovation',
    siret: '123 456 789 00012',
    address: {
      street: '15 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    contactName: 'Jean Martin',
    contactEmail: 'jean.martin@techinnovation.fr',
    contactPhone: '01 23 45 67 89',
    sector: 'IT',
    employeeCount: 87,
    status: 'active',
    createdAt: new Date('2022-01-15'),
  },
  {
    id: 'comp-2',
    name: 'Green Solutions',
    siret: '987 654 321 00098',
    address: {
      street: '42 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
    },
    contactName: 'Marie Durand',
    contactEmail: 'mdurand@greensolutions.fr',
    contactPhone: '01 98 76 54 32',
    sector: 'Environnement',
    employeeCount: 34,
    status: 'active',
    createdAt: new Date('2022-05-03'),
  },
  {
    id: 'comp-3',
    name: 'Construct Plus',
    siret: '456 789 123 00045',
    address: {
      street: '8 Rue du Commerce',
      city: 'Lyon',
      postalCode: '69002',
      country: 'France',
    },
    contactName: 'Pierre Lefebvre',
    contactEmail: 'p.lefebvre@constructplus.fr',
    contactPhone: '04 56 78 91 23',
    sector: 'Construction',
    employeeCount: 156,
    status: 'active',
    createdAt: new Date('2021-11-20'),
  },
  {
    id: 'comp-4',
    name: 'Media Vision',
    siret: '789 123 456 00078',
    address: {
      street: '25 Rue de la République',
      city: 'Marseille',
      postalCode: '13001',
      country: 'France',
    },
    contactName: 'Sophie Bernard',
    contactEmail: 'sbernard@mediavision.fr',
    contactPhone: '04 91 23 45 67',
    sector: 'Médias',
    employeeCount: 42,
    status: 'inactive',
    createdAt: new Date('2022-09-15'),
  },
];

const EmployeesCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    sector: '',
    status: '',
    minEmployees: '',
  });
  const [activeTab, setActiveTab] = useState('all');

  const handleCreateCompany = (newCompany: Omit<Company, 'id' | 'createdAt'>) => {
    const companyWithId = {
      ...newCompany,
      id: `comp-${companies.length + 1}`,
      createdAt: new Date(),
    } as Company;
    
    setCompanies([...companies, companyWithId]);
    setIsCompanyFormOpen(false);
    toast.success('Entreprise ajoutée avec succès');
  };

  const handleApplyFilters = () => {
    setIsFilterDialogOpen(false);
    toast.success('Filtres appliqués');
  };

  const handleExportData = (format: 'pdf' | 'excel') => {
    const filteredCompanies = companies.filter(company => {
      if (activeTab === 'active' && company.status !== 'active') return false;
      if (activeTab === 'inactive' && company.status !== 'inactive') return false;
      return true;
    });
    
    if (format === 'pdf') {
      // Generate PDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Liste des entreprises', 105, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Exporté le ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add filter info if applicable
      if (filters.sector || filters.status || filters.minEmployees) {
        doc.text('Filtres appliqués:', 20, 40);
        let yPos = 45;
        
        if (filters.sector) {
          doc.text(`Secteur: ${filters.sector}`, 20, yPos);
          yPos += 5;
        }
        
        if (filters.status) {
          doc.text(`Statut: ${filters.status}`, 20, yPos);
          yPos += 5;
        }
        
        if (filters.minEmployees) {
          doc.text(`Nombre minimum d'employés: ${filters.minEmployees}`, 20, yPos);
          yPos += 5;
        }
      }
      
      const tableColumn = ["Nom", "Siret", "Contact", "Secteur", "Employés", "Statut"];
      const tableRows = filteredCompanies.map(company => [
        company.name,
        company.siret,
        `${company.contactName} - ${company.contactEmail}`,
        company.sector,
        company.employeeCount.toString(),
        company.status === 'active' ? 'Actif' : 'Inactif'
      ]);
      
      doc.autoTable({
        startY: filters.sector || filters.status || filters.minEmployees ? 55 : 40,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });
      
      doc.save('liste_entreprises.pdf');
    } else {
      // Generate Excel
      const data = filteredCompanies.map(company => ({
        'Nom': company.name,
        'SIRET': company.siret,
        'Adresse': `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`,
        'Contact': company.contactName,
        'Email': company.contactEmail,
        'Téléphone': company.contactPhone,
        'Secteur': company.sector,
        'Nombre Employés': company.employeeCount,
        'Statut': company.status === 'active' ? 'Actif' : 'Inactif',
        'Date de création': company.createdAt.toLocaleDateString()
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Entreprises");
      XLSX.writeFile(wb, "liste_entreprises.xlsx");
    }
    
    setIsExportDialogOpen(false);
    toast.success(`Données exportées au format ${format === 'pdf' ? 'PDF' : 'Excel'}`);
  };

  const filteredCompanies = companies.filter(company => {
    if (activeTab === 'active' && company.status !== 'active') return false;
    if (activeTab === 'inactive' && company.status !== 'inactive') return false;
    
    if (filters.sector && company.sector !== filters.sector) return false;
    if (filters.status && company.status !== filters.status) return false;
    if (filters.minEmployees && company.employeeCount < parseInt(filters.minEmployees)) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Entreprises</h2>
          <p className="text-gray-500">Gestion des entreprises partenaires</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
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
            onClick={() => setIsCompanyFormOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entreprise
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total entreprises</h3>
              <p className="text-2xl font-bold">{companies.length}</p>
            </div>
            <Building className="h-8 w-8 text-gray-400" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Actives</h3>
              <p className="text-2xl font-bold text-green-700">{companies.filter(c => c.status === 'active').length}</p>
            </div>
            <Building className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">Inactives</h3>
              <p className="text-2xl font-bold text-amber-700">{companies.filter(c => c.status === 'inactive').length}</p>
            </div>
            <Building className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Employés total</h3>
              <p className="text-2xl font-bold text-blue-700">{companies.reduce((acc, curr) => acc + curr.employeeCount, 0)}</p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="inactive">Inactives</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Entreprise</TableHead>
                      <TableHead>SIRET</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Secteur</TableHead>
                      <TableHead>Employés</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.siret}</TableCell>
                          <TableCell>
                            <div>
                              <div>{company.contactName}</div>
                              <div className="text-xs text-gray-500">{company.contactEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>{company.sector}</TableCell>
                          <TableCell>{company.employeeCount}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                company.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }
                            >
                              {company.status === 'active' ? 'Actif' : 'Inactif'}
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
      </Tabs>

      {/* Company Form Dialog */}
      <Dialog open={isCompanyFormOpen} onOpenChange={setIsCompanyFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter une entreprise</DialogTitle>
          </DialogHeader>
          <CompanyForm onSubmit={handleCreateCompany} onCancel={() => setIsCompanyFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtrer les entreprises</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Secteur</Label>
              <Select
                value={filters.sector}
                onValueChange={(value) => setFilters({...filters, sector: value})}
              >
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les secteurs</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Environnement">Environnement</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Médias">Médias</SelectItem>
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
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minEmployees">Nombre minimum d'employés</Label>
              <Input
                id="minEmployees"
                type="number"
                value={filters.minEmployees}
                onChange={(e) => setFilters({...filters, minEmployees: e.target.value})}
              />
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

export default EmployeesCompanies;
