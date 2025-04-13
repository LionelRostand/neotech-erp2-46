
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
  
  // Groupes de sous-modules
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

  // Couleurs pour les badges selon le groupe
  const getGroupColor = (group: string | null) => {
    switch (group) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'medical': return 'bg-purple-100 text-purple-800';
      case 'pharmacy': return 'bg-amber-100 text-amber-800';
      case 'hospital': return 'bg-red-100 text-red-800';
      case 'finance': return 'bg-emerald-100 text-emerald-800';
      case 'personnel': return 'bg-indigo-100 text-indigo-800';
      case 'temps': return 'bg-cyan-100 text-cyan-800';
      case 'administratif': return 'bg-orange-100 text-orange-800';
      case 'développement': return 'bg-pink-100 text-pink-800';
      case 'rh': return 'bg-violet-100 text-violet-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Vérifier s'il s'agit du module employés pour améliorer l'affichage
  const isEmployeesModule = submodules.some(sm => sm.id.startsWith('employees-'));
  
  // Si c'est le module employés, on regroupe les sous-modules
  if (isEmployeesModule) {
    const groupedModules: Record<string, SubModule[]> = {
      'personnel': [],
      'temps': [],
      'administratif': [],
      'développement': [],
      'rh': [],
      'autres': []
    };
    
    // Grouper les sous-modules par catégorie
    submodules.forEach(submodule => {
      const group = getModuleGroup(submodule.id);
      if (group) {
        groupedModules[group].push(submodule);
      } else {
        groupedModules['autres'].push(submodule);
      }
    });
    
    // Noms des groupes traduits en français
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
                    >
                      <span className="mr-2 text-gray-500">{submodule.icon}</span>
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
  
  // Pour les autres modules, on garde le style original
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
                      ? 'bg-gray-100 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => onNavigate(submodule.href)}
                >
                  <span className="mr-2 text-gray-500 group-hover:text-gray-700">{submodule.icon}</span>
                  <span className="whitespace-nowrap flex-grow">{submodule.name}</span>
                  
                  {/* Indicateurs d'état (nouveauté, priorité) */}
                  <div className="flex items-center gap-1">
                    {/* Badge indiquant le groupe fonctionnel */}
                    {group && (
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] h-5 ${groupColor} hidden group-hover:inline-flex`}
                      >
                        {group}
                      </Badge>
                    )}
                  </div>
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
