
import React from 'react';
import ModuleCard from './ModuleCard';
import { AppModule } from '@/data/types/modules';

interface ModuleListProps {
  modules: AppModule[];
  installedModules: number[];
  expandedModule: number | null;
  configCompletedModules?: number[];
  onInstall: (moduleId: number) => void;
  onUninstall: (moduleId: number) => void;
  onToggleExpansion: (moduleId: number) => void;
  onToggleConfigCompleted?: (moduleId: number, completed: boolean) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  installedModules,
  expandedModule,
  configCompletedModules = [],
  onInstall,
  onUninstall,
  onToggleExpansion,
  onToggleConfigCompleted
}) => {
  // Split modules into two equal columns
  const splitModules = () => {
    if (modules.length === 0) {
      return [[], []];
    }
    
    const midpoint = Math.ceil(modules.length / 2);
    return [
      modules.slice(0, midpoint),
      modules.slice(midpoint)
    ];
  };
  
  const [leftColumnModules, rightColumnModules] = splitModules();
  
  console.log('ModuleList received modules:', modules.length);
  console.log('Left column:', leftColumnModules.length);
  console.log('Right column:', rightColumnModules.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-4">
        {leftColumnModules.map(module => {
          // Add configCompleted property to module
          const enhancedModule = {
            ...module,
            configCompleted: configCompletedModules.includes(module.id)
          };
          
          return (
            <ModuleCard
              key={module.id}
              module={enhancedModule}
              isInstalled={installedModules.includes(module.id)}
              isExpanded={expandedModule === module.id}
              onInstall={onInstall}
              onUninstall={onUninstall}
              onToggleExpansion={onToggleExpansion}
              onToggleConfigCompleted={onToggleConfigCompleted}
            />
          );
        })}
      </div>
      
      {/* Right Column */}
      <div className="space-y-4">
        {rightColumnModules.map(module => {
          // Add configCompleted property to module
          const enhancedModule = {
            ...module,
            configCompleted: configCompletedModules.includes(module.id)
          };
          
          return (
            <ModuleCard
              key={module.id}
              module={enhancedModule}
              isInstalled={installedModules.includes(module.id)}
              isExpanded={expandedModule === module.id}
              onInstall={onInstall}
              onUninstall={onUninstall}
              onToggleExpansion={onToggleExpansion}
              onToggleConfigCompleted={onToggleConfigCompleted}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ModuleList;
