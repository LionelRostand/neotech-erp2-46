
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Filter, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Opportunity, OpportunityStage } from './types/crm-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useOpportunityUtils } from './hooks/opportunity/useOpportunityUtils';
import OpportunityKanban from './opportunities/OpportunityKanban';
import OpportunityTable from './opportunities/OpportunityTable';
import OpportunitySearch from './opportunities/OpportunitySearch';
import AddOpportunityDialog from './opportunities/AddOpportunityDialog';
import EditOpportunityDialog from './opportunities/EditOpportunityDialog';
import OpportunityDetailsDialog from './opportunities/OpportunityDetailsDialog';
import { orderBy } from 'firebase/firestore';

const CrmOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  
  const firestore = useFirestore(COLLECTIONS.CRM.OPPORTUNITIES);
  const { toast } = useToast();
  const { filterOpportunities } = useOpportunityUtils();

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const data = await firestore.getAll([orderBy('updatedAt', 'desc')]);
        setOpportunities(data as Opportunity[]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading opportunities:', error);
        toast({
          title: "Erreur lors du chargement des opportunités",
          description: "Impossible de charger les opportunités. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  useEffect(() => {
    setFilteredOpportunities(filterOpportunities(opportunities, searchTerm, stageFilter));
  }, [opportunities, searchTerm, stageFilter]);

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsEditDialogOpen(true);
  };

  const handleOpenDetailsDialog = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDetailsDialogOpen(true);
  };

  const handleAddOpportunity = async (newOpportunity: Opportunity) => {
    try {
      await firestore.add(newOpportunity);
      setOpportunities([...opportunities, {...newOpportunity, id: Date.now().toString()}]);
      toast({
        title: "Opportunité ajoutée",
        description: "L'opportunité a été ajoutée avec succès.",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding opportunity:', error);
      toast({
        title: "Erreur lors de l'ajout",
        description: "Impossible d'ajouter l'opportunité. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOpportunity = async (updatedOpportunity: Opportunity) => {
    try {
      await firestore.update(updatedOpportunity.id, updatedOpportunity);
      setOpportunities(opportunities.map(opp => 
        opp.id === updatedOpportunity.id ? updatedOpportunity : opp
      ));
      toast({
        title: "Opportunité mise à jour",
        description: "L'opportunité a été mise à jour avec succès.",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: "Impossible de mettre à jour l'opportunité. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStage = async (opportunityId: string, newStage: OpportunityStage) => {
    try {
      const opportunityToUpdate = opportunities.find(opp => opp.id === opportunityId);
      if (!opportunityToUpdate) return;

      const updatedOpportunity = {
        ...opportunityToUpdate,
        stage: newStage,
        updatedAt: new Date().toISOString()
      };

      await firestore.update(opportunityId, { 
        stage: newStage,
        updatedAt: new Date().toISOString()
      });

      setOpportunities(opportunities.map(opp => 
        opp.id === opportunityId ? updatedOpportunity : opp
      ));

      toast({
        title: "Étape mise à jour",
        description: `L'opportunité a été déplacée vers "${newStage}".`,
      });
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
      toast({
        title: "Erreur lors de la mise à jour",
        description: "Impossible de mettre à jour l'étape. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Opportunités</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleOpenAddDialog}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle opportunité
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Tabs defaultValue="kanban" onValueChange={(value) => setViewMode(value as 'kanban' | 'list')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="kanban">Vue Kanban</TabsTrigger>
                <TabsTrigger value="list">Vue Liste</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <OpportunitySearch 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              stageFilter={stageFilter}
              setStageFilter={setStageFilter}
            />

            <TabsContent value="kanban" className="mt-2">
              <OpportunityKanban 
                opportunities={filteredOpportunities}
                onOpportunityClick={handleOpenDetailsDialog}
                onStageChange={handleUpdateStage}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-2">
              <OpportunityTable 
                opportunities={filteredOpportunities}
                onEditClick={handleOpenEditDialog}
                onViewClick={handleOpenDetailsDialog}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Dialogs */}
      <AddOpportunityDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddOpportunity}
      />

      {selectedOpportunity && (
        <>
          <EditOpportunityDialog 
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            opportunity={selectedOpportunity}
            onUpdate={handleUpdateOpportunity}
          />

          <OpportunityDetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            opportunity={selectedOpportunity}
            onEdit={() => {
              setIsDetailsDialogOpen(false);
              setIsEditDialogOpen(true);
            }}
          />
        </>
      )}
    </div>
  );
};

export default CrmOpportunities;
