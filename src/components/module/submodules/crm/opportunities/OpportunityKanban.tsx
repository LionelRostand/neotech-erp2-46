
import React from 'react';
import { Card } from "@/components/ui/card";
import { Opportunity, OpportunityStage } from '../types/crm-types';
import { DollarSign, Calendar, User } from 'lucide-react';
import { useOpportunityUtils } from '../hooks/opportunity/useOpportunityUtils';

interface OpportunityKanbanProps {
  opportunities: Opportunity[];
  onOpportunityClick: (opportunity: Opportunity) => void;
  onStageChange: (opportunityId: string, newStage: OpportunityStage) => void;
  loading: boolean;
}

const OpportunityKanban: React.FC<OpportunityKanbanProps> = ({
  opportunities,
  onOpportunityClick,
  onStageChange,
  loading
}) => {
  const { getStageLabel, getStageColor } = useOpportunityUtils();

  // Define all possible stages in order - using the correct values from OpportunityStage type
  const stages: OpportunityStage[] = [
    'lead', 
    'qualified', 
    'needs-analysis', 
    'proposal', 
    'negotiation', 
    'closed-won', 
    'closed-lost'
  ];

  // Group opportunities by stage
  const opportunitiesByStage = stages.reduce((acc, stage) => {
    acc[stage] = opportunities.filter(opp => opp.stage === stage);
    return acc;
  }, {} as Record<OpportunityStage, Opportunity[]>);

  const handleDragStart = (e: React.DragEvent, opportunity: Opportunity) => {
    e.dataTransfer.setData('opportunityId', opportunity.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropStage: OpportunityStage) => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData('opportunityId');
    const opportunity = opportunities.find(opp => opp.id === opportunityId);
    
    if (opportunity && opportunity.stage !== dropStage) {
      onStageChange(opportunityId, dropStage);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500">Chargement des opportunités...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-4 overflow-x-auto pb-4" style={{ minHeight: '70vh' }}>
      {stages.map(stage => (
        <div
          key={stage}
          className="flex flex-col min-w-[250px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, stage)}
        >
          <div 
            className={`p-3 rounded-t-md mb-2 flex justify-between items-center ${getStageColor(stage)}`}
          >
            <h3 className="font-medium text-white">{getStageLabel(stage)}</h3>
            <span className="bg-white bg-opacity-25 text-white px-2 py-0.5 rounded-full text-xs">
              {opportunitiesByStage[stage]?.length || 0}
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {opportunitiesByStage[stage]?.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-md h-24 flex items-center justify-center text-gray-400 text-sm p-4">
                Aucune opportunité
              </div>
            ) : (
              opportunitiesByStage[stage]?.map(opportunity => (
                <Card
                  key={opportunity.id}
                  className="p-3 cursor-pointer hover:shadow-md transition-all bg-white"
                  onClick={() => onOpportunityClick(opportunity)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opportunity)}
                >
                  <h4 className="font-medium mb-2 truncate">{opportunity.name}</h4>
                  <p className="text-sm text-gray-500 mb-1 truncate">{opportunity.clientName}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>{opportunity.value.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(opportunity.closeDate || opportunity.startDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  {opportunity.assignedTo && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span>{opportunity.assignedTo}</span>
                    </div>
                  )}
                  <div className="mt-2 flex items-center">
                    <div 
                      className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"
                    >
                      <div 
                        className="h-2 bg-blue-500" 
                        style={{ width: `${opportunity.probability || 0}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs">{opportunity.probability || 0}%</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OpportunityKanban;
