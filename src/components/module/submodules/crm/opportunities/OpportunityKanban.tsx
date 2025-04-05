
import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
import { Opportunity } from '../types/crm-types';

interface OpportunityKanbanProps {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  onOpportunityClick: (opportunity: Opportunity) => void;
}

const OpportunityKanban: React.FC<OpportunityKanbanProps> = ({ 
  opportunities, 
  isLoading,
  error,
  onOpportunityClick
}) => {
  const opportunityUtils = useOpportunityUtils();
  const stages = opportunityUtils.getAllStages();
  
  // Group opportunities by stage - using useMemo for performance
  const opportunitiesByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.value] = opportunities.filter(opp => opp.stage === stage.value);
      return acc;
    }, {} as Record<string, Opportunity[]>);
  }, [opportunities, stages]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Une erreur est survenue lors du chargement des opportunités</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stages.map(stage => (
        <div key={stage.value} className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{stage.label}</h3>
            <Badge variant="outline">{opportunitiesByStage[stage.value]?.length || 0}</Badge>
          </div>
          
          <div className="flex-1 space-y-3">
            {opportunitiesByStage[stage.value]?.length ? (
              opportunitiesByStage[stage.value].map(opportunity => (
                <Card 
                  key={opportunity.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onOpportunityClick(opportunity)}
                >
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm truncate">{opportunity.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {opportunity.clientName || 'Client non défini'}
                    </p>
                    {opportunity.value && (
                      <p className="text-xs font-medium mt-2">{opportunity.value} €</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed rounded-md text-muted-foreground text-sm">
                Aucune opportunité
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OpportunityKanban;
