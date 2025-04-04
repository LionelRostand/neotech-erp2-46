
import React, { useState, useMemo } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { File, FileText, Filter, Plus, Search } from 'lucide-react';
import { useRecruitmentData, RecruitmentPost } from '@/hooks/useRecruitmentData';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import RecruitmentStats from './employees/RecruitmentStats';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const EmployeesRecruitment: React.FC = () => {
  const { recruitmentPosts, stats, isLoading } = useRecruitmentData();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  // Form state for new job
  const [newJob, setNewJob] = useState({
    position: '',
    department: '',
    location: '',
    contractType: 'CDI',
    salary: '',
    description: '',
    requirements: '',
    priority: 'Normale'
  });

  // Filter state
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    hiringManager: 'all',
    priority: 'all',
    location: 'all',
    contractType: 'all'
  });

  const filteredPosts = useMemo(() => {
    return recruitmentPosts.filter(post => {
      // Search term filter
      const matchesSearch = searchTerm === "" || 
        post.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      
      // Department filter
      const matchesDepartment = departmentFilter === "all" || post.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [recruitmentPosts, searchTerm, statusFilter, departmentFilter]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = new Set<string>();
    recruitmentPosts.forEach(post => depts.add(post.department));
    return Array.from(depts);
  }, [recruitmentPosts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyAdvancedFilters = () => {
    // This would apply the filters from the filter dialog
    // For now we just close the dialog
    setIsFilterDialogOpen(false);
  };

  const handleSubmitNewJob = () => {
    // Here we would submit the new job post
    console.log("New job submitted:", newJob);
    setIsJobFormOpen(false);
    
    // Reset form
    setNewJob({
      position: '',
      department: '',
      location: '',
      contractType: 'CDI',
      salary: '',
      description: '',
      requirements: '',
      priority: 'Normale'
    });
  };

  const handleExport = () => {
    // Here we would handle exporting the data
    console.log("Exporting in format:", exportFormat);
    setIsExportDialogOpen(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Haute':
        return <Badge variant="destructive">{priority}</Badge>;
      case 'Moyenne':
        return <Badge variant="warning">{priority}</Badge>;
      case 'Basse':
        return <Badge variant="outline">{priority}</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ouvert':
        return <Badge variant="success">{status}</Badge>;
      case 'En cours':
        return <Badge variant="default">{status}</Badge>;
      case 'Clôturé':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <RecruitmentStats stats={stats} />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Offres d'emploi</CardTitle>
            <CardDescription>Gérez vos offres d'emploi et suivez les candidatures</CardDescription>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date de début</Label>
                      <Input 
                        type="date" 
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date de fin</Label>
                      <Input 
                        type="date" 
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Responsable du recrutement</Label>
                    <Select 
                      value={filters.hiringManager} 
                      onValueChange={(value) => handleFilterChange('hiringManager', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="user-2">Marie Dubois</SelectItem>
                        <SelectItem value="user-3">Pierre Martin</SelectItem>
                        <SelectItem value="user-4">Sophie Bernard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priorité</Label>
                    <Select 
                      value={filters.priority} 
                      onValueChange={(value) => handleFilterChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="Haute">Haute</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Basse">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Lieu</Label>
                    <Select 
                      value={filters.location} 
                      onValueChange={(value) => handleFilterChange('location', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="Paris">Paris</SelectItem>
                        <SelectItem value="Lyon">Lyon</SelectItem>
                        <SelectItem value="Toulouse">Toulouse</SelectItem>
                        <SelectItem value="Bordeaux">Bordeaux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type de contrat</Label>
                    <Select 
                      value={filters.contractType} 
                      onValueChange={(value) => handleFilterChange('contractType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="CDI">CDI</SelectItem>
                        <SelectItem value="CDD">CDD</SelectItem>
                        <SelectItem value="Interim">Interim</SelectItem>
                        <SelectItem value="Stage">Stage</SelectItem>
                        <SelectItem value="Alternance">Alternance</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <DialogTitle>Exporter les données</DialogTitle>
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
            
            <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle offre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle offre d'emploi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Intitulé du poste</Label>
                      <Input 
                        id="position" 
                        name="position" 
                        value={newJob.position}
                        onChange={handleInputChange}
                        placeholder="Développeur Full-Stack"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Input 
                        id="department" 
                        name="department" 
                        value={newJob.department}
                        onChange={handleInputChange}
                        placeholder="IT"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Lieu</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        value={newJob.location}
                        onChange={handleInputChange}
                        placeholder="Paris"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractType">Type de contrat</Label>
                      <Select 
                        value={newJob.contractType} 
                        onValueChange={(value) => handleSelectChange('contractType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Rémunération</Label>
                      <Input 
                        id="salary" 
                        name="salary" 
                        value={newJob.salary}
                        onChange={handleInputChange}
                        placeholder="45-55K€"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <Select 
                        value={newJob.priority} 
                        onValueChange={(value) => handleSelectChange('priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Haute">Haute</SelectItem>
                          <SelectItem value="Moyenne">Moyenne</SelectItem>
                          <SelectItem value="Normale">Normale</SelectItem>
                          <SelectItem value="Basse">Basse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description du poste</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={newJob.description}
                      onChange={handleInputChange}
                      placeholder="Description détaillée du poste..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Prérequis</Label>
                    <Textarea 
                      id="requirements" 
                      name="requirements" 
                      value={newJob.requirements}
                      onChange={handleInputChange}
                      placeholder="Compétences et qualifications requises..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsJobFormOpen(false)}>Annuler</Button>
                  <Button onClick={handleSubmitNewJob}>Créer l'offre</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="flex flex-1 items-center border rounded-md px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <Input 
                placeholder="Rechercher une offre..." 
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
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Clôturé">Clôturé</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                defaultValue="all"
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poste</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Candidatures</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Date d'ouverture</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">Chargement des données...</TableCell>
                  </TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">Aucune offre trouvée</TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post: RecruitmentPost) => (
                    <TableRow key={post.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{post.position}</TableCell>
                      <TableCell>{post.department}</TableCell>
                      <TableCell>{getStatusBadge(post.status)}</TableCell>
                      <TableCell>{getPriorityBadge(post.priority)}</TableCell>
                      <TableCell>{post.applicationCount}</TableCell>
                      <TableCell>{post.location}</TableCell>
                      <TableCell>{post.openDate}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesRecruitment;
