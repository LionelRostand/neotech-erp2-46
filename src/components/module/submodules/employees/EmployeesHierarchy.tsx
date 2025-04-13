
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, Building, Users } from 'lucide-react';
import HierarchyVisualization from './hierarchy/HierarchyVisualization';
import { useHierarchyData } from './hierarchy/hooks/useHierarchyData';
import StatCard from '@/components/StatCard';
import { getSyncedStats } from './hierarchy/utils/hierarchyUtils';

const EmployeesHierarchy: React.FC = () => {
  const [viewMode, setViewMode] = useState<'orgChart' | 'treeView'>('orgChart');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { hierarchyData, isLoading, refreshHierarchy, departmentStats } = useHierarchyData();

  // Fonction pour rafraîchir la hiérarchie
  const handleRefresh = useCallback(() => {
    console.log("Déclenchement du rafraîchissement de la hiérarchie");
    refreshHierarchy();
    setRefreshKey(prev => prev + 1);
  }, [refreshHierarchy]);

  // Calculer les statistiques basées sur la hiérarchie à l'aide des fonctions utilitaires
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
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Employés" 
          value={stats.totalEmployees.toString()} 
          icon={<Users className="h-6 w-6 text-blue-500" />}
          description="Total dans l'organigramme" 
        />
        
        <StatCard 
          title="Managers" 
          value={stats.managerCount.toString()} 
          icon={<Users className="h-6 w-6 text-green-500" />}
          description="Avec des subordonnés directs" 
        />
        
        <StatCard 
          title="Niveaux" 
          value={stats.maxDepth.toString()} 
          icon={<Building className="h-6 w-6 text-purple-500" />}
          description="Profondeur de la hiérarchie" 
        />
        
        <StatCard 
          title="Départements" 
          value={stats.departmentsRepresented.toString()} 
          icon={<Building className="h-6 w-6 text-amber-500" />}
          description="Représentés dans l'organigramme" 
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un employé..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as 'orgChart' | 'treeView')}>
          <TabsList>
            <TabsTrigger value="orgChart">
              <Building className="h-4 w-4 mr-2" />
              Organigramme
            </TabsTrigger>
            <TabsTrigger value="treeView">
              <Users className="h-4 w-4 mr-2" />
              Vue Arborescente
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <HierarchyVisualization 
            key={refreshKey}
            viewMode={viewMode} 
            searchQuery={searchQuery}
            data={hierarchyData}
            onRefresh={handleRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
