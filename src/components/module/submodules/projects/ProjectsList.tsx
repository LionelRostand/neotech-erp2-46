
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Search, Filter, ArrowDownUp, MoreHorizontal, Calendar, Users, 
  Clock, Briefcase, CheckCircle, AlertCircle, Ban
} from "lucide-react";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useFetchProjects } from './hooks/useFetchProjects';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Project, ProjectStatus, ProjectPriority } from './types/project-types';
import { CreateProjectDialog } from './components/CreateProjectDialog';
import { EditProjectDialog } from './components/EditProjectDialog';
import { ProjectDetailsDialog } from './components/ProjectDetailsDialog';

const ProjectsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all');
  const [filters, setFilters] = useState<any>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { projects, isLoading } = useFetchProjects(filters);
  
  // Apply client-side filters for search
  const filteredProjects = projects.filter(project => {
    // Apply search term filter
    if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Update server-side filters
  useEffect(() => {
    const newFilters: any = {};
    
    if (statusFilter !== 'all') {
      newFilters.status = statusFilter;
    }
    
    if (priorityFilter !== 'all') {
      newFilters.priority = priorityFilter;
    }
    
    setFilters(newFilters);
  }, [statusFilter, priorityFilter]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as ProjectStatus | 'all');
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value as ProjectPriority | 'all');
  };

  const handleProjectCreated = () => {
    setShowCreateDialog(false);
    // Refresh projects list would happen automatically via useEffect
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditDialog(true);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Actif</Badge>;
      case 'on-hold':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En pause</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPriorityBadge = (priority: ProjectPriority) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Haute</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Basse</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Projets</CardTitle>
            <CardDescription>Liste et gestion des projets</CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau projet
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un projet..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="on-hold">En pause</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
                  <SelectItem value="cancelled">Annulés</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priorityFilter} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des projets...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Aucun projet trouvé</h3>
              <p className="mt-2 text-sm text-gray-500">
                Commencez par créer un nouveau projet ou ajustez vos filtres.
              </p>
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium" onClick={() => handleViewDetails(project)} style={{cursor: 'pointer'}}>
                        {project.name}
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{getPriorityBadge(project.priority)}</TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress 
                            value={project.progress} 
                            className="h-2" 
                          />
                          <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {project.endDate ? format(new Date(project.endDate), 'dd MMM yyyy', { locale: fr }) : '—'}
                      </TableCell>
                      <TableCell>{project.client || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(project)}>
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create Project Dialog */}
      {showCreateDialog && (
        <CreateProjectDialog 
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreated={handleProjectCreated}
        />
      )}
      
      {/* Edit Project Dialog */}
      {showEditDialog && selectedProject && (
        <EditProjectDialog 
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          project={selectedProject}
        />
      )}
      
      {/* Project Details Dialog */}
      {showDetailsDialog && selectedProject && (
        <ProjectDetailsDialog 
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default ProjectsList;
