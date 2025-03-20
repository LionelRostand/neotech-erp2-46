
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Search, Users, User, MoreHorizontal, Briefcase 
} from "lucide-react";
import { Team, TeamMember, Project } from './types/project-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { orderBy, where } from 'firebase/firestore';
import { CreateTeamDialog } from './components/CreateTeamDialog';
import { EditTeamDialog } from './components/EditTeamDialog';
import { TeamDetailsDialog } from './components/TeamDetailsDialog';

const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<{ [key: string]: Project }>({});
  
  const teamsCollection = useFirestore(COLLECTIONS.PROJECTS.TEAMS);
  const projectsCollection = useFirestore(COLLECTIONS.PROJECTS.PROJECTS);
  
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const data = await teamsCollection.getAll([orderBy('updatedAt', 'desc')]);
        
        const teamsData = data.map((doc: any) => ({
          id: doc.id,
          name: doc.name || '',
          description: doc.description || '',
          members: doc.members || [],
          projects: doc.projects || [],
          createdAt: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toISOString() : '',
          updatedAt: doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toISOString() : ''
        }));
        
        setTeams(teamsData);
        
        // Fetch all projects referenced in teams
        const projectIds = new Set<string>();
        teamsData.forEach(team => {
          team.projects.forEach(projectId => {
            projectIds.add(projectId);
          });
        });
        
        if (projectIds.size > 0) {
          const projectsData = await Promise.all(
            Array.from(projectIds).map(id => projectsCollection.getById(id))
          );
          
          const projectsMap: { [key: string]: Project } = {};
          projectsData.forEach(project => {
            if (project) {
              projectsMap[project.id] = project as Project;
            }
          });
          
          setProjects(projectsMap);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeams();
  }, []);
  
  // Apply search filter client-side
  const filteredTeams = teams.filter(team => {
    if (searchTerm) {
      return (
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.members.some(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return true;
  });
  
  const handleCreateTeam = () => {
    setShowCreateDialog(true);
  };
  
  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowEditDialog(true);
  };
  
  const handleViewTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsDialog(true);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Équipes</CardTitle>
            <CardDescription>Gestion des équipes de projet</CardDescription>
          </div>
          <Button onClick={handleCreateTeam}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle équipe
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une équipe..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des équipes...</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Aucune équipe trouvée</h3>
              <p className="mt-2 text-sm text-gray-500">
                Commencez par créer une nouvelle équipe ou ajustez votre recherche.
              </p>
              <Button className="mt-4" onClick={handleCreateTeam}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle équipe
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTeams.map(team => (
                <Card key={team.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {team.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewTeamDetails(team)}>
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditTeam(team)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 5).map(member => (
                          <Avatar key={member.id} className="border-2 border-white">
                            {member.avatar ? (
                              <AvatarImage src={member.avatar} alt={member.name} />
                            ) : (
                              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                            )}
                          </Avatar>
                        ))}
                        {team.members.length > 5 && (
                          <Avatar className="border-2 border-white">
                            <AvatarFallback>+{team.members.length - 5}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-800">
                        {team.members.length} membre{team.members.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {team.projects.length > 0 ? (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          Projets
                        </h4>
                        <div className="space-y-1">
                          {team.projects.slice(0, 3).map(projectId => (
                            <div key={projectId} className="text-sm py-1 px-2 rounded bg-gray-50">
                              {projects[projectId]?.name || 'Projet inconnu'}
                            </div>
                          ))}
                          {team.projects.length > 3 && (
                            <div className="text-xs text-gray-500 mt-1">
                              +{team.projects.length - 3} autre{team.projects.length - 3 > 1 ? 's' : ''} projet{team.projects.length - 3 > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 italic mt-4">
                        Aucun projet assigné
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {showCreateDialog && (
        <CreateTeamDialog 
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
      
      {showEditDialog && selectedTeam && (
        <EditTeamDialog 
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          team={selectedTeam}
        />
      )}
      
      {showDetailsDialog && selectedTeam && (
        <TeamDetailsDialog 
          isOpen={showDetailsDialog}
          onClose={() => setShowDetailsDialog(false)}
          team={selectedTeam}
          projects={selectedTeam.projects.map(id => projects[id]).filter(Boolean)}
        />
      )}
    </div>
  );
};

export default TeamsPage;
