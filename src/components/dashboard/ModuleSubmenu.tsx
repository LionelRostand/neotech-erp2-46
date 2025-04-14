import React from 'react';
import { SubModule } from '@/data/types/modules';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar/sidebar-submenu';

interface ModuleSubmenuProps {
  submodules: SubModule[];
  location: { pathname: string };
  onNavigate: (href: string) => void;
}

const ModuleSubmenu: React.FC<ModuleSubmenuProps> = ({ 
  submodules, 
  location, 
  onNavigate 
}) => {
  if (!submodules || submodules.length === 0) return null;
  
  const getModuleGroup = (id: string) => {
    if (id.startsWith('health-')) {
      if (['health-patients', 'health-appointments'].includes(id)) {
        return 'patient';
      } else if (['health-doctors', 'health-nurses'].includes(id)) {
        return 'staff';
      } else if (['health-medical-records', 'health-consultations'].includes(id)) {
        return 'medical';
      } else if (['health-pharmacy', 'health-prescriptions'].includes(id)) {
        return 'pharmacy';
      } else if (['health-admissions', 'health-rooms'].includes(id)) {
        return 'hospital';
      } else if (['health-billing', 'health-insurance'].includes(id)) {
        return 'finance';
      }
    } else if (id.startsWith('employees-')) {
      if (['employees-profiles', 'employees-hierarchy', 'employees-badges'].includes(id)) {
        return 'personnel';
      } else if (['employees-attendance', 'employees-timesheet', 'employees-leaves', 'employees-absences'].includes(id)) {
        return 'temps';
      } else if (['employees-contracts', 'employees-documents', 'employees-departments', 'employees-companies'].includes(id)) {
        return 'administratif';
      } else if (['employees-evaluations', 'employees-trainings'].includes(id)) {
        return 'développement';
      } else if (['employees-salaries', 'employees-recruitment'].includes(id)) {
        return 'rh';
      }
    }
    return null;
  };

  const getGroupColor = (group: string | null) => {
    switch (group) {
      case 'personnel':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-800';
      case 'temps':
        return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-800';
      case 'administratif':
        return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-800';
      case 'développement':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-800';
      case 'rh':
        return 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 text-pink-800';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-800';
    }
  };

  const isEmployeesModule = submodules.some(sm => sm.id.startsWith('employees-'));
  
  if (isEmployeesModule) {
    const groupedModules: Record<string, SubModule[]> = {
      'personnel': [],
      'temps': [],
      'administratif': [],
      'développement': [],
      'rh': [],
      'autres': []
    };
    
    submodules.forEach(submodule => {
      const group = getModuleGroup(submodule.id);
      if (group) {
        groupedModules[group].push(submodule);
      } else {
        groupedModules['autres'].push(submodule);
      }
    });
    
    const groupNames: Record<string, string> = {
      'personnel': 'Personnel',
      'temps': 'Gestion du temps',
      'administratif': 'Documents & Admin',
      'développement': 'Développement RH',
      'rh': 'Ressources Humaines',
      'autres': 'Autres fonctionnalités'
    };
    
    return (
      <div className="space-y-1 mt-1">
        {Object.entries(groupedModules).map(([group, modules]) => {
          if (modules.length === 0) return null;
          
          const groupColor = getGroupColor(group);
          
          return (
            <div key={group} className="mb-3">
              <div className="px-3 mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {groupNames[group]}
              </div>
              <SidebarMenuSub>
                {modules.map((submodule) => (
                  <SidebarMenuSubItem key={submodule.id}>
                    <SidebarMenuSubButton 
                      isActive={location.pathname === submodule.href}
                      onClick={() => onNavigate(submodule.href)}
                      className={`transition-all duration-200 hover:shadow-sm ${
                        location.pathname === submodule.href ? groupColor : ''
                      }`}
                    >
                      <span className={`mr-2 ${
                        location.pathname === submodule.href 
                          ? `text-${group}-600`
                          : 'text-gray-500'
                      }`}>
                        {submodule.icon}
                      </span>
                      <span className="text-sm">{submodule.name}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </div>
          );
        })}
      </div>
    );
  }
  
  return (
    <div className="pl-8 space-y-1 mt-1">
      {submodules.map((submodule) => {
        const group = getModuleGroup(submodule.id);
        const groupColor = getGroupColor(group);
        
        return (
          <div key={submodule.id} className="flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center px-2 py-1.5 text-sm rounded-md w-full cursor-pointer group ${
                    location.pathname === submodule.href 
                      ? groupColor
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => onNavigate(submodule.href)}
                >
                  <span className="mr-2 text-gray-500 group-hover:text-gray-700">{submodule.icon}</span>
                  <span className="whitespace-nowrap flex-grow">{submodule.name}</span>
                  
                  {group && (
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] h-5 ${groupColor} hidden group-hover:inline-flex`}
                    >
                      {group}
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p className="font-medium">{submodule.name}</p>
                {submodule.description && <p className="text-xs opacity-70 mt-1">{submodule.description}</p>}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export default ModuleSubmenu;
