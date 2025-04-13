
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, Building, Users } from 'lucide-react';
import HierarchyVisualization from './hierarchy/HierarchyVisualization';

const EmployeesHierarchy: React.FC = () => {
  const [viewMode, setViewMode] = useState<'orgChart' | 'treeView'>('orgChart');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hiérarchie de l'Organisation</h1>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setRefreshKey(prev => prev + 1)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
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
            data={null}  // Pass null for data to use the live data from useHierarchyData
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesHierarchy;
