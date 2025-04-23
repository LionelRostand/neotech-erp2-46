
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import PackagesList from './packages/PackagesList';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useFreightShipments } from '@/hooks/freight/useFreightShipments';
import ShipmentWizardDialog from './ShipmentWizardDialog';
import { useQueryClient } from '@tanstack/react-query';

const FreightPackages: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const { shipments, isLoading } = useFreightShipments();

  const filteredShipments = shipments.filter(pkg => {
    // Add defensive checks to handle potentially undefined values
    const searchRef = pkg.reference?.toLowerCase() || '';
    const searchCustomer = pkg.customerName?.toLowerCase() || '';
    const searchTracking = pkg.trackingNumber?.toLowerCase() || '';
    const searchCarrier = pkg.carrierName?.toLowerCase() || '';
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch = !searchQuery || 
      searchRef.includes(searchLower) ||
      searchCustomer.includes(searchLower) ||
      searchTracking.includes(searchLower) ||
      searchCarrier.includes(searchLower);
    
    // Use a more robust check for status
    const status = pkg.status?.toLowerCase() || 'unknown';
    
    const matchesStatus = currentFilter === 'all' || 
      (currentFilter === 'draft' && status === 'draft') ||
      (currentFilter === 'ready' && status === 'confirmed') ||
      (currentFilter === 'in_transit' && status === 'in_transit') ||
      (currentFilter === 'delivered' && status === 'delivered') ||
      (currentFilter === 'others' && ['cancelled', 'delayed'].includes(status));
      
    return matchesSearch && matchesStatus;
  });

  const handleRefreshData = () => {
    // Invalidate shipments query to force a refresh
    queryClient.invalidateQueries({ queryKey: ['freight', 'shipments'] });
  };

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
          <PackagesList packages={filteredShipments} isLoading={isLoading} onRefresh={handleRefreshData} />
        </TabsContent>

        <TabsContent value="draft">
          <PackagesList packages={filteredShipments} isLoading={isLoading} onRefresh={handleRefreshData} />
        </TabsContent>

        <TabsContent value="ready">
          <PackagesList packages={filteredShipments} isLoading={isLoading} onRefresh={handleRefreshData} />
        </TabsContent>

        <TabsContent value="in_transit">
          <PackagesList packages={filteredShipments} isLoading={isLoading} onRefresh={handleRefreshData} />
        </TabsContent>

        <TabsContent value="delivered">
          <PackagesList packages={filteredShipments} isLoading={isLoading} onRefresh={handleRefreshData} />
        </TabsContent>

        <TabsContent value="others">
          <PackagesList packages={filteredShipments} isLoading={isLoading} onRefresh={handleRefreshData} />
        </TabsContent>
      </Tabs>

      <ShipmentWizardDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default FreightPackages;
