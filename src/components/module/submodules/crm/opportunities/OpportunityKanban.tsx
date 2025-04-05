
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Opportunity, OpportunityStage } from '../types/crm-types';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface OpportunityKanbanProps {
  opportunities: Opportunity[];
  onViewDetails: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (opportunity: Opportunity) => void;
  onStageChange?: (opportunityId: string, newStage: OpportunityStage) => void;
}

const OpportunityKanban: React.FC<OpportunityKanbanProps> = ({
  opportunities,
  onViewDetails,
  onEdit,
  onDelete,
  onStageChange
}) => {
  const { groupOpportunitiesByStage, getStageText, formatAmount } = useOpportunityUtils();
  const groupedOpportunities = groupOpportunitiesByStage(opportunities);
  
  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination || !onStageChange) return;
    
    const { draggableId, destination } = result;
    const newStage = destination.droppableId as OpportunityStage;
    
    onStageChange(draggableId, newStage);
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex w-full space-x-4 p-4 min-w-[1024px]">
        {Object.entries(groupedOpportunities).map(([stage, stageOpportunities]) => (
          <div 
            key={stage} 
            className="flex-1 min-w-[250px] bg-gray-50 rounded-md p-2"
          >
            <h3 className="text-sm font-medium p-2 flex justify-between items-center">
              <span>{getStageText(stage as OpportunityStage)}</span>
              <Badge variant="outline">{stageOpportunities.length}</Badge>
            </h3>
            
            <div className="space-y-2 mt-2">
              {stageOpportunities.map((opportunity) => (
                <Card 
                  key={opportunity.id}
                  className="bg-white cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium line-clamp-2">{opportunity.title}</h4>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => onViewDetails(opportunity)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => onEdit(opportunity)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => onDelete(opportunity)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <div className="text-xs space-y-1">
                      {opportunity.clientName && (
                        <p className="text-muted-foreground">Client: {opportunity.clientName}</p>
                      )}
                      {opportunity.value !== undefined && (
                        <p>
                          <span className="font-medium">Valeur:</span> {formatAmount(opportunity.value)}
                        </p>
                      )}
                      {opportunity.probability !== undefined && (
                        <p>
                          <span className="font-medium">Prob.:</span> {opportunity.probability}%
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {stageOpportunities.length === 0 && (
                <div className="p-3 text-center text-xs text-muted-foreground italic">
                  Aucune opportunité
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityKanban;
