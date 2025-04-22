
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import PackagesList from './packages/PackagesList';
import PackageCreateDialog from './packages/PackageCreateDialog';
import { mockPackages } from './mockPackages';
import { Input } from '@/components/ui/input';

const FreightPackages: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<string>('all');

  const filteredPackages = mockPackages.filter(pkg => {
    const matchesSearch = !searchQuery || 
      pkg.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.carrierName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = currentFilter === 'all' || 
      (currentFilter === 'draft' && pkg.status === 'draft') ||
      (currentFilter === 'ready' && pkg.status === 'ready') ||
      (currentFilter === 'in_transit' && pkg.status === 'shipped') ||
      (currentFilter === 'delivered' && pkg.status === 'delivered') ||
      (currentFilter === 'others' && ['returned', 'lost'].includes(pkg.status));
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un colis..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau colis
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setCurrentFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="draft">Brouillons</TabsTrigger>
          <TabsTrigger value="ready">Prêts</TabsTrigger>
          <TabsTrigger value="in_transit">En transit</TabsTrigger>
          <TabsTrigger value="delivered">Livrés</TabsTrigger>
          <TabsTrigger value="others">Autres</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <PackagesList packages={filteredPackages} />
        </TabsContent>

        <TabsContent value="draft">
          <PackagesList packages={filteredPackages} />
        </TabsContent>

        <TabsContent value="ready">
          <PackagesList packages={filteredPackages} />
        </TabsContent>

        <TabsContent value="in_transit">
          <PackagesList packages={filteredPackages} />
        </TabsContent>

        <TabsContent value="delivered">
          <PackagesList packages={filteredPackages} />
        </TabsContent>

        <TabsContent value="others">
          <PackagesList packages={filteredPackages} />
        </TabsContent>
      </Tabs>

      <PackageCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default FreightPackages;
