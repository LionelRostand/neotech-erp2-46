
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import InsuranceGrid from './components/insurance/InsuranceGrid';
import AddInsuranceDialog from './components/insurance/AddInsuranceDialog';
import InsuranceFilters from './components/insurance/InsuranceFilters';
import InsuranceEmptyState from './components/insurance/InsuranceEmptyState';
import InsuranceStatistics from './components/insurance/InsuranceStatistics';

interface Insurance {
  id: string;
  name: string;
  type: string;
  coverage: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
  address?: string;
  notes?: string;
}

const InsurancePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'table'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch insurances from Firestore
  const { data, isLoading, error } = useCollectionData(
    COLLECTIONS.HEALTH.INSURANCE,
    []
  );

  // Calculate statistics
  const totalInsurances = insurances.length;
  const activeInsurances = insurances.filter(i => i.status === 'active').length;
  const inactiveInsurances = insurances.filter(i => i.status === 'inactive').length;
  const coverageRate = 75; // This would be calculated based on actual data

  // Filter insurances based on search and filters
  const filteredInsurances = insurances.filter(insurance => {
    const matchesSearch = searchTerm === '' || 
      insurance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.contactName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || insurance.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || insurance.status === statusFilter;
      
    return matchesSearch && matchesType && matchesStatus;
  });

  useEffect(() => {
    // Mock data for display
    setInsurances([
      {
        id: '1',
        name: 'Assurance Santé Plus',
        type: 'private',
        coverage: '80% hospitalisation, 100% consultation',
        contactName: 'Jean Martin',
        contactEmail: 'jean.martin@example.com',
        contactPhone: '01 23 45 67 89',
        status: 'active',
        address: '123 Rue de la Santé, Paris',
        notes: 'Partenaire principal depuis 2015'
      },
      {
        id: '2',
        name: 'Mutuelle Nationale',
        type: 'mutual',
        coverage: '70% tous soins',
        contactName: 'Marie Dupont',
        contactEmail: 'marie.dupont@example.com',
        contactPhone: '01 98 76 54 32',
        status: 'active',
        address: '45 Avenue du Bien-être, Lyon',
        notes: 'Convention spéciale pour les employés'
      },
      {
        id: '3',
        name: 'Assurance Médicale Centrale',
        type: 'complementary',
        coverage: '100% dentaire, 60% optique',
        contactName: 'Pierre Durand',
        contactEmail: 'pierre.durand@example.com',
        contactPhone: '01 45 67 89 01',
        status: 'inactive',
        address: '78 Boulevard de la Santé, Marseille',
        notes: 'Contrat en cours de renégociation'
      }
    ]);
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  const handleViewInsurance = (insurance: Insurance) => {
    console.log('View insurance:', insurance);
    // Will be implemented later
  };

  const handleEditInsurance = (insurance: Insurance) => {
    console.log('Edit insurance:', insurance);
    // Will be implemented later
  };

  const handleDeleteInsurance = (insurance: Insurance) => {
    console.log('Delete insurance:', insurance);
    // Will be implemented later
  };

  const handleAddInsurance = (data: any) => {
    console.log('Add insurance:', data);
    // Will be implemented with Firebase later
    setIsAddDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Assurances</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Assurance
          </Button>
        </div>

        <InsuranceStatistics
          totalInsurances={totalInsurances}
          activeInsurances={activeInsurances}
          inactiveInsurances={inactiveInsurances}
          coverageRate={coverageRate}
        />

        <div className="mt-6">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'grid' | 'table')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="table">Tableau</TabsTrigger>
              </TabsList>
            </div>

            <InsuranceFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onReset={resetFilters}
            />

            <TabsContent value="grid">
              {isLoading ? (
                <div className="flex justify-center p-8">Chargement des assurances...</div>
              ) : error ? (
                <div className="text-red-500 p-4">Erreur de chargement : {error.toString()}</div>
              ) : filteredInsurances.length === 0 ? (
                insurances.length === 0 ? (
                  <InsuranceEmptyState onAdd={() => setIsAddDialogOpen(true)} />
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">Aucune assurance trouvée avec les filtres actuels.</p>
                    <Button variant="link" onClick={resetFilters}>Réinitialiser les filtres</Button>
                  </div>
                )
              ) : (
                <InsuranceGrid
                  insurances={filteredInsurances}
                  onView={handleViewInsurance}
                  onEdit={handleEditInsurance}
                  onDelete={handleDeleteInsurance}
                />
              )}
            </TabsContent>

            <TabsContent value="table">
              {isLoading ? (
                <div className="flex justify-center p-8">Chargement des assurances...</div>
              ) : error ? (
                <div className="text-red-500 p-4">Erreur de chargement : {error.toString()}</div>
              ) : filteredInsurances.length === 0 ? (
                insurances.length === 0 ? (
                  <InsuranceEmptyState onAdd={() => setIsAddDialogOpen(true)} />
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">Aucune assurance trouvée avec les filtres actuels.</p>
                    <Button variant="link" onClick={resetFilters}>Réinitialiser les filtres</Button>
                  </div>
                )
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">La vue tableau sera implémentée prochainement.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <AddInsuranceDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddInsurance}
        />
      </div>
    </DashboardLayout>
  );
};

export default InsurancePage;
