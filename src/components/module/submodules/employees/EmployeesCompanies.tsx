
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Filter, Download, Plus, Building, User, File, FileText } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Company, useCompaniesData } from '@/hooks/useCompaniesData';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';

const EmployeesCompanies = () => {
  const { companies, stats, isLoading } = useCompaniesData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [newCompanyDialogOpen, setNewCompanyDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    industry: '',
    size: '',
  });

  // New company form state
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '',
    address: '',
    city: '',
    country: 'France',
    industry: '',
    size: 'PME',
    email: '',
    phone: '',
    website: '',
    status: 'Actif'
  });

  // Get unique values for filters
  const industries = useMemo(() => 
    [...new Set(companies.map(c => c.industry).filter(Boolean))], 
    [companies]
  );
  
  const sizes = useMemo(() => 
    [...new Set(companies.map(c => c.size).filter(Boolean))], 
    [companies]
  );

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search filter
      if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status && company.status !== filters.status) {
        return false;
      }
      
      // Industry filter
      if (filters.industry && company.industry !== filters.industry) {
        return false;
      }
      
      // Size filter
      if (filters.size && company.size !== filters.size) {
        return false;
      }
      
      return true;
    });
  }, [companies, searchQuery, filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCompany = () => {
    // In a real app, this would save to the backend
    toast.success(`Entreprise ${newCompany.name} créée avec succès`);
    setNewCompanyDialogOpen(false);
    // Reset form
    setNewCompany({
      name: '',
      address: '',
      city: '',
      country: 'France',
      industry: '',
      size: 'PME',
      email: '',
      phone: '',
      website: '',
      status: 'Actif'
    });
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    const dataToExport = filteredCompanies.map(company => ({
      Nom: company.name,
      Adresse: company.address,
      Ville: company.city,
      Pays: company.country,
      Téléphone: company.phone,
      Email: company.email,
      Site: company.website,
      Industrie: company.industry,
      Taille: company.size,
      Statut: company.status,
      'Nombre d\'employés': company.employeesCount
    }));
    
    if (format === 'excel') {
      exportToExcel(dataToExport, 'Entreprises', 'entreprises');
      toast.success('Les données ont été exportées en Excel avec succès');
    } else {
      exportToPdf(dataToExport, 'Liste des entreprises', 'entreprises');
      toast.success('Les données ont été exportées en PDF avec succès');
    }
    
    setExportDialogOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      industry: '',
      size: '',
    });
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Entreprises actives</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.active}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Building className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">Entreprises inactives</h3>
              <p className="text-2xl font-bold text-amber-700">{stats.inactive}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Building className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Total entreprises</h3>
              <p className="text-2xl font-bold text-green-700">{stats.total}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Building className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-900">Total employés</h3>
              <p className="text-2xl font-bold text-purple-700">{stats.totalEmployees}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <User className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher une entreprise..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setNewCompanyDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle entreprise
          </Button>
        </div>
      </div>

      {/* Companies Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Entreprise</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Industrie</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Employés</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucune entreprise trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            {company.logo ? (
                              <AvatarImage src={company.logo} alt={company.name} />
                            ) : (
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {company.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            {company.website && (
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                {company.website.replace(/^https?:\/\//i, '')}
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.city && company.country ? `${company.city}, ${company.country}` : company.city || company.country || '-'}
                      </TableCell>
                      <TableCell>{company.industry || '-'}</TableCell>
                      <TableCell>{company.size || '-'}</TableCell>
                      <TableCell>{company.employeesCount || 0}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            company.status === 'Actif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtrer les entreprises</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status-filter">Statut</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="industry-filter">Industrie</Label>
              <Select 
                value={filters.industry} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, industry: value }))}
              >
                <SelectTrigger id="industry-filter">
                  <SelectValue placeholder="Toutes les industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="size-filter">Taille</Label>
              <Select 
                value={filters.size} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, size: value }))}
              >
                <SelectTrigger id="size-filter">
                  <SelectValue placeholder="Toutes les tailles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les tailles</SelectItem>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
            <Button onClick={() => setShowFilters(false)}>Appliquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Exporter les entreprises</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-500">
              Sélectionnez le format d'export pour {filteredCompanies.length} entreprise(s).
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col"
                onClick={() => handleExport('excel')}
              >
                <File className="h-8 w-8 mb-2" />
                Format Excel
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col"
                onClick={() => handleExport('pdf')}
              >
                <FileText className="h-8 w-8 mb-2" />
                Format PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Company Dialog */}
      <Dialog open={newCompanyDialogOpen} onOpenChange={setNewCompanyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouvelle entreprise</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de l'entreprise *</Label>
              <Input
                id="name"
                name="name"
                value={newCompany.name}
                onChange={handleInputChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={newCompany.address}
                onChange={handleInputChange}
                placeholder="Adresse"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  value={newCompany.city}
                  onChange={handleInputChange}
                  placeholder="Ville"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  name="country"
                  value={newCompany.country}
                  onChange={handleInputChange}
                  placeholder="Pays"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newCompany.phone}
                  onChange={handleInputChange}
                  placeholder="Téléphone"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={newCompany.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="website"
                value={newCompany.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="industry">Industrie</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={newCompany.industry}
                  onChange={handleInputChange}
                  placeholder="Ex: Technologies, Santé..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="size">Taille</Label>
                <Select
                  value={newCompany.size}
                  onValueChange={(value) => handleSelectChange("size", value)}
                >
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Taille de l'entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TPE">TPE</SelectItem>
                    <SelectItem value="PME">PME</SelectItem>
                    <SelectItem value="ETI">ETI</SelectItem>
                    <SelectItem value="GE">Grande Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={newCompany.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCompanyDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateCompany}>Créer l'entreprise</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesCompanies;
