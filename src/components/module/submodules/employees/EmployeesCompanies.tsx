
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { File, FileText, Filter, Plus, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Company } from '../CompanyForm';
import CompanyForm from '../CompanyForm';

// Sample data for companies
const initialCompanies: Company[] = [
  {
    id: 'enterprise1',
    name: 'Enterprise Solutions',
    address: '15 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    phone: '+33 1 23 45 67 89',
    email: 'contact@enterprise-solutions.fr',
    website: 'https://enterprise-solutions.fr',
    contactPerson: 'Jean Dupont',
    sector: 'Technologies',
    size: 'medium',
    status: 'active',
    description: 'Entreprise spécialisée dans les solutions informatiques pour PME',
    createdAt: '2022-05-15'
  },
  {
    id: 'techinno',
    name: 'TechInnovation',
    address: '5 Quai des Bergues',
    city: 'Lyon',
    postalCode: '69002',
    country: 'France',
    phone: '+33 4 56 78 90 12',
    email: 'info@techinnovation.fr',
    website: 'https://techinnovation.fr',
    contactPerson: 'Marie Legrand',
    sector: 'Recherche et Développement',
    size: 'large',
    status: 'active',
    description: 'Leader en innovation technologique et recherche appliquée',
    createdAt: '2021-03-10'
  },
  {
    id: 'greenco',
    name: 'GreenCo',
    address: '27 Boulevard de la Liberté',
    city: 'Toulouse',
    postalCode: '31000',
    country: 'France',
    phone: '+33 5 67 89 01 23',
    email: 'contact@greenco.fr',
    website: 'https://greenco.fr',
    contactPerson: 'Lucas Martin',
    sector: 'Développement Durable',
    size: 'small',
    status: 'active',
    description: 'Solutions écologiques pour entreprises responsables',
    createdAt: '2023-01-22'
  }
];

const EmployeesCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [editingCompany, setEditingCompany] = useState<Company | undefined>(undefined);

  // Filters state
  const [filters, setFilters] = useState({
    size: 'all',
    country: 'all',
    createdFrom: '',
    createdTo: ''
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyAdvancedFilters = () => {
    setIsFilterDialogOpen(false);
    // Apply the filters logic would go here
  };

  // Get unique sectors for filter
  const sectors = React.useMemo(() => {
    const sectorSet = new Set<string>();
    companies.forEach(company => {
      if (company.sector) sectorSet.add(company.sector);
    });
    return Array.from(sectorSet);
  }, [companies]);

  // Filtered companies based on search and filters
  const filteredCompanies = React.useMemo(() => {
    return companies.filter(company => {
      // Search term filter
      const matchesSearch = searchTerm === "" || 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.contactPerson && company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === "all" || company.status === statusFilter;
      
      // Sector filter
      const matchesSector = sectorFilter === "all" || company.sector === sectorFilter;
      
      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [companies, searchTerm, statusFilter, sectorFilter]);

  const handleAddCompany = (companyData: Partial<Company>) => {
    const newCompany: Company = {
      ...companyData,
      id: `company-${Date.now()}`, // Generate a simple unique ID
      createdAt: new Date().toISOString().split('T')[0],
    } as Company;
    
    setCompanies([...companies, newCompany]);
    setIsCompanyFormOpen(false);
  };

  const handleEditCompany = (companyData: Partial<Company>) => {
    if (!editingCompany) return;
    
    const updatedCompanies = companies.map(company => 
      company.id === editingCompany.id 
        ? { ...company, ...companyData } 
        : company
    );
    
    setCompanies(updatedCompanies);
    setEditingCompany(undefined);
  };

  const handleExport = () => {
    // Handle export logic here
    console.log(`Exporting companies in ${exportFormat} format`);
    setIsExportDialogOpen(false);
  };

  const openEditForm = (company: Company) => {
    setEditingCompany(company);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Entreprises</CardTitle>
            <CardDescription>Gérez les entreprises partenaires</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres avancés
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtres avancés</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Taille d'entreprise</Label>
                      <Select 
                        value={filters.size} 
                        onValueChange={(value) => handleFilterChange('size', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les tailles</SelectItem>
                          <SelectItem value="micro">Micro (1-9 employés)</SelectItem>
                          <SelectItem value="small">Petite (10-49 employés)</SelectItem>
                          <SelectItem value="medium">Moyenne (50-249 employés)</SelectItem>
                          <SelectItem value="large">Grande (250+ employés)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pays</Label>
                    <Select 
                      value={filters.country} 
                      onValueChange={(value) => handleFilterChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les pays</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Belgique">Belgique</SelectItem>
                        <SelectItem value="Suisse">Suisse</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de création (depuis)</Label>
                      <Input 
                        type="date" 
                        value={filters.createdFrom}
                        onChange={(e) => handleFilterChange('createdFrom', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de création (jusqu'à)</Label>
                      <Input 
                        type="date" 
                        value={filters.createdTo}
                        onChange={(e) => handleFilterChange('createdTo', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>Annuler</Button>
                  <Button onClick={applyAdvancedFilters}>Appliquer les filtres</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Exporter les entreprises</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-2">
                    <Label>Format d'export</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleExport}>Exporter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button onClick={() => setIsCompanyFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle entreprise
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="flex flex-1 items-center border rounded-md px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                placeholder="Rechercher une entreprise..." 
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                defaultValue="all"
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                defaultValue="all"
                onValueChange={setSectorFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">Aucune entreprise trouvée</TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow 
                      key={company.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openEditForm(company)}
                    >
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.city}</TableCell>
                      <TableCell>{company.contactPerson || 'Non spécifié'}</TableCell>
                      <TableCell>{company.sector || 'Non spécifié'}</TableCell>
                      <TableCell>
                        {company.size === 'micro' && 'Micro'}
                        {company.size === 'small' && 'Petite'}
                        {company.size === 'medium' && 'Moyenne'}
                        {company.size === 'large' && 'Grande'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.status === 'active' ? 'success' : 'secondary'}>
                          {company.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>{company.createdAt}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Company Form */}
      <CompanyForm 
        isOpen={isCompanyFormOpen}
        onClose={() => setIsCompanyFormOpen(false)}
        onSave={handleAddCompany}
      />
      
      {/* Edit Company Form */}
      {editingCompany && (
        <CompanyForm 
          isOpen={!!editingCompany}
          onClose={() => setEditingCompany(undefined)}
          onSave={handleEditCompany}
          company={editingCompany}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EmployeesCompanies;
