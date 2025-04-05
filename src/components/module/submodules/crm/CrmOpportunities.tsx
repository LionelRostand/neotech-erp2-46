
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCrmData } from '@/hooks/modules/useCrmData';
import OpportunityTable from './opportunities/OpportunityTable';
import OpportunitySearch from './opportunities/OpportunitySearch';
import AddOpportunityDialog from './opportunities/AddOpportunityDialog';
import EditOpportunityDialog from './opportunities/EditOpportunityDialog';
import OpportunityDetailsDialog from './opportunities/OpportunityDetailsDialog';
import { Opportunity } from './types/crm-types';

const CrmOpportunities: React.FC = () => {
  const { opportunities, isLoading } = useCrmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Filter opportunities based on search term and stage filter
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = searchTerm === '' || 
      (opportunity.title && opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (opportunity.company && opportunity.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (opportunity.clientName && opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStage = stageFilter === '' || opportunity.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  // Handlers
  const handleViewOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsViewDetailsOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditDialogOpen(true);
  };

  const handleEditFromDetails = () => {
    setIsViewDetailsOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleAddOpportunity = (formData: any) => {
    // Implementation would go here
    console.log('Adding opportunity:', formData);
    setIsAddDialogOpen(false);
  };

  const handleUpdateOpportunity = (formData: any) => {
    // Implementation would go here
    console.log('Updating opportunity:', formData);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Opportunités</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle opportunité
        </Button>
      </div>

      <Card className="p-4">
        <OpportunitySearch 
          searchTerm={searchTerm}
          stageFilter={stageFilter}
          setSearchTerm={setSearchTerm}
          setStageFilter={setStageFilter}
        />

        <OpportunityTable 
          opportunities={filteredOpportunities}
          onViewClick={handleViewOpportunity}
          onEditClick={handleEditOpportunity}
          loading={isLoading}
        />
      </Card>

      {/* Add Opportunity Dialog */}
      <AddOpportunityDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddOpportunity}
      />

      {/* Edit Opportunity Dialog */}
      {selectedOpportunity && (
        <EditOpportunityDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          opportunity={selectedOpportunity}
          onSubmit={handleUpdateOpportunity}
        />
      )}

      {/* View Opportunity Details */}
      {selectedOpportunity && (
        <OpportunityDetailsDialog
          open={isViewDetailsOpen}
          onOpenChange={setIsViewDetailsOpen}
          opportunity={selectedOpportunity}
          onEdit={handleEditFromDetails}
        />
      )}
    </div>
  );
};

export default CrmOpportunities;
