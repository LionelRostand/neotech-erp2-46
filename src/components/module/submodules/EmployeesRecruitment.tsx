
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  FileText,
  File
} from 'lucide-react';
import { useRecruitmentData, RecruitmentPost } from '@/hooks/useRecruitmentData';
import { exportToExcel } from '@/utils/exportUtils';
import { exportToPdf } from '@/utils/pdfUtils';

const EmployeesRecruitment = () => {
  const { recruitmentPosts, stats, isLoading } = useRecruitmentData();
  const [filterOpen, setFilterOpen] = useState(false);
  const [newOfferOpen, setNewOfferOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    priority: '',
    location: ''
  });
  
  const [newOffer, setNewOffer] = useState<Partial<RecruitmentPost>>({
    position: '',
    department: '',
    description: '',
    requirements: '',
    contractType: 'CDI',
    location: 'Paris',
    salary: '',
    priority: 'Moyenne',
    status: 'Ouvert',
    openDate: new Date().toLocaleDateString('fr-FR'),
    hiringManagerId: 'user-1',
    hiringManagerName: 'Jean Dupont'
  });
  
  // Filter and search posts
  const filteredPosts = useMemo(() => {
    return recruitmentPosts.filter(post => {
      // Search filter
      if (searchQuery && !post.position.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !post.department.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Department filter
      if (filters.department && post.department !== filters.department) {
        return false;
      }
      
      // Status filter
      if (filters.status && post.status !== filters.status) {
        return false;
      }
      
      // Priority filter
      if (filters.priority && post.priority !== filters.priority) {
        return false;
      }
      
      // Location filter
      if (filters.location && post.location !== filters.location) {
        return false;
      }
      
      return true;
    });
  }, [recruitmentPosts, searchQuery, filters]);
  
  // Get unique values for filters
  const departments = useMemo(() => [...new Set(recruitmentPosts.map(p => p.department))], [recruitmentPosts]);
  const statuses = useMemo(() => [...new Set(recruitmentPosts.map(p => p.status))], [recruitmentPosts]);
  const priorities = useMemo(() => [...new Set(recruitmentPosts.map(p => p.priority))], [recruitmentPosts]);
  const locations = useMemo(() => [...new Set(recruitmentPosts.map(p => p.location))], [recruitmentPosts]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOffer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewOffer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateOffer = () => {
    // In a real app, this would call an API
    toast.success("Offre d'emploi créée avec succès");
    setNewOfferOpen(false);
  };
  
  const handleExport = (format: 'excel' | 'pdf') => {
    const dataToExport = filteredPosts.map(post => ({
      Position: post.position,
      Département: post.department,
      'Date d\'ouverture': post.openDate,
      'Date limite': post.applicationDeadline || 'Non spécifiée',
      'Responsable': post.hiringManagerName,
      Statut: post.status,
      Priorité: post.priority,
      Lieu: post.location,
      'Type de contrat': post.contractType,
      Salaire: post.salary,
      'Nb candidatures': post.applicationCount
    }));
    
    if (format === 'excel') {
      exportToExcel(dataToExport, 'Offres_emploi', 'offres_emploi');
    } else {
      exportToPdf(dataToExport, 'Offres d\'emploi', 'offres_emploi');
    }
    
    setExportOpen(false);
    toast.success(`Export en ${format === 'excel' ? 'Excel' : 'PDF'} réussi`);
  };
  
  const resetFilters = () => {
    setFilters({
      department: '',
      status: '',
      priority: '',
      location: ''
    });
    setFilterOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des offres d'emploi...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Offres ouvertes</h3>
              <p className="text-2xl font-bold text-blue-700">{stats.open}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-amber-900">En cours</h3>
              <p className="text-2xl font-bold text-amber-700">{stats.inProgress}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Clôturées</h3>
              <p className="text-2xl font-bold text-green-700">{stats.closed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-900">Candidatures</h3>
              <p className="text-2xl font-bold text-purple-700">{stats.totalApplications}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher une offre..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setNewOfferOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle offre
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">Liste des offres</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune offre d'emploi ne correspond à vos critères.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                        <div className="font-medium text-lg">{post.position}</div>
                        <Badge 
                          className={
                            post.status === 'Ouvert' ? 'bg-green-100 text-green-800' : 
                            post.status === 'En cours' ? 'bg-amber-100 text-amber-800' : 
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Département</p>
                            <p className="font-medium">{post.department}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Lieu</p>
                            <p className="font-medium">{post.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type de contrat</p>
                            <p className="font-medium">{post.contractType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date d'ouverture</p>
                            <p className="font-medium">{post.openDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date limite</p>
                            <p className="font-medium">{post.applicationDeadline || 'Non spécifiée'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Responsable</p>
                            <p className="font-medium">{post.hiringManagerName}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="mt-1 text-sm">{post.description}</p>
                        </div>
                        
                        {post.requirements && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">Prérequis</p>
                            <p className="mt-1 text-sm">{post.requirements}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div>
                            <Badge variant="outline" className="mr-2">{post.salary}</Badge>
                            <Badge 
                              variant="outline" 
                              className={
                                post.priority === 'Haute' ? 'border-red-500 text-red-500' : 
                                post.priority === 'Moyenne' ? 'border-amber-500 text-amber-500' : 
                                'border-green-500 text-green-500'
                              }
                            >
                              Priorité: {post.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.applicationCount} candidature{post.applicationCount > 1 ? 's' : ''}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="py-8 text-center text-gray-500">
                Module de statistiques de recrutement à venir.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtrer les offres</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="department-filter">Département</Label>
              <Select 
                value={filters.department} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger id="department-filter">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority-filter">Priorité</Label>
              <Select 
                value={filters.priority} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les priorités</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location-filter">Lieu</Label>
              <Select 
                value={filters.location} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="Tous les lieux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les lieux</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
            <Button onClick={() => setFilterOpen(false)}>Appliquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Offer Dialog */}
      <Dialog open={newOfferOpen} onOpenChange={setNewOfferOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouvelle offre d'emploi</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Intitulé du poste *</Label>
                <Input
                  id="position"
                  name="position"
                  value={newOffer.position}
                  onChange={handleInputChange}
                  placeholder="Ex: Développeur Full-Stack"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="department">Département *</Label>
                <Input
                  id="department"
                  name="department"
                  value={newOffer.department}
                  onChange={handleInputChange}
                  placeholder="Ex: IT"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description du poste *</Label>
              <Textarea
                id="description"
                name="description"
                value={newOffer.description}
                onChange={handleInputChange}
                placeholder="Détaillez les responsabilités et missions principales"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="requirements">Prérequis</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={newOffer.requirements}
                onChange={handleInputChange}
                placeholder="Expérience, diplômes, compétences requises..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contractType">Type de contrat</Label>
                <Select
                  value={newOffer.contractType}
                  onValueChange={(value) => handleSelectChange("contractType", value)}
                >
                  <SelectTrigger id="contractType">
                    <SelectValue placeholder="Type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Alternance">Alternance</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  name="location"
                  value={newOffer.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Paris"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="salary">Salaire</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={newOffer.salary}
                  onChange={handleInputChange}
                  placeholder="Ex: 45-55K€"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={newOffer.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Haute">Haute</SelectItem>
                    <SelectItem value="Moyenne">Moyenne</SelectItem>
                    <SelectItem value="Basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOfferOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateOffer}>Créer l'offre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Exporter les offres</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-500">
              Sélectionnez le format d'export pour {filteredPosts.length} offre(s) d'emploi.
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
    </div>
  );
};

export default EmployeesRecruitment;
