
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { ChartNode } from './types';
import HierarchyVisualization from './HierarchyVisualization';
import { Search, Users, RefreshCw } from 'lucide-react';

const EmployeesHierarchy = () => {
  const { employees, isLoading } = useEmployeeData();
  const [viewMode, setViewMode] = useState<'orgChart' | 'treeView'>('orgChart');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transforme les données des employés en hiérarchie organisationnelle
  const hierarchyData = useMemo(() => {
    if (!employees || employees.length === 0) return null;
    
    // Les employés sont déjà dédupliqués par useEmployeeData
    const uniqueEmployees = employees;
    
    // Créer un map des employés pour un accès facile
    const employeesMap = new Map();
    uniqueEmployees.forEach(employee => {
      employeesMap.set(employee.id, {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        position: employee.position || employee.title || '',
        department: employee.department || '',
        imageUrl: employee.photoURL || '',
        managerId: employee.managerId || '',
        children: [],
      });
    });
    
    // Déterminer la racine (le PDG ou un employé sans manager)
    const topLevelNodes: ChartNode[] = [];
    
    // Construire la hiérarchie
    employeesMap.forEach((employee, id) => {
      if (employee.managerId && employeesMap.has(employee.managerId)) {
        const manager = employeesMap.get(employee.managerId);
        manager.children.push(employee);
      } else {
        // Pas de manager ou manager non présent, c'est un nœud de premier niveau
        topLevelNodes.push(employee);
      }
    });
    
    // S'il n'y a qu'un seul nœud de premier niveau, c'est notre racine
    if (topLevelNodes.length === 1) {
      return topLevelNodes[0];
    }
    
    // S'il y a plusieurs nœuds de premier niveau, créer un nœud virtuel "Organisation"
    if (topLevelNodes.length > 0) {
      return {
        id: 'root',
        name: 'Organisation',
        position: 'Structure globale',
        children: topLevelNodes,
      };
    }
    
    return null;
  }, [employees]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-2 h-6 w-6" />
          Hiérarchie des employés
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Visualisation de la hiérarchie</CardTitle>
          <Tabs 
            defaultValue="orgChart" 
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'orgChart' | 'treeView')}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="orgChart">Organigramme</TabsTrigger>
              <TabsTrigger value="treeView">Vue arborescente</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <p className="ml-2">Chargement de la hiérarchie...</p>
            </div>
          ) : (
            <HierarchyVisualization 
              data={hierarchyData} 
              viewMode={viewMode} 
              searchQuery={searchQuery}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
