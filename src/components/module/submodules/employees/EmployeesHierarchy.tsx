
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, ListTree, Network, Users, Briefcase, Building, Layers } from 'lucide-react';
import HierarchyVisualization from './hierarchy/HierarchyVisualization';
import { ChartNode } from './hierarchy/types';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Employee } from '@/types/employee';
import { getEmployeeInitials, getEmployeeDisplayName } from './utils/employeeUtils';

const EmployeesHierarchy: React.FC = () => {
  const [viewMode, setViewMode] = useState<'orgChart' | 'treeView'>('orgChart');
  const [searchQuery, setSearchQuery] = useState('');
  const { employees, departments } = useEmployeeData();

  // Statistics for dashboard
  const stats = useMemo(() => {
    if (!employees || !departments) return {
      totalEmployees: 0,
      managers: 0,
      departments: 0,
      topLevelManagers: 0
    };

    const managers = employees.filter(emp => 
      employees.some(e => e.managerId === emp.id)
    ).length;
    
    const topLevelManagers = employees.filter(emp => 
      !emp.managerId && employees.some(e => e.managerId === emp.id)
    ).length;

    return {
      totalEmployees: employees.length,
      managers,
      departments: departments.length,
      topLevelManagers
    };
  }, [employees, departments]);

  // Log de debug pour vérifier le nombre d'employés
  useMemo(() => {
    console.log(`[EmployeesHierarchy] - Nombre d'employés dédupliqués: ${employees?.length || 0}`);
    if (employees?.length > 0) {
      console.log("[EmployeesHierarchy] - Liste des employés pour la hiérarchie:", 
        employees.map(e => `${e.firstName} ${e.lastName} (${e.id})`));
    }
  }, [employees]);

  // Fonction récursive pour construire un nœud dans la hiérarchie
  const buildHierarchyNode = (employee: Employee, allEmployees: Employee[]): ChartNode => {
    // Trouver tous les employés qui ont cet employé comme manager
    const subordinates = allEmployees.filter(emp => emp.managerId === employee.id);
    
    // Construire le nœud pour cet employé
    return {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      position: employee.position || employee.title || 'Sans titre',
      department: employee.department || undefined,
      imageUrl: employee.photoURL || employee.photo || undefined,
      children: subordinates.map(sub => buildHierarchyNode(sub, allEmployees))
    };
  };

  // Fonction pour construire l'arbre hiérarchique
  const hierarchyData = useMemo(() => {
    if (!employees || employees.length === 0) return null;

    // Identifier le(s) employé(s) au sommet (sans manager)
    const topLevelEmployees = employees.filter(emp => !emp.managerId);
    
    if (topLevelEmployees.length === 0) {
      // Si aucun employé de haut niveau n'est trouvé, prendre le premier de la liste
      const root = employees[0];
      return buildHierarchyNode(root, employees);
    }
    
    // S'il y a plusieurs employés de niveau supérieur, créer un nœud racine virtuel
    if (topLevelEmployees.length > 1) {
      return {
        id: 'root',
        name: 'Direction',
        position: 'Organisation',
        department: 'Tous les départements',
        children: topLevelEmployees.map(emp => buildHierarchyNode(emp, employees))
      } as ChartNode;
    }
    
    // Sinon, utiliser le seul employé de niveau supérieur comme racine
    return buildHierarchyNode(topLevelEmployees[0], employees);
  }, [employees]);

  // Calculate organization depth
  const getOrganizationDepth = (node: ChartNode | null): number => {
    if (!node) return 0;
    if (node.children.length === 0) return 1;
    return 1 + Math.max(...node.children.map(child => getOrganizationDepth(child)));
  };

  const organizationDepth = useMemo(() => {
    return getOrganizationDepth(hierarchyData);
  }, [hierarchyData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center text-xl font-semibold">
          <ListTree className="h-6 w-6 text-emerald-500 mr-2" />
          Hiérarchie de l'Organisation
        </div>
      </div>
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Équipe</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Collaborateurs sous votre responsabilité</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Briefcase className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.managers}</div>
            <p className="text-xs text-muted-foreground">Team leaders dans votre équipe</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Départements</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">Unités fonctionnelles</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Niveaux</CardTitle>
            <Layers className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationDepth}</div>
            <p className="text-xs text-muted-foreground">Profondeur hiérarchique</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Rechercher un collaborateur..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <RadioGroup 
              defaultValue={viewMode} 
              className="flex space-x-4"
              onValueChange={(value) => setViewMode(value as 'orgChart' | 'treeView')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orgChart" id="orgChart" />
                <Label htmlFor="orgChart" className="flex items-center">
                  <Network className="h-4 w-4 mr-1 text-blue-500" />
                  Organigramme
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="treeView" id="treeView" />
                <Label htmlFor="treeView" className="flex items-center">
                  <ListTree className="h-4 w-4 mr-1 text-emerald-500" />
                  Vue arborescente
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {hierarchyData ? (
            <HierarchyVisualization 
              data={hierarchyData} 
              viewMode={viewMode}
              searchQuery={searchQuery}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune donnée hiérarchique disponible.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
