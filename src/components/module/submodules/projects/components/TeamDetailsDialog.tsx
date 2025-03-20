
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, User, Briefcase, Mail, 
  Phone, Activity, FileText 
} from "lucide-react";
import { Team, TeamMember, Project } from '../types/project-types';

interface TeamDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  projects: Project[];
}

export const TeamDetailsDialog: React.FC<TeamDetailsDialogProps> = ({ 
  isOpen, 
  onClose,
  team,
  projects
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            {team.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Team details */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-4">Détails de l'équipe</h3>
            
            {team.description && (
              <p className="text-sm whitespace-pre-line text-gray-600 mb-4">{team.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-800">
                {team.members.length} membre{team.members.length > 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-800">
                {projects.length} projet{projects.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          
          {/* Tabs for Members and Projects */}
          <Tabs defaultValue="members">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="members" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Membres</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>Projets</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="mt-4">
              {team.members.length === 0 ? (
                <div className="text-center py-6 border rounded-lg">
                  <User className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Aucun membre dans cette équipe</p>
                  <p className="text-sm text-gray-400 mt-1">Les membres peuvent être ajoutés lors de la modification de l'équipe</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {team.members.map(member => (
                    <div key={member.id} className="flex items-start p-3 border rounded-lg gap-3">
                      <Avatar className="h-10 w-10">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        ) : (
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="projects" className="mt-4">
              {projects.length === 0 ? (
                <div className="text-center py-6 border rounded-lg">
                  <Briefcase className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Aucun projet assigné à cette équipe</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map(project => (
                    <div key={project.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant={
                          project.status === 'active' ? 'default' :
                          project.status === 'completed' ? 'outline' :
                          'secondary'
                        }>
                          {project.status === 'active' ? 'Actif' :
                           project.status === 'completed' ? 'Terminé' :
                           project.status === 'on-hold' ? 'En pause' : 'Annulé'}
                        </Badge>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          Progression: {project.progress}%
                        </div>
                        {project.client && (
                          <div className="text-xs text-gray-500">
                            Client: {project.client}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
