
import React from 'react';
import ModuleCard from './ModuleCard';
import { AppModule } from '@/data/types/modules';

interface ModuleListProps {
  modules: AppModule[];
  installedModules: number[];
  expandedModule: number | null;
  onInstall: (moduleId: number) => void;
  onUninstall: (moduleId: number) => void;
  onToggleExpansion: (moduleId: number) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  installedModules,
  expandedModule,
  onInstall,
  onUninstall,
  onToggleExpansion
}) => {
  // Split modules into two equal columns
  const splitModules = () => {
    const midpoint = Math.ceil(modules.length / 2);
    return [
      modules.slice(0, midpoint),
      modules.slice(midpoint)
    ];
  };
  
  const [leftColumnModules, rightColumnModules] = splitModules();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-4">
        {leftColumnModules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            isInstalled={installedModules.includes(module.id)}
            isExpanded={expandedModule === module.id}
            onInstall={onInstall}
            onUninstall={onUninstall}
            onToggleExpansion={onToggleExpansion}
          />
        ))}
      </div>
      
      {/* Right Column */}
      <div className="space-y-4">
        {rightColumnModules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            isInstalled={installedModules.includes(module.id)}
            isExpanded={expandedModule === module.id}
            onInstall={onInstall}
            onUninstall={onUninstall}
            onToggleExpansion={onToggleExpansion}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleList;
