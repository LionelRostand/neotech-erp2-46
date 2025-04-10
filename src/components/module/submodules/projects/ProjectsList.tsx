
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash, Info, Calendar, DollarSign, User, Briefcase } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useFetchProjects } from './hooks/useFetchProjects';
import { Project, ProjectStatus } from './types/project-types';
import { toast } from 'sonner';

const ProjectsList: React.FC = () => {
  const { projects, isLoading, error, refreshProjects } = useFetchProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Filtering projects based on search query and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.client && project.client.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };
  
  // Status badge for visual representation
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Terminé</Badge>;
      case 'on-hold':
        return <Badge className="bg-amber-500">En pause</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Priority indicator
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-500">Haute</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-500">Basse</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Actions for project management
  const handleCreateProject = () => {
    setCreateDialogOpen(true);
  };
  
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setViewDialogOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };
  
  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };
  
  // Mock function for delete confirmation
  const confirmDelete = () => {
    if (selectedProject) {
      // Here would go the actual delete logic
      toast.success(`Projet "${selectedProject.name}" supprimé`);
      setDeleteDialogOpen(false);
      // After deletion, refresh the projects list
      refreshProjects();
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des projets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <p>Chargement des projets...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liste des projets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8 text-red-500">
            <p>Erreur: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projets</h2>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" /> Nouveau projet
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="completed">Terminé</option>
              <option value="on-hold">En pause</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Aucun projet trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(project.status as ProjectStatus)}</TableCell>
                      <TableCell>{getPriorityBadge(project.priority)}</TableCell>
                      <TableCell className="text-sm">
                        <div>Du: {formatDate(project.startDate)}</div>
                        {project.endDate && <div>Au: {formatDate(project.endDate)}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-center mt-1">{project.progress}%</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewProject(project)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProject(project)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* View Project Dialog */}
      {selectedProject && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedProject.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-[20px_1fr] items-start gap-4">
                <Briefcase className="h-5 w-5" />
                <div>{selectedProject.description}</div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-4">
                <User className="h-5 w-5" />
                <div>Client: {selectedProject.client || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-[20px_1fr] items-start gap-4">
                <Calendar className="h-5 w-5" />
                <div>
                  <div>Début: {formatDate(selectedProject.startDate)}</div>
                  <div>Fin: {selectedProject.endDate ? formatDate(selectedProject.endDate) : 'N/A'}</div>
                </div>
              </div>
              {selectedProject.budget && (
                <div className="grid grid-cols-[20px_1fr] items-start gap-4">
                  <DollarSign className="h-5 w-5" />
                  <div>Budget: {selectedProject.budget} €</div>
                </div>
              )}
              <div className="mt-2">
                <div className="mb-1">Progression: {selectedProject.progress}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <div>Statut: {getStatusBadge(selectedProject.status as ProjectStatus)}</div>
                <div>Priorité: {getPriorityBadge(selectedProject.priority)}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {selectedProject && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Êtes-vous sûr de vouloir supprimer le projet "{selectedProject.name}" ?</p>
              <p className="text-red-500 mt-2">Cette action est irréversible.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Create and Edit dialogs would be placed here, but are omitted for brevity */}
      {/* You would implement CreateProjectDialog and EditProjectDialog components */}
    </div>
  );
};

export default ProjectsList;
