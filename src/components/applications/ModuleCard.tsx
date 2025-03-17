
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Trash2, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { AppModule } from '@/data/types/modules';

interface ModuleCardProps {
  module: AppModule;
  isInstalled: boolean;
  isExpanded: boolean;
  onInstall: (moduleId: number) => void;
  onUninstall: (moduleId: number) => void;
  onToggleExpansion: (moduleId: number) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isInstalled,
  isExpanded,
  onInstall,
  onUninstall,
  onToggleExpansion
}) => {
  return (
    <Card className="overflow-hidden border border-gray-200 transition-all hover:shadow-md h-full flex flex-col">
      <CardHeader className="bg-gray-50 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-neotech-primary/10 text-neotech-primary">
            {module.icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{module.name}</CardTitle>
            <CardDescription className="text-xs">Module #{module.id}</CardDescription>
          </div>
          {module.submodules && isInstalled && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleExpansion(module.id)}
              className="ml-auto"
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1">
        <p className="text-sm text-gray-600">{module.description}</p>
        
        {/* Sous-modules (visible uniquement si le module est installé et développé) */}
        {isInstalled && isExpanded && module.submodules && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-3">Fonctionnalités disponibles:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {module.submodules.map((submodule) => (
                <div key={submodule.id} className="flex items-center p-2 rounded-md bg-gray-50 hover:bg-gray-100">
                  <div className="mr-2 text-neotech-primary">
                    {submodule.icon}
                  </div>
                  <span className="text-sm font-medium">{submodule.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between mt-auto">
        {isInstalled ? (
          <>
            <Button variant="ghost" size="sm" className="text-green-600" disabled>
              <Check className="mr-1 h-4 w-4" />
              Installé
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onUninstall(module.id)}
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Désinstaller
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => onInstall(module.id)}
            className="hover:bg-neotech-primary hover:text-white"
          >
            <Download className="mr-1 h-4 w-4" />
            Installer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModuleCard;
