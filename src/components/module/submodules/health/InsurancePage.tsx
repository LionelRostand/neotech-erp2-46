import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, SlidersHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import InsuranceList from './components/insurance/InsuranceList';
import InsuranceGrid from './components/insurance/InsuranceGrid';
import AddInsuranceDialog from './components/insurance/AddInsuranceDialog';
import InsuranceFilters from './components/insurance/InsuranceFilters';
import InsuranceEmptyState from './components/insurance/InsuranceEmptyState';
import InsuranceStatistics from './components/insurance/InsuranceStatistics';
import { toast } from 'sonner';

const InsurancePage: React.FC = () => {
  // State for UI controls
  const [activeView, setActiveView] = useState('list');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterParams, setFilterParams] = useState({
    type: 'all',
    status: 'all',
    provider: 'all'
  });
  
  // Get insurance data
  const { 
    data: insuranceData, 
    isLoading, 
    error 
  } = useCollectionData(
    COLLECTIONS.HEALTH.INSURANCE, // Use the correct path
    [orderBy('createdAt', 'desc')]
  );

  // Handle adding a new insurance
  const handleAddInsurance = () => {
    setOpenAddDialog(true);
  };

  // Handle closing the add dialog
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilterParams(newFilters);
  };

  // Filter insurance data based on filter parameters
  const filteredInsuranceData = React.useMemo(() => {
    if (!insuranceData) return [];
    
    return insuranceData.filter(insurance => {
      const typeMatch = filterParams.type === 'all' || insurance.type === filterParams.type;
      const statusMatch = filterParams.status === 'all' || insurance.status === filterParams.status;
      const providerMatch = filterParams.provider === 'all' || insurance.provider === filterParams.provider;
      
      return typeMatch && statusMatch && providerMatch;
    });
  }, [insuranceData, filterParams]);

  // Handle successful insurance creation
  const handleInsuranceCreated = () => {
    toast.success('Assurance créée avec succès!');
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des assurances</h2>
          <p className="text-gray-500">Suivi des polices d'assurance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button size="sm" onClick={handleAddInsurance}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une assurance
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <InsuranceFilters onChange={handleFilterChange} />
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <InsuranceStatistics data={insuranceData || []} />

      {/* Tabs for list and grid views */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="list" className="flex items-center">
            Liste
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center">
            Grille
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des assurances</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Chargement des assurances...</p>}
              {error && <p className="text-red-500">Erreur: {error}</p>}
              {!isLoading && !error && (!insuranceData || insuranceData.length === 0) && (
                <InsuranceEmptyState />
              )}
              {!isLoading && !error && insuranceData && insuranceData.length > 0 && (
                <InsuranceList data={filteredInsuranceData} isLoading={isLoading} error={error} filters={filterParams} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="grid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grille des assurances</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Chargement des assurances...</p>}
              {error && <p className="text-red-500">Erreur: {error}</p>}
              {!isLoading && !error && (!insuranceData || insuranceData.length === 0) && (
                <InsuranceEmptyState />
              )}
              {!isLoading && !error && insuranceData && insuranceData.length > 0 && (
                <InsuranceGrid data={filteredInsuranceData} isLoading={isLoading} error={error} filters={filterParams} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Insurance Dialog */}
      <AddInsuranceDialog open={openAddDialog} onOpenChange={setOpenAddDialog} onSuccess={handleInsuranceCreated} />
    </div>
  );
};

export default InsurancePage;
