
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Trash2, Download, ChevronDown, ChevronUp, LayoutDashboard, Settings } from 'lucide-react';
import { AppModule } from '@/data/types/modules';
import ModuleDashboardPreview from './ModuleDashboardPreview';
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface ModuleCardProps {
  module: AppModule;
  isInstalled: boolean;
  isExpanded: boolean;
  onInstall: (moduleId: number) => void;
  onUninstall: (moduleId: number) => void;
  onToggleExpansion: (moduleId: number) => void;
  onToggleConfigCompleted?: (moduleId: number, completed: boolean) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isInstalled,
  isExpanded,
  onInstall,
  onUninstall,
  onToggleExpansion,
  onToggleConfigCompleted
}) => {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleConfigToggle = (checked: boolean) => {
    if (onToggleConfigCompleted) {
      onToggleConfigCompleted(module.id, checked);
      
      if (checked) {
        toast({
          title: "Configuration terminée",
          description: `La configuration du module ${module.name} a été marquée comme terminée.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Configuration active",
          description: `La configuration du module ${module.name} est maintenant active.`,
          variant: "default",
        });
      }
    }
  };

  return (
    <Card className="border border-gray-200 transition-all hover:shadow-md flex flex-col">
      <CardHeader className="bg-gray-50 py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-neotech-primary/10 text-neotech-primary">
            {module.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{module.name}</CardTitle>
            <CardDescription className="text-xs">Module #{module.id}</CardDescription>
          </div>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDashboard(!showDashboard)}
              className="ml-auto h-7 w-7 p-0 mr-1"
              title="Aperçu du tableau de bord"
              disabled={module.configCompleted}
            >
              <LayoutDashboard size={16} />
            </Button>
            
            {module.submodules && isInstalled && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onToggleExpansion(module.id)}
                className="ml-auto h-7 w-7 p-0"
                disabled={module.configCompleted}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-3 px-4 flex-1 text-sm">
        <p className="text-sm text-gray-600">{module.description}</p>
        
        {/* Dashboard Preview - only show if not config completed */}
        {showDashboard && !module.configCompleted && (
          <div className="mt-3 border-t pt-3">
            <h3 className="font-medium mb-2 text-sm">Aperçu du tableau de bord:</h3>
            <ModuleDashboardPreview moduleId={module.id} />
          </div>
        )}
        
        {/* Sous-modules (visible uniquement si le module est installé et développé et pas configuration complétée) */}
        {isInstalled && isExpanded && module.submodules && !module.configCompleted && (
          <div className="mt-3 border-t pt-3">
            <h3 className="font-medium mb-2 text-sm">Fonctionnalités disponibles:</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {module.submodules.map((submodule) => (
                <div key={submodule.id} className="flex items-center p-1.5 rounded-md bg-gray-50 hover:bg-gray-100">
                  <div className="mr-2 text-neotech-primary">
                    {submodule.icon}
                  </div>
                  <span className="text-xs font-medium">{submodule.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between py-2 px-4">
        {isInstalled ? (
          <div className="w-full flex items-center justify-between flex-wrap gap-2">
            <Button variant="ghost" size="sm" className="text-green-600 h-7 text-xs" disabled>
              <Check className="mr-1 h-3 w-3" />
              Installé
            </Button>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Configuration completion toggle */}
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-gray-500" />
                <span className="text-xs text-gray-600 whitespace-nowrap">Configuration terminée:</span>
                <Switch 
                  checked={module.configCompleted || false} 
                  onCheckedChange={handleConfigToggle}
                  aria-label="Marquer la configuration comme terminée"
                />
              </div>
              
              {/* Uninstall button - only show if config not completed */}
              {!module.configCompleted && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 text-xs whitespace-nowrap"
                  onClick={() => onUninstall(module.id)}
                  title="Désinstaller le module"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Désinstaller
                </Button>
              )}
            </div>
          </div>
        ) : (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onInstall(module.id)}
            className="hover:bg-neotech-primary hover:text-white h-7 text-xs"
          >
            <Download className="mr-1 h-3 w-3" />
            Installer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
