
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, Building, Users, Plus } from 'lucide-react';
import HierarchyVisualization from './hierarchy/HierarchyVisualization';
import DepartmentHierarchy from './hierarchy/components/DepartmentHierarchy';
import { useHierarchyData } from './hierarchy/hooks/useHierarchyData';
import StatCard from '@/components/StatCard';
import { getSyncedStats } from './hierarchy/utils/hierarchyUtils';

const EmployeesHierarchy: React.FC = () => {
  const [viewMode, setViewMode] = useState<'orgChart' | 'treeView'>('orgChart');
  const [hierarchyType, setHierarchyType] = useState<'employees' | 'departments'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { hierarchyData, isLoading, refreshHierarchy, departmentStats, createDefaultCEO } = useHierarchyData();

  // Fonction pour rafraîchir la hiérarchie
  const handleRefresh = useCallback(() => {
    console.log("Déclenchement du rafraîchissement de la hiérarchie");
    refreshHierarchy();
    setRefreshKey(prev => prev + 1);
  }, [refreshHierarchy]);

  // Fonction pour créer un PDG par défaut
  const handleCreateDefaultCEO = useCallback(() => {
    console.log("Création d'un PDG par défaut");
    createDefaultCEO();
  }, [createDefaultCEO]);

  // Calculer les statistiques basées sur la hiérarchie
  const stats = useMemo(() => {
    return getSyncedStats(
      hierarchyData, 
      departmentStats.departmentsCount, 
      departmentStats.managersCount
    );
  }, [hierarchyData, departmentStats]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hiérarchie de l'Organisation</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          
          {!hierarchyData && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleCreateDefaultCEO}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer PDG par défaut
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Employés" 
          value={stats.totalEmployees.toString()} 
          icon={<Users className="h-6 w-6 text-white" />}
          description="Total dans l'organigramme"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow"
        />
        
        <StatCard 
          title="Managers" 
          value={stats.managerCount.toString()} 
          icon={<Users className="h-6 w-6 text-green-600" />}
          description="Avec des subordonnés directs"
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow"
        />
        
        <StatCard 
          title="Niveaux" 
          value={stats.maxDepth.toString()} 
          icon={<Building className="h-6 w-6 text-purple-600" />}
          description="Profondeur de la hiérarchie"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow"
        />
        
        <StatCard 
          title="Départements" 
          value={stats.departmentsRepresented.toString()} 
          icon={<Building className="h-6 w-6 text-orange-600" />}
          description="Représentés dans l'organigramme"
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="employees" onValueChange={(v) => setHierarchyType(v as 'employees' | 'departments')}>
          <TabsList>
            <TabsTrigger value="employees">
              <Users className="h-4 w-4 mr-2" />
              Employés
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Building className="h-4 w-4 mr-2" />
              Départements
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {hierarchyType === 'employees' && (
          <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as 'orgChart' | 'treeView')}>
            <TabsList>
              <TabsTrigger value="orgChart">Organigramme</TabsTrigger>
              <TabsTrigger value="treeView">Vue Arborescente</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      <Card>
        <CardContent className="p-6">
          {hierarchyType === 'employees' ? (
            <HierarchyVisualization 
              key={refreshKey}
              viewMode={viewMode} 
              searchQuery={searchQuery}
              data={hierarchyData}
              onRefresh={handleCreateDefaultCEO}
            />
          ) : (
            <DepartmentHierarchy />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
