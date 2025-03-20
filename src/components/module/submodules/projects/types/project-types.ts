
import { Timestamp } from "firebase/firestore";

export type ProjectStatus = 'active' | 'on-hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget?: number;
  client?: string;
  progress: number;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: ProjectPriority;
  assignedTo: string[];
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  attachments?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  read: boolean;
  type: 'task_assigned' | 'task_due' | 'comment' | 'project_update' | 'team_update';
  linkTo?: string;
  createdAt: string;
}

export interface ProjectSettings {
  id: string;
  workflows: WorkflowAutomation[];
  integrations: Integration[];
  userRoles: UserRole[];
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  enabled: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'jira' | 'trello' | 'slack' | 'github' | 'custom';
  config: Record<string, any>;
  enabled: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget?: number;
  client?: string;
  teamId?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: ProjectPriority;
  assignedTo: string[];
  dueDate: string;
  estimatedHours?: number;
  projectId: string;
}

export interface TeamFormData {
  name: string;
  description: string;
  members: TeamMember[];
}

export interface ProjectStats {
  activeProjects: number;
  completedProjects: number;
  overdueTasks: number;
  upcomingDeadlines: number;
  teamWorkload: Record<string, number>;
  projectProgress: Record<string, number>;
}
