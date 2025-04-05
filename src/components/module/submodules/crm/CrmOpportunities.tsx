
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import OpportunitySearch from './opportunities/OpportunitySearch';
import OpportunityTable from './opportunities/OpportunityTable';
import OpportunityKanban from './opportunities/OpportunityKanban';
import AddOpportunityDialog from './opportunities/AddOpportunityDialog';
import EditOpportunityDialog from './opportunities/EditOpportunityDialog';
import OpportunityDetailsDialog from './opportunities/OpportunityDetailsDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOpportunities } from './hooks/useOpportunities';
import { Opportunity, OpportunityFormData } from './types/crm-types';
import { toast } from 'sonner';
import DashboardLayout from '@/components/DashboardLayout';

const CrmOpportunities: React.FC = () => {
  const { opportunities, isLoading, error, addOpportunity, updateOpportunity } = useOpportunities();
  
  // Filter and view state
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Filter opportunities based on search term and stage
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesStage = stageFilter === 'all' || opportunity.stage === stageFilter;
    const matchesSearch = !searchTerm || 
      (opportunity.name && opportunity.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (opportunity.clientName && opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStage && matchesSearch;
  });

  // Handlers
  const handleAddOpportunity = async (data: OpportunityFormData) => {
    try {
      await addOpportunity(data);
      setIsAddDialogOpen(false);
      toast.success('Opportunité ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'opportunité:', error);
      toast.error('Erreur lors de l\'ajout de l\'opportunité');
    }
  };

  const handleUpdateOpportunity = async (data: OpportunityFormData) => {
    if (!selectedOpportunity) return;
    
    try {
      await updateOpportunity(selectedOpportunity.id, data);
      setIsEditDialogOpen(false);
      toast.success('Opportunité mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'opportunité:', error);
      toast.error('Erreur lors de la mise à jour de l\'opportunité');
    }
  };

  const handleViewOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailsDialogOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditDialogOpen(true);
  };

  const handleEditFromDetails = () => {
    setIsDetailsDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Opportunités</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle opportunité
          </Button>
        </div>

        <OpportunitySearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
        />

        <Tabs defaultValue="table" value={view} onValueChange={(value) => setView(value as 'table' | 'kanban')} className="space-y-4">
          <div className="flex justify-end">
            <TabsList>
              <TabsTrigger value="table">Tableau</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="table" className="mt-0">
            <OpportunityTable 
              opportunities={filteredOpportunities}
              isLoading={isLoading}
              error={error}
              onView={handleViewOpportunity}
              onEdit={handleEditOpportunity}
            />
          </TabsContent>

          <TabsContent value="kanban" className="mt-0">
            <OpportunityKanban 
              opportunities={filteredOpportunities}
              isLoading={isLoading}
              error={error}
              onOpportunityClick={handleViewOpportunity}
            />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddOpportunityDialog 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddOpportunity}
        />

        {selectedOpportunity && (
          <>
            <OpportunityDetailsDialog 
              isOpen={isDetailsDialogOpen}
              onClose={() => setIsDetailsDialogOpen(false)}
              opportunity={selectedOpportunity}
              onEdit={handleEditFromDetails}
            />

            <EditOpportunityDialog 
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              opportunity={selectedOpportunity}
              onUpdate={handleUpdateOpportunity}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CrmOpportunities;
