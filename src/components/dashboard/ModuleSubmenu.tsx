
import React from 'react';
import { SubModule } from '@/data/types/modules';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  
  // Groupes de sous-modules pour le module Health
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Icônes pour les indicateurs de nouveauté ou d'importance
  const hasNewFeatures = (id: string) => {
    // Simulation : ces modules ont des nouveautés
    return ['health-patients', 'health-pharmacy', 'health-consultations'].includes(id);
  };

  const isHighPriority = (id: string) => {
    // Simulation : ces modules sont prioritaires
    return ['health-appointments', 'health-medical-records', 'health-admissions'].includes(id);
  };
  
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
                    {hasNewFeatures(submodule.id) && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" aria-label="Nouvelles fonctionnalités"></span>
                    )}
                    {isHighPriority(submodule.id) && (
                      <span className="h-2 w-2 rounded-full bg-red-500" aria-label="Prioritaire"></span>
                    )}
                    
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
