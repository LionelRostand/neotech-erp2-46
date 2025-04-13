
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, Building, Users } from 'lucide-react';
import HierarchyVisualization from './hierarchy/HierarchyVisualization';
import { useHierarchyData } from './hierarchy/hooks/useHierarchyData';
import StatCard from '@/components/StatCard';

const EmployeesHierarchy: React.FC = () => {
  const [viewMode, setViewMode] = useState<'orgChart' | 'treeView'>('orgChart');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const { hierarchyData, isLoading, refreshHierarchy } = useHierarchyData();

  // Calculer les statistiques basées sur la hiérarchie
  const stats = {
    totalEmployees: calculateTotalEmployees(hierarchyData),
    managerCount: calculateManagerCount(hierarchyData),
    maxDepth: calculateMaxDepth(hierarchyData),
    departmentsRepresented: calculateDepartmentsRepresented(hierarchyData)
  };

  // Fonction pour calculer le nombre total d'employés dans la hiérarchie
  function calculateTotalEmployees(data: any): number {
    if (!data) return 0;
    
    let count = 1; // Compter le nœud actuel
    if (data.children && data.children.length > 0) {
      // Ajouter le compte de tous les enfants
      data.children.forEach((child: any) => {
        count += calculateTotalEmployees(child);
      });
    }
    return count;
  }

  // Fonction pour calculer le nombre de managers (nœuds avec enfants)
  function calculateManagerCount(data: any): number {
    if (!data) return 0;
    
    let count = data.children && data.children.length > 0 ? 1 : 0;
    if (data.children && data.children.length > 0) {
      data.children.forEach((child: any) => {
        count += calculateManagerCount(child);
      });
    }
    return count;
  }

  // Fonction pour calculer la profondeur maximale de la hiérarchie
  function calculateMaxDepth(data: any): number {
    if (!data || !data.children || data.children.length === 0) {
      return 1;
    }
    
    let maxChildDepth = 0;
    data.children.forEach((child: any) => {
      const childDepth = calculateMaxDepth(child);
      if (childDepth > maxChildDepth) {
        maxChildDepth = childDepth;
      }
    });
    
    return 1 + maxChildDepth;
  }

  // Fonction pour calculer le nombre de départements représentés
  function calculateDepartmentsRepresented(data: any): number {
    if (!data) return 0;
    
    const departments = new Set<string>();
    
    // Fonction récursive pour parcourir l'arbre
    function traverseTree(node: any) {
      if (node.department) {
        departments.add(node.department);
      }
      
      if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => traverseTree(child));
      }
    }
    
    traverseTree(data);
    return departments.size;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hiérarchie de l'Organisation</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              refreshHierarchy();
              setRefreshKey(prev => prev + 1);
            }}
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
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
