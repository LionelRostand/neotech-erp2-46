
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from "@/hooks/use-toast";
import { modules } from '@/data/modules';

import PageHeader from '@/components/applications/PageHeader';
import ModuleList from '@/components/applications/ModuleList';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Applications: React.FC = () => {
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Charger les modules installés depuis le localStorage au chargement
  useEffect(() => {
    const savedModules = localStorage.getItem('installedModules');
    if (savedModules) {
      setInstalledModules(JSON.parse(savedModules));
    }
  }, []);
  
  // Sauvegarder les modules installés dans le localStorage
  useEffect(() => {
    localStorage.setItem('installedModules', JSON.stringify(installedModules));
    // Déclencher un événement personnalisé pour notifier le DashboardLayout
    const event = new CustomEvent('modulesChanged', { detail: installedModules });
    window.dispatchEvent(event);
  }, [installedModules]);
  
  const handleInstall = (moduleId: number) => {
    if (!installedModules.includes(moduleId)) {
      const newInstalledModules = [...installedModules, moduleId];
      setInstalledModules(newInstalledModules);
      
      const module = modules.find(m => m.id === moduleId);
      toast({
        title: "Module installé",
        description: `${module?.name} a été installé avec succès.`,
        variant: "default",
      });
    }
  };
  
  const handleUninstall = (moduleId: number) => {
    const newInstalledModules = installedModules.filter(id => id !== moduleId);
    setInstalledModules(newInstalledModules);
    
    const module = modules.find(m => m.id === moduleId);
    toast({
      title: "Module désinstallé",
      description: `${module?.name} a été désinstallé.`,
      variant: "default",
    });
  };

  const toggleModuleExpansion = (moduleId: number) => {
    if (expandedModule === moduleId) {
      setExpandedModule(null);
    } else {
      setExpandedModule(moduleId);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filtrer les modules en fonction du terme de recherche
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  console.log('Search term:', searchTerm);
  console.log('Filtered modules:', filteredModules.length);
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <PageHeader />
        
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Rechercher un module..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4"
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8" 
              onClick={clearSearch}
            >
              <X size={16} />
            </Button>
          )}
        </div>
        
        {filteredModules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun module ne correspond à votre recherche</p>
          </div>
        ) : (
          <ModuleList 
            modules={filteredModules}
            installedModules={installedModules}
            expandedModule={expandedModule}
            onInstall={handleInstall}
            onUninstall={handleUninstall}
            onToggleExpansion={toggleModuleExpansion}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;
