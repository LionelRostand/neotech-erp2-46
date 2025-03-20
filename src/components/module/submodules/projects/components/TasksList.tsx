
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User, Clock } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Task } from '../types/project-types';
import { CreateTaskDialog } from './CreateTaskDialog';
import { EditTaskDialog } from './EditTaskDialog';

interface TasksListProps {
  tasks: Task[];
  isLoading: boolean;
  projectId: string;
}

export const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  isLoading,
  projectId 
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleCreateTask = () => {
    setShowCreateDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">À faire</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">En revue</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Tâches du projet</h3>
        <Button size="sm" onClick={handleCreateTask}>
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle tâche
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Chargement des tâches...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-6 border rounded-lg">
          <p className="text-gray-500">Aucune tâche pour ce projet</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter une tâche
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleEditTask(task)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{task.title}</div>
                <div className="flex gap-1">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
              
              {task.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{format(new Date(task.dueDate), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
                
                {task.assignedTo.length > 0 && (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    <span>{task.assignedTo.length} assigné{task.assignedTo.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                
                {task.estimatedHours && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{task.estimatedHours}h estimée{task.estimatedHours > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showCreateDialog && (
        <CreateTaskDialog 
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          projectId={projectId}
        />
      )}
      
      {showEditDialog && selectedTask && (
        <EditTaskDialog 
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          task={selectedTask}
        />
      )}
    </div>
  );
};
