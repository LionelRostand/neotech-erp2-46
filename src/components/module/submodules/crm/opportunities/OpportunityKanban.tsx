
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Opportunity, OpportunityStage } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

interface OpportunityKanbanProps {
  opportunities: Opportunity[];
  onOpportunityClick: (opportunity: Opportunity) => void;
}

const OpportunityKanban: React.FC<OpportunityKanbanProps> = ({
  opportunities,
  onOpportunityClick
}) => {
  const opportunityUtils = useOpportunityUtils();
  const stageGroups = opportunityUtils.groupOpportunitiesByStage(opportunities);
  const stages = opportunityUtils.getAllStages();

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map(stage => (
        <div key={stage.value} className="min-w-[300px]">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                <span>{stage.label}</span>
                <Badge variant="outline">{stageGroups[stage.value as OpportunityStage]?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-2">
              {stageGroups[stage.value as OpportunityStage]?.length > 0 ? (
                stageGroups[stage.value as OpportunityStage].map(opportunity => (
                  <div 
                    key={opportunity.id}
                    className="bg-white p-3 rounded-md shadow-sm border border-gray-100 cursor-pointer hover:border-gray-300 transition-colors"
                    onClick={() => onOpportunityClick(opportunity)}
                  >
                    <h3 className="font-medium text-sm">{opportunity.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {opportunity.clientName}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(opportunity.value))}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(opportunity.expectedCloseDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Aucune opportunité
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default OpportunityKanban;
