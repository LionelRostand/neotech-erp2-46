
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from "@/hooks/use-toast";
import { modules } from '@/data/modules';

import PageHeader from '@/components/applications/PageHeader';
import ModuleList from '@/components/applications/ModuleList';
import { Input } from '@/components/ui/input';
import { Search, X, Building2, Headphones, Globe, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const Applications: React.FC = () => {
  const [installedModules, setInstalledModules] = useState<number[]>([]);
  const [configCompletedModules, setConfigCompletedModules] = useState<number[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Load installed modules and config completed modules from localStorage on load
  useEffect(() => {
    const savedModules = localStorage.getItem('installedModules');
    if (savedModules) {
      setInstalledModules(JSON.parse(savedModules));
    }
    
    const savedConfigCompletedModules = localStorage.getItem('configCompletedModules');
    if (savedConfigCompletedModules) {
      setConfigCompletedModules(JSON.parse(savedConfigCompletedModules));
    }
  }, []);
  
  // Save installed modules to localStorage
  useEffect(() => {
    localStorage.setItem('installedModules', JSON.stringify(installedModules));
    // Trigger a custom event to notify the DashboardLayout
    const event = new CustomEvent('modulesChanged', { detail: installedModules });
    window.dispatchEvent(event);
  }, [installedModules]);
  
  // Save config completed modules to localStorage
  useEffect(() => {
    localStorage.setItem('configCompletedModules', JSON.stringify(configCompletedModules));
  }, [configCompletedModules]);
  
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
    // Check if module configuration is marked as completed
    if (configCompletedModules.includes(moduleId)) {
      toast({
        title: "Action impossible",
        description: "Vous ne pouvez pas désinstaller un module dont la configuration est marquée comme terminée.",
        variant: "destructive",
      });
      return;
    }
    
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
  
  const handleToggleConfigCompleted = (moduleId: number, completed: boolean) => {
    if (completed) {
      if (!configCompletedModules.includes(moduleId)) {
        setConfigCompletedModules(prev => [...prev, moduleId]);
      }
    } else {
      setConfigCompletedModules(prev => prev.filter(id => id !== moduleId));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Filter modules based on search term and active category
  const filteredModules = modules.filter(module => {
    const matchesSearch = 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || module.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group modules by category
  const businessModules = modules.filter(m => m.category === 'business');
  const servicesModules = modules.filter(m => m.category === 'services');
  const digitalModules = modules.filter(m => m.category === 'digital');
  const communicationModules = modules.filter(m => m.category === 'communication');
  
  // Get category name for display
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'business': return 'Gestion d\'entreprise';
      case 'services': return 'Services spécialisés';
      case 'digital': return 'Présence numérique';
      case 'communication': return 'Communication';
      default: return 'Tous les modules';
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return <Building2 size={18} />;
      case 'services': return <Headphones size={18} />;
      case 'digital': return <Globe size={18} />;
      case 'communication': return <MessageSquare size={18} />;
      default: return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <PageHeader />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative max-w-md">
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
          
          <Tabs 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-5 gap-1">
              <TabsTrigger value="all" className={cn(
                "data-[state=active]:bg-neotech-primary data-[state=active]:text-white"
              )}>
                Tous
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-2 data-[state=active]:bg-neotech-primary data-[state=active]:text-white">
                <Building2 size={14} />
                <span className="hidden md:inline">Entreprise</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2 data-[state=active]:bg-neotech-primary data-[state=active]:text-white">
                <Headphones size={14} />
                <span className="hidden md:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="digital" className="flex items-center gap-2 data-[state=active]:bg-neotech-primary data-[state=active]:text-white">
                <Globe size={14} />
                <span className="hidden md:inline">Numérique</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2 data-[state=active]:bg-neotech-primary data-[state=active]:text-white">
                <MessageSquare size={14} />
                <span className="hidden md:inline">Communication</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredModules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun module ne correspond à votre recherche</p>
          </div>
        ) : (
          <div className="space-y-8">
            {activeCategory === 'all' && (
              <>
                {businessModules.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 px-1 text-gray-700">
                      <Building2 size={20} />
                      GESTION D'ENTREPRISE
                    </h2>
                    <ModuleList 
                      modules={businessModules.filter(m => 
                        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )}
                      installedModules={installedModules}
                      configCompletedModules={configCompletedModules}
                      expandedModule={expandedModule}
                      onInstall={handleInstall}
                      onUninstall={handleUninstall}
                      onToggleExpansion={toggleModuleExpansion}
                      onToggleConfigCompleted={handleToggleConfigCompleted}
                    />
                  </div>
                )}
                
                {servicesModules.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 px-1 text-gray-700">
                      <Headphones size={20} />
                      SERVICES SPÉCIALISÉS
                    </h2>
                    <ModuleList 
                      modules={servicesModules.filter(m => 
                        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )}
                      installedModules={installedModules}
                      configCompletedModules={configCompletedModules}
                      expandedModule={expandedModule}
                      onInstall={handleInstall}
                      onUninstall={handleUninstall}
                      onToggleExpansion={toggleModuleExpansion}
                      onToggleConfigCompleted={handleToggleConfigCompleted}
                    />
                  </div>
                )}
                
                {digitalModules.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 px-1 text-gray-700">
                      <Globe size={20} />
                      PRÉSENCE NUMÉRIQUE
                    </h2>
                    <ModuleList 
                      modules={digitalModules.filter(m => 
                        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )}
                      installedModules={installedModules}
                      configCompletedModules={configCompletedModules}
                      expandedModule={expandedModule}
                      onInstall={handleInstall}
                      onUninstall={handleUninstall}
                      onToggleExpansion={toggleModuleExpansion}
                      onToggleConfigCompleted={handleToggleConfigCompleted}
                    />
                  </div>
                )}
                
                {communicationModules.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 px-1 text-gray-700">
                      <MessageSquare size={20} />
                      COMMUNICATION
                    </h2>
                    <ModuleList 
                      modules={communicationModules.filter(m => 
                        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )}
                      installedModules={installedModules}
                      configCompletedModules={configCompletedModules}
                      expandedModule={expandedModule}
                      onInstall={handleInstall}
                      onUninstall={handleUninstall}
                      onToggleExpansion={toggleModuleExpansion}
                      onToggleConfigCompleted={handleToggleConfigCompleted}
                    />
                  </div>
                )}
              </>
            )}
            
            {activeCategory !== 'all' && (
              <>
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 px-1 text-gray-700">
                  {getCategoryIcon(activeCategory)}
                  {getCategoryName(activeCategory).toUpperCase()}
                </h2>
                <ModuleList 
                  modules={filteredModules}
                  installedModules={installedModules}
                  configCompletedModules={configCompletedModules}
                  expandedModule={expandedModule}
                  onInstall={handleInstall}
                  onUninstall={handleUninstall}
                  onToggleExpansion={toggleModuleExpansion}
                  onToggleConfigCompleted={handleToggleConfigCompleted}
                />
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Applications;
