
import React from 'react';
import { Card } from '@/components/ui/card';
import { RecruitmentStage } from '@/types/recruitment';

interface KanbanColumnProps {
  title: string;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, children }) => (
  <div className="flex-1 min-w-[300px] max-w-[350px]">
    <div className="bg-muted p-4 rounded-t-lg border-b">
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    <div className="p-2 bg-muted/50 rounded-b-lg min-h-[500px]">
      {children}
    </div>
  </div>
);

const RecruitmentKanban = () => {
  const stages: RecruitmentStage[] = [
    'Candidature déposée',
    'CV en cours d\'analyse',
    'Entretien RH',
    'Test technique',
    'Entretien technique',
    'Entretien final',
    'Proposition envoyée',
    'Recrutement finalisé',
    'Candidature refusée'
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-max p-4">
        {stages.map((stage) => (
          <KanbanColumn key={stage} title={stage}>
            <div className="space-y-2">
              {/* This is where recruitment cards will go */}
              <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
                <p className="font-medium text-sm">Exemple de candidat</p>
                <p className="text-xs text-muted-foreground">exemple@email.com</p>
              </Card>
            </div>
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentKanban;
