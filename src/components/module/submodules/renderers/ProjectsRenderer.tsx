
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import ProjectDashboard from '../projects/ProjectDashboard';
import ProjectsList from '../projects/ProjectsList';
import TasksPage from '../projects/TasksPage';
import TeamsPage from '../projects/TeamsPage';
import ReportsPage from '../projects/ReportsPage';
import SettingsPage from '../projects/SettingsPage';
import { SubModule } from '@/data/types/modules';

export const renderProjectsSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'projects-list':
      return <ProjectsList />;
    case 'projects-dashboard':
      return <ProjectDashboard />;
    case 'projects-tasks':
      return <TasksPage />;
    case 'projects-teams':
      return <TeamsPage />;
    case 'projects-reports':
      return <ReportsPage />;
    case 'projects-settings':
      return <SettingsPage />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
